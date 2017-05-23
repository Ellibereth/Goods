import boto3
import urllib.request
import os
import datetime

# Let's use Amazon S3


# cache life span in seconds, right now set for 2 weeks
CACHE_WEEKS = 4
CACHE_MAX_AGE =  CACHE_WEEKS * 7 * 24 * 60 * 60 


PRODUCT_PHOTOS = "publicmarketproductphotos"
STORY_PHOTOS = "storyphotos"
s3 = boto3.resource('s3',
			aws_access_key_id="AKIAJDIH6XBW42FXQX2Q",
			aws_secret_access_key="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"
		)
base_url = "https://s3-us-west-2.amazonaws.com"


class S3:

	@staticmethod
	def uploadStoryImage(image_key, image_data):
		S3.uploadPhoto(STORY_PHOTOS, image_key, image_data)


	# takes image_data input as a buffered reader
	@staticmethod
	def uploadProductImage(image_key, image_data):
		S3.uploadPhoto(PRODUCT_PHOTOS, image_key, image_data)

	def uploadPhoto(bucket_name, image_key, image_data):
		if image_data == None:
			return
		transfer_dir = './api/s3/transfer/'
		with open(transfer_dir + image_key, "wb") as f:
			f.write(image_data)
			
		image_file = open(transfer_dir + image_key, 'rb')
		s3.Bucket(bucket_name).put_object(
			Key= image_key, 
			Body=image_file,
			CacheControl='public, max-age=' + str(CACHE_MAX_AGE),
		)
		os.remove(transfer_dir + image_key)

	# gets the photo of the image by ID
	@staticmethod
	def getAmazonUrl(bucket_name, image_key):
		return base_url + "/" + bucket_name + "/" + image_key + ".jpg"

	# deletes the image with the given key in the bucket for product images
	@staticmethod
	def deleteProductImage(image_key):
		bucket = s3.Bucket(PRODUCT_PHOTOS)
		bucket.delete_key(image_key)

	# deletes the image with the given key in the bucket for product images
	@staticmethod
	def deleteStoryImage(image_key):
		bucket = s3.Bucket(STORY_PHOTOS)
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

	




