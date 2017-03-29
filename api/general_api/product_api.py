from flask import Blueprint, jsonify, request
import time
from passlib.hash import argon2
import base64

from ..utility.market_product import MarketProductManager
from ..utility.table_names import ProdTables


class Labels:
	Success = "success"
	ProductId = "product_id"
	ImageData = "image_data"
	Price = "price"
	Manufacturer = "manufacturer"
	Name = "name"
	Category = "category"
	Description = "description"
	Brand = "brand"


market_product_keys = [Labels.Price, Labels.Manufacturer, Labels.Name, Labels.Category, Labels.Description , Labels.Brand]

product_api = Blueprint('product_api', __name__)

@product_api.route('/addMarketProduct', methods = ['POST'])
def addMarketProduct():
	market_product = {}
	for key in market_product_keys:
		market_product[key] = request.json.get(key)
	market = MarketProductManager(ProdTables.MarketProductTable)
	output = market.addMarketProduct(market_product)
	market.closeConnection()
	return jsonify(output)

@product_api.route('/getMarketProducts', methods = ['POST'])
def getMarketProducts():
	market = MarketProductManager(ProdTables.MarketProductTable)
	market_products = market.getMarketProducts()
	market.closeConnection()
	return jsonify(market_products)


@product_api.route('/getMarketProductInfo', methods = ['POST'])
def getMarketProductInfo():
	## yes Ben I know this is a magic string / hard coded
	## tell me how to make this better!
	product_id = request.json.get(Labels.ProductId)
	market = MarketProductManager(ProdTables.MarketProductTable)
	market_product = market.getMarketProductById(product_id)
	market.closeConnection()
	return jsonify(market_product)

@product_api.route('/uploadMarketProductImage', methods = ['POST'])
def uploadMarketProductImage():
	## yes Ben I know this is a magic string / hard coded
	## tell me how to make this better!
	product_id = request.json.get(Labels.ProductId)
	image_data = request.json.get(Labels.ImageData)
	image_bytes = image_data.encode('utf-8')
	image_decoded = base64.decodestring(image_bytes)
	market = MarketProductManager(ProdTables.MarketProductTable)
	market.uploadMarketProductImage(product_id, image_decoded)
	market.closeConnection()
	return jsonify({Labels.Success : True})


