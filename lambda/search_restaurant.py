import json
import boto3
# from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr


dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    if event["queryStringParameters"] is None or "query" not in event["queryStringParameters"]:
        return {'statusCode': 404, 'body': json.dumps({'message': 'restaurant_id required'}), 'headers': {'Access-Control-Allow-Origin': '*'}}

    query = event["queryStringParameters"]['query']
    query = query.lower()
    items = search_items(query)
    
    menu_ids = []
    items_json = []
    for item in items:
        tmp_item = {}
        for i in item:
            if i == "menu_id":
                menu_ids.append(item[i]["S"])
            tmp_item[i] = item[i]["S"]
        items_json.append(tmp_item)
    
    menu_ids = list(set(menu_ids))
    menus = get_menu(menu_ids)
    
    menus_obj = {}
    rests_obj = {}
    if menus:
        rest_ids = []
        for m in menus["Responses"]["menu"]:
            tmp_menu = {}
            for i in m:
                tmp_menu[i] = m[i]["S"]
                if i == "rest_id":
                    rest_ids.append(m[i]["S"])
            menus_obj[tmp_menu["menu_id"]] = tmp_menu
                    
        rest_ids = list(set(rest_ids))
        rests = get_rest(rest_ids)
        
        if rests:
            for m in rests["Responses"]["restaurants"]:
                tmp_rest = {}
                for i in m:
                    tmp_rest[i] = m[i]["S"]
                rests_obj[tmp_rest["id"]] = tmp_rest
    
    searched_rests = search_rests(query)
    for item in searched_rests:
        tmp_item = {}
        for i in item:
            tmp_item[i] = item[i]["S"]
        if tmp_item["id"] not in rests_obj:
            rests_obj[tmp_item["id"]] = tmp_item
    data = {
        "items":items_json,
        "menus":menus_obj,
        "restaurants":rests_obj
    }
    return {
        'statusCode': 200,
        'headers': {
            "Content-Type" : "application/json",
            "Access-Control-Allow-Origin" : "*",
            "Allow" : "GET, OPTIONS, POST",
            "Access-Control-Allow-Methods" : "GET, OPTIONS, POST",
            "Access-Control-Allow-Headers" : "*"
        },
        'body': json.dumps(data)
    }


def search_items(query):
    dynamodb = boto3.client('dynamodb')
    resp = dynamodb.execute_statement(Statement='SELECT * FROM "items" WHERE contains("lower_name", ?)', Parameters =[{'S': query}])
    return resp["Items"]


def search_rests(query):
    dynamodb = boto3.client('dynamodb')
    resp = dynamodb.execute_statement(Statement='SELECT * FROM "restaurants" WHERE contains("lower_name", ?)', Parameters =[{'S': query}])
    return resp["Items"]

def get_menu(query):
    itemList = []
    for item in query:
        itemList.append({'menu_id':{'S':item}})
    if not len(itemList):
        return False
    dynamodb = boto3.client('dynamodb')
    response = dynamodb.batch_get_item(
        RequestItems={
            "menu": {
                "Keys": itemList
            }
        }
    )
    return response


def get_rest(query):
    itemList = []
    for item in query:
        itemList.append({'id':{'S':item}})
    if not len(itemList):
        return False
    dynamodb = boto3.client('dynamodb')
    response = dynamodb.batch_get_item(
        RequestItems={
            "restaurants": {
                "Keys": itemList
            }
        }
    )
    return response
