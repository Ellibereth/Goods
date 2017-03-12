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


## this is the same as the submission variables in product_data_manager.py 
## should I just put these in a CSV?
submission_keys = [
							'unique_id', 
							'image_id',
							'time_stamp',
							'manufacturer_name',
							'url_link',
							'contact_information',
							'product_name',
							'origin',
							'barcode_upc',
							'barcode_type',
							'additional_info',
							'verified',
							'images'
						 ]

request_keys = ['product_description',
				'price_min',
				'price_max',
				'contact_information'
				]
admin_login_password = 'powerplay'

@public_api.route('/addProductSubmission', methods = ['POST'])
def addProductSubmission():
	submission = {}
	for key in submission_keys:
		submission[key] = request.json.get(key)

	data_manager = ProductDataManager()
	data_manager.addUserProductSubmission(submission)
	data_manager.closeConnection()
	output = {"result" : "success"}

	return jsonify(output)

@public_api.route('/getProductSubmissions', methods =['POST'])
def getProductSubmissions():
	data_manager = ProductDataManager()
	product_submissions = data_manager.getProductSubmissions()
	data_manager.closeConnection()
	return jsonify(product_submissions)

@public_api.route('/verifyProductSubmission', methods =['POST'])
def verifySubmission():
	unique_id = request.json.get("unique_id")
	data_manager = ProductDataManager()
	data_manager.verifyProductSubmission(unique_id)
	data_manager.closeConnection()
	output = {}
	output['result'] = "success"
	return jsonify(output)

@public_api.route('/addProductRequest', methods = ['POST'])
def addProductRequest():
	request = {}
	for key in request_keys:
		request[key] = request.json.get(key)

	data_manager = ProductDataManager()
	data_manager.addUserProductRequest(request)
	data_manager.closeConnection()
	output = {}
	output['result'] = "success"
	return jsonify(output) 

@public_api.route('/checkAdminLogin', methods =['POST'])
def checkAdminLogin():
	password = request.json.get('password')
	output = {}
	if password == admin_login_password:
		output['result'] = 'success'
	else:
		output['result'] = 'failure'
	return jsonify(output)

# @browser_api.route('/confirmAccount', methods = ['POST'])
# def confirmAccount():
# 	userID = request.json['userID']
# 	user_manager = Users()
# 	user_manager.updateInfo(userID, 'confirmed', True)
# 	user_manager.closeConnection()
# 	encoded = jwt.encode({'userID': userID, 'isAdmin':False}, secret_key, algorithm='HS256')
# 	return jsonify({'result' : 'success', 'jwt' : encoded.decode('utf-8')})
