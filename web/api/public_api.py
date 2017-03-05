from flask import Blueprint, jsonify, request, session, render_template, redirect, url_for
import time
import random
from passlib.hash import argon2
# import jwt
import base64
from product_data_manager import ProductDataManager

# from py2neo import authenticate, Graph, Node
# authenticate("localhost:7474", "neo4j", "powerplay")
# graph = Graph()

public_api = Blueprint('public_api', __name__)


@public_api.route('/userSubmitProductInformation', methods = ['POST'])
def userSubmitProductInformation():
	product_name = request.json.get('product_name')
	manufacturer_name = request.json.get('manufacturer_name')
	location = request.json.get('location')
	url_link = request.json.get('url_link')
	image_data = request.json.get('image_data')
	contact_information = request.json.get('contact_information')

	
	data_manager = ProductDataManager()
	data_manager.addProductEntry(product_name, manufacturer_name, location,url_link, contact_information, image_data)
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
