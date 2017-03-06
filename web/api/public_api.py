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

submission_variables = ['product_name', 'manufacturer_name', 'origin', 'url_link', 'image_data', 'contact_information', 'barcode_upc']


@public_api.route('/userSubmitProductInformation', methods = ['POST'])
def userSubmitProductInformation():
	submission = {}
	for key in submission_variables:
		submission[key] = request.json.get(key)
	data_manager = ProductDataManager()
	data_manager.addProductEntry(submission)
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
