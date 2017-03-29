from flask import Blueprint, jsonify, request
import time
from passlib.hash import argon2
import base64

from ..utility.product_submission_manager import ProductSubmissionManager
from ..utility.table_names import ProdTables


class Labels:
	Success = "success"
	ProductId = "product_id"
	ConfirmationId = "confirmation_id"
	ImageData = "image_data"
	SubmissionId = "submission_id"
	TimeStamp = "time_stamp"
	ImageId = "image_id"
	ContactInformation = "contact_information"
	ProductName = "product_name"
	Origin = "origin"
	BarcodeUpc = "barcode_upc"
	BarcodeType = "barcode_type"
	Verified = "verified"
	Images = "images"
	AdditionalInfo = "additional_info"
	UrlLink = "url_link"
	ManufacturerName = "manufacturer_name"

product_submission_api = Blueprint('product_submission_api', __name__)


## this is the same as the submission variables in product_data_manager.py 
## should I just put these in a CSV?
submission_keys = [
					Labels.SubmissionId, 
					Labels.ImageId,
					Labels.TimeStamp,
					Labels.ManufacturerName,
					Labels.UrlLink,
					Labels.ContactInformation,
					Labels.ProductName,
					Labels.Origin,
					Labels.BarcodeUpc,
					Labels.BarcodeType,
					Labels.AdditionalInfo,
					Labels.Verified,
					Labels.Images
				 ]


@product_submission_api.route('/addProductSubmission', methods = ['POST'])
def addProductSubmission():
	submission = {}
	for key in submission_keys:
		submission[key] = request.json.get(key)
	submission_manager = ProductSubmissionManager()
	submission_manager.addProductSubmission(submission)
	submission_manager.closeConnection()
	output = {Labels.Success : False}
	return jsonify(output)

@product_submission_api.route('/getProductSubmissions', methods =['POST'])
def getProductSubmissions():
	submission_manager = ProductSubmissionManager()
	product_submissions = submission_manager.getProductSubmissions()
	submission_manager.closeConnection()
	return jsonify(product_submissions)
