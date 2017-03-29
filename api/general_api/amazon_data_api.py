from flask import Blueprint, jsonify, request
from ..utility.feedback_manager import FeedbackManager
from ..utility.table_names import ProdTables


class Labels:
	Success = "success"
	Password = "password"
	Name = "name"
	Email = "email"
	Feedback = "feedback"
	

amazon_data_api = Blueprint('amazon_data_api', __name__)

@amazon_data_api.route('/isAsinMadeInUsa', methods = ['POST'])
def isAsinMadeInUsa():
	asin = request.json.get(Labels.Asin)
	amazon = AmazonManager(ProdTables.AmazonScrapingTable)
	isUsa = amazon.isAsinMadeInUsa(asin)
	amazon.closeConnection()
	output = {}
	output[Labels.IsUsa] = isUsa
	return jsonify(output)

@amazon_data_api.route('/getAmazonProductInformationFromAsin', methods = ['POST'])
def getAmazonProductInformationFromAsin():
	asin = request.json.get(Labels.Asin)
	amazon = AmazonManager(ProdTables.AmazonScrapingTable)
	product = amazon.getProductInfoByAsin(asin)
	amazon.closeConnection()
	return jsonify(product)
