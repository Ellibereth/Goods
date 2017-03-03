from flask import Blueprint, jsonify, request, session, render_template, redirect, url_for
import time
import random
from passlib.hash import argon2
# import jwt
import base64
from database import ProductDataManager

# from py2neo import authenticate, Graph, Node
# authenticate("localhost:7474", "neo4j", "powerplay")
# graph = Graph()

mobile_api = Blueprint('mobile_api', __name__)


@mobile_api.route('/mobileSubmitInformation', methods = ['POST'])
def mobileSubmitProductInformation():
	product_name = request.json['product_name']
	manufacturer_name = request.json['manufacturer_name']
	location = request.json['location']
	url_link = request.json['url_link']
	image_data = request.json['image']
	

	data_manager = ProductDataManager()
	data_manager.addProductEntry(product_name, manufacturer_name, location,url_link, image_data)
	data_manager.closeConnection()
	output = {"result" : "success"}
	return jsonify(output)

# @browser_api.route('/confirmAccount', methods = ['POST'])
# def confirmAccount():
# 	userID = request.json['userID']
# 	user_manager = Users()
# 	user_manager.updateInfo(userID, 'confirmed', True)
# 	user_manager.closeConnection()
# 	encoded = jwt.encode({'userID': userID, 'isAdmin':False}, secret_key, algorithm='HS256')
# 	return jsonify({'result' : 'success', 'jwt' : encoded.decode('utf-8')})
