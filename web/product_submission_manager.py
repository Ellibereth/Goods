import time
import string
import random
import time
import psycopg2
import base64
import email_api
from sql_manager import SqlManager

## this is the same as the submission variables here
## should I just put these in a CSV?
product_submission_database_columns = [
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
							'num_images'
						 ]
product_submission_database_columns = [
							'manufacturer_name',
							'url_link',
							'contact_information',
							'product_name',
							'origin',
							'barcode_upc',
							'barcode_type',
							'additional_info'
						 ]
						 
class ProductSubmissionManager(SqlManager):
	def __init__(self):
		self.USER_SUBMISSION_TABLE = "USER_SUBMISSION_TABLE"
		SqlManager.__init__(self, self.USER_SUBMISSION_TABLE)
		self.creatUserSubmissionTable()

	# initializes the product submission table
	def creatUserSubmissionTable(self):
		self.createNewTableIfNotExists()

	# returns a random alphanumric character with size 20
	# used for generating submission_id
	def id_generator(self, size=20, chars=string.ascii_uppercase + string.digits):
		return ''.join(random.choice(chars) for _ in range(size))

	# checks if the given table has the image id
	def isImageIdTaken(self, image_id):
		column_name = "image_id"
		return self.tableHasEntryWithProperty(column_name, image_id)

	# generates new image id for the given table
	def generateNewImageId(self):
		image_id = self.id_generator()
		while self.isImageIdTaken(image_id):
			image_id = self.id_generator()
		return image_id

	# checks if the given table has the image id
	def isSubmissionIdTaken(self, submission_id):
		column_name = "submission_id"
		return self.tableHasEntryWithProperty(column_name, submission_id)
	
	# generates a new submission_id for the given table
	def generateNewSubmissionId(self):
		submission_id = self.id_generator()
		while self.isSubmissionIdTaken(submission_id):
			submission_id = self.id_generator()
		return submission_id

	def isConfirmationIdTaken(self, confirmation_id):
		column_name = "confirmation_id"
		return self.tableHasEntryWithProperty(column_name, confirmation_id)

	def generateNewConfirmationId(self):
		confirmation_id = self.id_generator()
		while self.isConfirmationIdTaken(confirmation_id):
			confirmation_id = self.id_generator()
		return confirmation_id

	# returns a dictionary with all product submission
	def getProductSubmissions(self):
		return self.tableToDict()
	
	# verifies a product submission by submission_id
	def verifyProductSubmission(self, submission_id):
		if submission_id == None or submission_id == "":
			return
		# if the submission id is not in use, then return 
		elif not self.isSubmissionIdTaken(submission_id):
			return
		else:
			column_name = "verified"
			data = True
			self.updateEntryByKey('submission_id', submission_id, column_name, data)

	# takes submission dictionary as input then writes it to the database
	# also sends the image as an email to darek@manaweb.com
	# this should be refactored, but I'm not sure how to rework it best at this time
	# looking for comments and suggestions
	# Darek Johnson 3/11
	def addProductSubmission(self, submission):
		# write the image_id and store the data
		image_data = submission.get('images')
		if image_data != None:
			num_images = len(image_data)
			submission['num_images'] = num_images
			image_id = self.generateNewImageId()
			count = 0
			for image in image_data:
				# write the image file to memory as a png, if there is image data
				if image != None and image != "":
					image_bytes = image.encode('utf-8')
					image_decoded = base64.decodestring(image_bytes)
					image_name = image_id + "_" + str(count) + ".png"
					with open("./web/static/images/product_submissions/" + image_name, "wb") as fh:
						fh.write(image_decoded)
					submission['image_id'] = image_id
					email_api.sendImageEmail(image_name, image_decoded)
				count = count + 1
		else:
			num_images = 0
		submission['verified'] = False
		submission['num_images'] = num_images
		for key in submission:
			if submission.get(key) == None:
				submission[key] = ""

		## insert into the database
		time_stamp = time.time()
		submission_id = self.generateNewSubmissionId()
		self.insertIntoTableWithInitialValue("submission_id", submission_id)
		## update the other variables
		self.updateEntryByKey("submission_id", submission_id, 'time_stamp', time_stamp)
		self.updateEntryByKey("submission_id", submission_id, 'confirmed', False)
		for key in product_submission_variables:
			if submission.get(key) != None:
				self.updateEntryByKey('submission_id', submission_id, key, submission[key])

	## deletes a product submission by id
	def deleteProductSubmissionById(self, submission_id):
		column_name = "submission_id"
		self.deleteRowFromTableByProperty(column_name, submission_id)


