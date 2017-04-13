import boto3
import urllib.request
import os

# Let's use Amazon S3

PUBLIC_PHOTOS = "publicmarketproductphotos"

class S3:
	s3 = boto3.resource('s3',
			aws_access_key_id="AKIAJDIH6XBW42FXQX2Q",
			aws_secret_access_key="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"
		)
	base_url = "https://s3-us-west-2.amazonaws.com"

		

	# takes photo_data input as a buffered reader
	# see data = open('test.png', 'rb') data type
	# gave up on writing the image byte string to a 
	@staticmethod
	def uploadProductImage(image_key, image_data):
		bucket_name = PUBLIC_PHOTOS
		if image_data == None:
			print("dude data")
			return
		transfer_dir = './api/s3/transfer/'
		with open(transfer_dir + image_key, "wb") as f:
			f.write(image_data)
			
		image_file = open(transfer_dir + image_key, 'rb')
		self.s3.Bucket(bucket_name).put_object(
			Key= image_key, 
			Body=image_file
		)
		os.remove(transfer_dir + image_key)

	# gets the photo of the image by ID
	@staticmethod
	def getAmazonUrl(bucket_name, image_key):
		return base_url + "/" + bucket_name + "/" + image_key + ".jpg"

	# deletes the image with the given key in the bucket for product images
	@staticmethod
	def deleteProductImage(image_key):
		bucket = s3.Bucket(PUBLIC_PHOTOS)
		bucket.delete_key(image_key)

	# returns the data as a bytes object
	# returns none if the bucket does not containt that key
	@staticmethod
	def getImageByKey(bucket_name, image_key):
		try:
			market_bucket = s3.Object(bucket_name, image_key).get()
			data = market_bucket['Body'].read()
			return data
		except:
			return None
