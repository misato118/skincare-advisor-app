import os
import json
import random
import uuid

### This file was used to modify product.json and customer.json

# import json file
script_dir = os.path.dirname(__file__)
rel_path = "customer.json"
abs_file_path = os.path.join(script_dir, rel_path)
f_customer = open(abs_file_path, "r+")
data_customer = json.load(f_customer)

rel_path_product = "product.json"
abs_product_path = os.path.join(script_dir, rel_path_product)
f_product = open(abs_product_path, "r+")
data_product = json.load(f_product)

rel_path_review = "review.json"
abs_review_path = os.path.join(script_dir, rel_path_review)
f_review = open(abs_review_path, "r+")
data_review = json.load(f_review)

# Modify product.json
brand_arr = ["Ihada", "Innisfree", "Dior", "Curel", "Shiseido", "rom&nd", "Kanebo", "SOFINA iP", "Merano CC", "SABON",
             "FANCL", "suisai", "Orbis", "Biore", "KATE", "Wonjungyo", "RMK", "NARS", "msh", "D-UP", "SUQQU"]

field_key = "categoryName"

category_arr = []

def get_sub_category(main_category, sub_category):
    new_sub_category = ""
    if main_category == "Components": # components
        match sub_category:
            case "Chains":
                new_sub_category = new_sub_category + "Cleansing"
            case "Forks":
                new_sub_category = new_sub_category + "Essence" 
            case "Saddles":
                new_sub_category = new_sub_category + "Eyecare"
            case "Pedals":
                new_sub_category = new_sub_category + "Facemask" 
            case "Brakes":
                new_sub_category = new_sub_category + "Facewash" 
            case "Headsets":
                new_sub_category = new_sub_category + "Toner" 
            case _:
                new_sub_category = new_sub_category + "Toner" 
    elif main_category == "Bikes": # bikes
        match sub_category:
            case "Touring Bikes":
                new_sub_category = new_sub_category + "Face UV"
            case "Mountain Bikes":
                new_sub_category = new_sub_category + "Body UV" 
            case _:
                new_sub_category = new_sub_category + "Face UV" 
    elif main_category == "Accessories": # accessories
        match sub_category:
            case "Bottles and Cages":
                new_sub_category = new_sub_category + "Eyebrow"
            case "Tires and Tubes":
                new_sub_category = new_sub_category + "Eyeliner" 
            case "Panniers":
                new_sub_category = new_sub_category + "Eyeshadow"
            case _:
                new_sub_category = new_sub_category + "Mascara" 
    else: # bodycare
        match sub_category:
            case "Tights":
                new_sub_category = new_sub_category + "Daily Care"
            case "Gloves":
                new_sub_category = new_sub_category + "Special Care" 
            case _:
                new_sub_category = new_sub_category + "Daily Care"
    
    return new_sub_category


def get_new_category(existing_category):
    new_category = ""
    index = existing_category.find(",")
    main_category = existing_category[:index]
    sub_category = existing_category[index + 2:]
    match main_category:
        case "Components":
           new_category = new_category + "Basic, "
        case "Bikes":
           new_category = new_category + "Sunscreen, " 
        case "Accessories":
           new_category = new_category + "Makeup, " 
        case _:
           new_category = new_category + "Bodycare, " 

    new_category = new_category + get_sub_category(main_category, sub_category)
    return new_category


# Modify categoryId, categoryName, name, description, and delete tags 
for i in data_customer["products"]: # i is each item
    for j in i: # j is prop name
        random_brand = random.choice(brand_arr)
        if j == "categoryName":
            new_category_name = get_new_category(i[j])
            i[j] = new_category_name
            if new_category_name == "Basic, Toner":
                i["categoryId"] = "AB952F9F-5ABA-4251-BC2D-AFF8DF412A4A"
            elif new_category_name == "Sunscreen, Face UV":
                i["categoryId"] = "75BF1ACB-168D-469C-9AA3-1FD26BB4EA4C"
            elif new_category_name == "Makeup, Mascara":
                i["categoryId"] = "7FF64215-1F7A-4CDF-9BA1-AD6ADC6B5D1C"
            elif new_category_name == "Bodycare, Daily Care":
                i["categoryId"] = "AA28AE74-D57C-4B23-B5F7-F919E1C5844E"
        if j == "name":
            category_name = i["categoryName"]
            index = category_name.find(",")
            i[j] = random_brand + " " + i["categoryName"][index + 2:]
        if j == "description":
            name = i["name"]
            index = name.find(",")
            i[j] = "The product produced by " + random_brand + " and called " + name
    i.pop("tags") # Remove tags prop

# Modify customer.json
skin_types = ["Dry", "Oily", "Normal", "Combination", "Sensitive"]
regions = ["Africa", "Asia", "Central America", "Europe", "Middle East", "North America", "Pacific", "South America"]
birth_gender = ["male", "female"]

# Add skin type, region, age, gender, review list
for i in data_customer: # i is each item
    i["region"] = random.choices(regions, weights=[0.01, 0.34, 0.2, 0.15, 0.1, 0.2, 0.1, 0.1], k=1)[0]
    i["age"] = random.randint(15, 80)
    i["gender"] = random.choices(birth_gender)[0]
    i["reviews"] = []
    i["skinType"] = random.choices(skin_types, weights=[0.3, 0.2, 0.1, 0.3, 0.1], k=1)[0]

name_arr = []
for i in data_product["products"]:
    if i["name"] not in name_arr:
        name_arr.append({ "sku": i["sku"], "name": i["name"], "price": i["price"] })

for i in data_customer: # i is each item
    for j in i:
        if j == "type" and i[j] == "salesOrder":
            order_count = len(i["details"])
            new_details = random.choices(name_arr, k=order_count)
            for l in new_details:
                l["quantity"] = random.randint(1, 10)
            i["details"] = new_details
            #i.pop("region")
            #i.pop("age")
            #i.pop("reviews")
            #i.pop("skinType")
            #i.pop("gender")

reviews = []

comments = [{"rating": 5, "comment": "This was very good. I would definitely buy it again!"}, {"rating": 5, "comment": "I love this so much!"},
            {"rating": 4, "comment": "This was decently good."}, {"rating": 4, "comment": "I might buy this again in the future."},
            {"rating": 3, "comment": "The product was ok."}, {"rating": 3, "comment": "The quality was alright."},
            {"rating": 2, "comment": "I didn't really like this product."}, {"rating": 2, "comment": "This wasn't for me..."},
            {"rating": 1, "comment": "Terrible!"}, {"rating": 1, "comment": "Never buy this again."}]

id_sku_dict = []

for i in data_product:
    id_sku_dict.append({ "id": i["id"], "sku": i["sku"] })

def find_product_id(sku):
    for x in id_sku_dict:
        if x["sku"] == sku:
            return x["id"]

def add_review_to_customer(cus_id, reviews):
    for x in data_customer:
        if x["type"] == "customer" and x["id"] == cus_id:
            x["reviews"] = reviews
            break

for i in data_customer: # i is each item
    for j in i:
        if j == "type" and i[j] == "salesOrder":
            reviews = []
            customer_id = i["customerId"]
            max_review_len = len(i["details"])
            num_of_reviews = random.randint(0, max_review_len)
            products_for_review = random.choices(i["details"], k=num_of_reviews)

            for product in products_for_review:
                review_id = uuid.uuid4()
                rating_comment = random.choices(comments, k=1)
                product_id = find_product_id(product["sku"])
                reviews.append({ "id": review_id, "customerId": customer_id, "productId": product_id, "reviewDate": "2014-07-07T00:00:00",
                                "comment": rating_comment[0]["comment"], "rating": rating_comment[0]["rating"] })
                data_review.append()
            
            add_review_to_customer(customer_id, reviews)

class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, uuid.UUID):
            # if the obj is uuid, we simply return the value of uuid
            return obj.hex
        return json.JSONEncoder.default(self, obj)

f_product.seek(0) 
json.dump(data_product, f_product, indent=4)
f_product.truncate()
f_product.close()

f_customer.seek(0) 
json.dump(data_customer, f_customer, indent=4)
f_customer.truncate()
f_customer.close()

f_review.seek(0)
json.dump(data_review, f_review, indent=4, cls=UUIDEncoder)
f_review.truncate()
f_review.close()
