import json
import boto3
# from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr


dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    if event["queryStringParameters"] is None or "id" not in event["queryStringParameters"]:
        return {'statusCode': 404, 'body': json.dumps({'message': 'restaurant_id required'}), 'headers': {'Access-Control-Allow-Origin': '*'}}

    menu_id = event["queryStringParameters"]['id']
    
    items = get_item(menu_id)
    
    menus = get_menu([menu_id])
    
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
    
    data = {
        "items":items,
        "menus":menus_obj,
        "restaurants":rests_obj
    }
    
    return {
        'statusCode': 200,
        'body': json.dumps(data),
        'headers': {
            "Content-Type" : "application/json",
            "Access-Control-Allow-Origin" : "*",
            "Allow" : "GET, OPTIONS, POST",
            "Access-Control-Allow-Methods" : "GET, OPTIONS, POST",
            "Access-Control-Allow-Headers" : "*"
        }
    }


def get_item(id):
    table = dynamodb.Table('items')
    
    response = table.scan(FilterExpression=Attr('menu_id').eq(id))
    data = response['Items']
    
    while 'LastEvaluatedKey' in response:
        response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        data.extend(response['Items'])
    return data



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