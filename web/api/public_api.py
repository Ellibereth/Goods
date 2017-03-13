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
							'submission_id', 
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
	data_manager.addProductSubmission(submission)
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
	submission_id = request.json.get("submission_id")
	data_manager = ProductDataManager()
	data_manager.verifyProductSubmission(submission_id)
	data_manager.closeConnection()
	output = {}
	output['result'] = "success"
	return jsonify(output)

@public_api.route('/addProductRequest', methods = ['POST'])
def addProductRequest():
	product_requests = {}
	for key in request_keys:
		product_requests[key] = request.json.get(key)
	data_manager = ProductDataManager()
	data_manager.addProductRequest(product_requests)
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

