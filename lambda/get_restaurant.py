import json
import boto3
# from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr


dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    if event["queryStringParameters"] is None or "id" not in event["queryStringParameters"]:
        return {'statusCode': 404, 'body': json.dumps({'message': 'restaurant_id required'}), 'headers': {'Access-Control-Allow-Origin': '*'}}

    rest_id = event["queryStringParameters"]['id']
    rest = get_rest(rest_id)
    if not rest:
        return {'statusCode': 401, 'body': json.dumps({'message': 'unauthorized'}), 'headers': {'Access-Control-Allow-Origin': '*'}}
        
    menu = get_menu(rest_id)
    rest["menus"] = menu
    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps(rest),
        'headers': {
            "Content-Type" : "application/json",
            "Access-Control-Allow-Origin" : "*",
            "Allow" : "GET, OPTIONS, POST",
            "Access-Control-Allow-Methods" : "GET, OPTIONS, POST",
            "Access-Control-Allow-Headers" : "*"
        }
    }


def get_rest(id):
    restaurants_table = dynamodb.Table('restaurants')
    try:
        response = restaurants_table.get_item(Key={'id': id})
    except:
        return {}
    else:
        if 'Item' in response:
            return response['Item']
        else:
            return {}

def get_menu(id):
   
    table = dynamodb.Table('menu')
    
    response = table.scan(FilterExpression=Attr('rest_id').eq(id))
    data = response['Items']
    
    while 'LastEvaluatedKey' in response:
        response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        data.extend(response['Items'])
    return data

