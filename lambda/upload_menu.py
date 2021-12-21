import json
import boto3
import base64
import time
import random
import string
import re
from re import sub
import qrcode
import io


s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
textract = boto3.client('textract')
qr_url_prefix = "https://cs29hgv9x8.execute-api.us-east-1.amazonaws.com/dev/menu?id="
s3_url_prefix = "https://alex-menu-storage.s3.amazonaws.com/"

def generate_id():
    x = str(round(time.time() * 1000))+''.join(random.choices(string.ascii_letters + string.digits, k=16))
    return x

def lambda_handler(event, context):
        
    body = json.loads(event['body'])
    data = body['image']
    if 'rest_id' not in body:
        return {'statusCode': 404, 'body': json.dumps({'message': 'restaurant_id required'}), 'headers': {'Access-Control-Allow-Origin': '*'}}
    rest_id = body['rest_id']
    if not rest_exist(rest_id):
        return {'statusCode': 401, 'body': json.dumps({'message': 'unauthorized'}), 'headers': {'Access-Control-Allow-Origin': '*'}}
    name = "menu/"+generate_id()+ "-" + body['file_name']
    image = data[data.find(",")+1:]
    dec = base64.b64decode(image + "===")
    s3.put_object(Bucket='alex-menu-storage', Key=name, Body=dec)  
    
    response = textract.detect_document_text(
                    Document = {
                            'S3Object' : {
                                    'Bucket' : 'alex-menu-storage',
                                    'Name' : name
                            }
                    }
            )
            
    print(json.dumps(response)) 
    menu = process_menu(response)
    menu_id = generate_id()
    if len(menu["all"]) and rest_id and menu_id:
        qr_image = generate_qr(qr_url_prefix+menu_id)
        menu_table = dynamodb.Table('menu')
        menu_table.put_item(Item={
            'menu_id':menu_id, 
            'rest_id':rest_id,
            'menu_img': s3_url_prefix+name,
            'qr_img': qr_image
        })
        
        items_table = dynamodb.Table('items')
        with items_table.batch_writer() as writer:
            for item_name in menu["all"]:
                new_item = {
                    'item_id':generate_id(),
                    'menu_id':menu_id,
                    'name':item_name,
                    'lower_name':item_name.lower(),
                    'price':str(menu["all"][item_name])
                }
                writer.put_item(Item=new_item)
        return {'statusCode': 200, 'body': json.dumps({'message': 'successful Menu Uploaded'}), 'headers': {'Access-Control-Allow-Origin': '*'}}
    return {'statusCode': 404, 'body': json.dumps({'message': 'menu not found'}), 'headers': {'Access-Control-Allow-Origin': '*'}}

def rest_exist(id):
    restaurants_table = dynamodb.Table('restaurants')
    try:
        response = restaurants_table.get_item(Key={'id': id})
    except:
        return False
    else:
        if 'Item' in response:
            return response['Item']
        else:
            return False

def generate_qr(url):
    qr = qrcode.QRCode(
        version=1,
        box_size=10,
        border=5
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill='black', back_color='white')

    buffer = io.BytesIO()
    img.save(buffer, "PNG")
    buffer.seek(0)
    name = 'menu/qr/'+generate_id()+'.png'
    s3.put_object(
        Bucket='alex-menu-storage',
        Key=name,
        Body=buffer,
        ContentType='image/png',
    )
    return "https://alex-menu-storage.s3.amazonaws.com/"+name


def tryInt(value):
    try:
        newval = int(value)
        return newval
    except:
        return False

def tryFloat(value):
    try:
        newval = float(value)
        return newval
    except:
        return False

def process_menu(data):
    current_currency = ''
    menu = {
        "breakfast":{},
        "lunch":{},
        "dinner":{},
        "other":{},
        "all":{},
        "currency":current_currency
    }
    try:
        blockTypes = []
        pageId = ""
        pageChilds = []
        menuData = {}
        word_to_line_map = {}
        lines = []
        currency = ['$', '₹', '€']
        is_currency = False
    
        for block in data["Blocks"]:
            if block["BlockType"] not in blockTypes:
                blockTypes.append(block["BlockType"])
            if block["BlockType"] == "PAGE":
                pageId=block["Id"]
                menuData["pageId"] = block["Id"]
                menuData["lines"] = {}
                for r in block["Relationships"]:
                    if r["Type"] == "CHILD":
                        pageChilds = r["Ids"]
            elif block["BlockType"] == "LINE":
                lineId = block["Id"]
                text = block["Text"]
                lines.append(text)
                res = [ele for ele in currency if(ele in text)]
                if res:
                    is_currency = True
                    current_currency = res[0]
                words = {}
                if "Relationships" in block and len(block["Relationships"]):
                    wordsList = block["Relationships"][0]["Ids"]
                    for id in wordsList:
                        word_to_line_map[id] = lineId
                        words[id] = {}
                menuData["lines"][lineId] = {
                    "text":text,
                    "words":words
                    }
            elif block["BlockType"] == "WORD":
                wordId = block["Id"]
                text = block["Text"]
                menuData["lines"][word_to_line_map[wordId]]["words"][wordId] = text
                
    
    
        # print(pageId)
        # print(pageChilds)
        # print(blockTypes)
        # print(lines)
    
        menu_type = ["breakfast","lunch", "dinner", "other"]
        current_type = "other"
        
        prev_text = ""
        is_prev_cur = False
        for l in lines:
            res = [ele for ele in menu_type if(ele in l.lower())]
            if res:
                current_type = res[0]
            if (any(check in l for check in currency) or tryInt(l) or tryFloat(l) ) and not is_prev_cur:
                is_prev_cur = True
                if prev_text != "":
                    g = re.findall("\d+\.\d+", l) #float price
                    price_int_mix = sub(r'[^\d.]', '', l) #join int
                    price_int_split = [int(s) for s in l.split() if s.isdigit()] # split int
                    if price_int_split:
                        price = price_int_split[0]
                    elif g:
                        price = float(g[0])
                    elif price_int_mix:
                        price = float(price_int_mix)
                    else:
                        price = l
                    menu[current_type][prev_text] = price
                    menu["all"][prev_text] = price
            else:
                is_prev_cur = False
            prev_text = l
    except:
        print("An exception occurred")
    return menu