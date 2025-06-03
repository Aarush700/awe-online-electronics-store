import base64
from decimal import Decimal
import os

def convert_cart_item(item):
    item = dict(item)
    if 'price' in item and isinstance(item['price'], Decimal):
        item['price'] = float(item['price'])
    if 'image' in item:
        if isinstance(item['image'], bytes):
            item['image'] = base64.b64encode(item['image']).decode('utf-8')
        elif isinstance(item['image'], str) and not item['image'].startswith('http'):
            item['image'] = f"http://127.0.0.1:5000/assets/images/{item['image']}"
    return item

def convert_product_data(product):
    product = dict(product)
    if 'image' in product and isinstance(product['image'], bytes):
        product['image'] = product['image'].decode('utf-8')
    if 'image' in product and isinstance(product['image'], str):
        filename = os.path.basename(product['image'])
        product['image'] = f'http://127.0.0.1:5000/assets/images/{filename}' if filename else 'http://127.0.0.1:5000/assets/images/default.png'
    if 'price' in product and isinstance(product['price'], Decimal):
        product['price'] = float(product['price'])
    if 'description' in product and product['description'] is None:
        product['description'] = 'No description available.'
    return product

def convert_order_item(item):
    item = dict(item)
    if 'price' in item and isinstance(item['price'], Decimal):
        item['price'] = float(item['price'])
    if 'total' in item and isinstance(item['total'], Decimal):
        item['total'] = float(item['total'])
    if 'image' in item:
        if isinstance(item['image'], bytes):
            item['image'] = base64.b64encode(item['image']).decode('utf-8')
        elif isinstance(item['image'], str) and not item['image'].startswith('http'):
            item['image'] = f"http://127.0.0.1:5000/assets/images/{item['image']}"
    return item