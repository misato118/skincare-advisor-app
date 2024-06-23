#from product import Product, ProductList
#from customer import Customer, CustomerList
#from sales_order import SalesOrder, SalesOrderList

from models import Product, ProductList, Customer, CustomerList, SalesOrder, SalesOrderList

import os
from openai import AzureOpenAI
from dotenv import load_dotenv
import pymongo
import requests
import json
import urllib
from pymongo import UpdateOne, DeleteMany

load_dotenv("./.env")

chatClient = AzureOpenAI(
    azure_endpoint = os.getenv("AOAI_ENDPOINT"), 
    api_key = os.getenv("AOAI_KEY"),  
    api_version = "2024-02-01",
    azure_deployment = os.getenv("COMPLETIONS_DEPLOYMENT_NAME")
)

chatResponse = chatClient.chat.completions.create(
    model = "gpt-35-turbo",
    messages = [
        {"role": "system", "content": "You are a helpful, fun and friendly sales assistant for Cosmic Works, a skicare store."},
        {"role": "user", "content": "Do you sell skincare products?"},
        {"role": "assistant", "content": "Yes, we do sell skincare products. What kind of skincare products are you looking for?"},
        {"role": "user", "content": "I'm not sure what I'm looking for. Could you help me decide?"}
    ]
)

#print(chatResponse.choices[0].message.content)

cosmosdb_connection_string = os.getenv('DB_CONNECTION_STRING')
cosmos_mongo_user = os.getenv('cosmosClusterAdmin')
cosmos_mongo_pwd = os.getenv('cosmosClusterPassword')

# Replace placeholders in the connection string with actual values
cosmosdb_connection_string = cosmosdb_connection_string.replace("<user>", urllib.parse.quote_plus(cosmos_mongo_user))
cosmosdb_connection_string = cosmosdb_connection_string.replace("<password>", urllib.parse.quote_plus(cosmos_mongo_pwd))

client = pymongo.MongoClient(cosmosdb_connection_string)
db = client.cosmic_works
# empty the collections
db.products.bulk_write([DeleteMany({})])
db.customers.bulk_write([DeleteMany({})])
db.sales.bulk_write([DeleteMany({})])

curr_dir = os.path.dirname(__file__)

product_data_path = os.path.join(curr_dir, "data", "product.json")

customer_data_path = os.path.join(curr_dir, "data", "customer.json")

# Add product data to database using bulkwrite and updateOne with upsert
# Get cosmic works product data from github
#product_raw_data = "https://cosmosdbcosmicworks.blob.core.windows.net/cosmic-works-small/product.json"
product_f = open(product_data_path)
product_raw_data = json.load(product_f)
#product_data = ProductList(items=[Product(**data) for data in requests.get(product_raw_data).json()])

product_data = ProductList(items=[Product(**data) for data in product_raw_data])
result = db.products.bulk_write([ UpdateOne({"_id": prod.id}, {"$set": prod.model_dump(by_alias=True)}, upsert=True) for prod in product_data.items ])

customer_f = open(customer_data_path)
customer_raw_data = json.load(customer_f)
#customer_sales_raw_data = "https://cosmosdbcosmicworks.blob.core.windows.net/cosmic-works-small/customer.json"
#response = requests.get(customer_sales_raw_data)
# override decoding
#response.encoding = 'utf-8-sig'
#response_json = response.json()
# filter where type is customer
customers = [cust for cust in customer_raw_data if cust["type"] == "customer"]
# filter where type is salesOrder
sales_orders = [sales for sales in customer_raw_data if sales["type"] == "salesOrder"]

customer_data = CustomerList(items=[Customer(**data) for data in customers])
result2 = db.customers.bulk_write([ UpdateOne({"_id": cust.id}, {"$set": cust.model_dump(by_alias=True)}, upsert=True) for cust in customer_data.items])
print(result2.bulk_api_result)

sales_data = SalesOrderList(items=[SalesOrder(**data) for data in sales_orders])
result3 = db.sales.bulk_write([ UpdateOne({"_id": sale.id}, {"$set": sale.model_dump(by_alias=True)}, upsert=True) for sale in sales_data.items])
print(result3.bulk_api_result)

client.close()