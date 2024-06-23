import os
import pymongo
import urllib
import time
import json
import sys
from openai import AzureOpenAI
from dotenv import load_dotenv
from tenacity import retry, wait_random_exponential, stop_after_attempt

load_dotenv("./.env")

AZURE_ENDPOINT = os.getenv("AOAI_ENDPOINT")
API_KEY = os.getenv("AOAI_KEY")
API_VERSION = "2024-02-01"

EMBEDDINGS_DEPLOYMENT_NAME = os.getenv("EMBEDDINGS_DEPLOYMENT_NAME")
COMPLETIONS_DEPLOYMENT_NAME = os.getenv("COMPLETIONS_DEPLOYMENT_NAME")
AOAI_API_VERSION = os.getenv("AOAI_API_VERSION")

cosmosdb_connection_string = os.getenv('DB_CONNECTION_STRING')
cosmos_mongo_user = os.getenv('cosmosClusterAdmin')
cosmos_mongo_pwd = os.getenv('cosmosClusterPassword')

# Replace placeholders in the connection string with actual values
cosmosdb_connection_string = cosmosdb_connection_string.replace("<user>", urllib.parse.quote_plus(cosmos_mongo_user))
cosmosdb_connection_string = cosmosdb_connection_string.replace("<password>", urllib.parse.quote_plus(cosmos_mongo_pwd))

db_client = pymongo.MongoClient(cosmosdb_connection_string)
# Create database to hold cosmic works data
# MongoDB will create the database if it does not exist
db = db_client.cosmic_works

ai_client = AzureOpenAI(
    azure_endpoint = AZURE_ENDPOINT,
    api_version = AOAI_API_VERSION,
    api_key = API_KEY
)

@retry(wait=wait_random_exponential(min=1, max=20), stop=stop_after_attempt(3))
def generate_embeddings(text: str):
    '''
    Generate embeddings from string of text using the deployed Azure OpenAI API embeddings model.
    This will be used to vectorize document data and incoming user messages for a similarity search with
    the vector index.
    '''
    response = ai_client.embeddings.create(input=text, model=EMBEDDINGS_DEPLOYMENT_NAME)
    embeddings = response.data[0].embedding
    time.sleep(0.5) # rest period to avoid rate limiting on AOAI
    return embeddings

# demonstrate embeddings generation using a test string
test = "hello, world"
#print(generate_embeddings(test))

def add_collection_content_vector_field(collection_name: str):
    '''
    Add a new field to the collection to hold the vectorized content of each document.
    '''
    collection = db[collection_name]
    bulk_operations = []
    cursor = collection.find({}, no_cursor_timeout=True)
    for doc in cursor:
        # remove any previous contentVector embeddings
        if "contentVector" in doc:
            del doc["contentVector"]

        # generate embeddings for the document string representation
        content = json.dumps(doc, default=str)
        content_vector = generate_embeddings(content)       
        
        bulk_operations.append(pymongo.UpdateOne(
            {"_id": doc["_id"]},
            {"$set": {"contentVector": content_vector}},
            upsert=True
        ))
    cursor.close()
    # execute bulk operations
    collection.bulk_write(bulk_operations)

# Add vector field to products documents - this will take approximately 3-5 minutes due to rate limiting
add_collection_content_vector_field("products")
print("Products Load Done")

# Add vector field to customers documents - this will take approximately 1-2 minutes due to rate limiting
add_collection_content_vector_field("customers")
print("Customers Load Done")

# Add vector field to customers documents - this will take approximately 15-20 minutes due to rate limiting
add_collection_content_vector_field("sales")
print("Sales Load Done")

# Create the products vector index
db.command({
  'createIndexes': 'products',
  'indexes': [
    {
      'name': 'VectorSearchIndex',
      'key': {
        "contentVector": "cosmosSearch"
      },
      'cosmosSearchOptions': {
        'kind': 'vector-ivf',
        'numLists': 1,
        'similarity': 'COS',
        'dimensions': 1536
      }
    }
  ]
})

# Create the customers vector index
db.command({
  'createIndexes': 'customers',
  'indexes': [
    {
      'name': 'VectorSearchIndex',
      'key': {
        "contentVector": "cosmosSearch"
      },
      'cosmosSearchOptions': {
        'kind': 'vector-ivf',
        'numLists': 1,
        'similarity': 'COS',
        'dimensions': 1536
      }
    }
  ]
})

# Create the sales vector index
db.command({
  'createIndexes': 'sales',
  'indexes': [
    {
      'name': 'VectorSearchIndex',
      'key': {
        "contentVector": "cosmosSearch"
      },
      'cosmosSearchOptions': {
        'kind': 'vector-ivf',
        'numLists': 1,
        'similarity': 'COS',
        'dimensions': 1536
      }
    }
  ]
})

def vector_search(collection_name, query, num_results=3):
    """
    Perform a vector search on the specified collection by vectorizing
    the query and searching the vector index for the most similar documents.

    returns a list of the top num_results most similar documents
    """
    collection = db[collection_name]
    query_embedding = generate_embeddings(query)    
    pipeline = [
        {
            '$search': {
                "cosmosSearch": {
                    "vector": query_embedding,
                    "path": "contentVector",
                    "k": num_results
                },
                "returnStoredSource": True }},
        {'$project': { 'similarityScore': { '$meta': 'searchScore' }, 'document' : '$$ROOT' } }
    ]
    results = collection.aggregate(pipeline)
    return results

def print_product_search_result(result):
    '''
    Print the search result document in a readable format
    '''
    print(f"Similarity Score: {result['similarityScore']}")  
    print(f"Name: {result['document']['name']}")   
    print(f"Category: {result['document']['categoryName']}")
    print(f"SKU: {result['document']['categoryName']}")
    print(f"_id: {result['document']['_id']}\n")

query = "What skincare products do you have?"
results = vector_search("products", query, num_results=4)
for result in results:
    print_product_search_result(result)

query = "What do you have that is made by Innisfree?"
results = vector_search("products", query, num_results=4)
for result in results:
    print_product_search_result(result)   

# A system prompt describes the responsibilities, instructions, and persona of the AI.
system_prompt = """
You are a helpful, fun and friendly sales assistant for Cosmic Works, a skincare store. 
Your name is Cosmo.
You are designed to answer questions about the products that Cosmic Works sells.

Only answer questions related to the information provided in the list of products below that are represented
in JSON format.

If you are asked a question that is not in the list, respond with "I don't know."

List of products:
"""

def rag_with_vector_search(question: str, num_results: int = 3):
    """
    Use the RAG model to generate a prompt using vector search results based on the
    incoming question.  
    """
    # perform the vector search and build product list
    results = vector_search("products", question, num_results=num_results)
    product_list = ""
    for result in results:
        if "contentVector" in result["document"]:
            del result["document"]["contentVector"]
        product_list += json.dumps(result["document"], indent=4, default=str) + "\n\n"

    # generate prompt for the LLM with vector results
    formatted_prompt = system_prompt + product_list

    # prepare the LLM request
    messages = [
        {"role": "system", "content": formatted_prompt},
        {"role": "user", "content": question}
    ]

    completion = ai_client.chat.completions.create(messages=messages, model=COMPLETIONS_DEPLOYMENT_NAME)
    return completion.choices[0].message.content

print(rag_with_vector_search("What skincare products do you have?", 5))

print(rag_with_vector_search("What are the names and skus of mascaras?", 5))