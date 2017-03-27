import boto3
import urllib.request
# Let's use Amazon S3

class Labels:
	PUBLIC_PHOTOS = "publicmarketproductphotos"

class S3Manager:
	def __init__(self):
		self.s3 = boto3.resource('s3',
			aws_access_key_id="AKIAJDIH6XBW42FXQX2Q",
			aws_secret_access_key="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"
		)
		self.base_url = "https://s3-us-west-2.amazonaws.com"

	# takes photo_data input as a buffered reader
	# see data = open('test.png', 'rb') data type
	def uploadPhoto(self, bucket_name, photo_key, photo_data):
		self.s3.Bucket(bucket_name).put_object(
			Key= photo_key, 
			Body=data
		)

	def getAmazonUrl(self, bucket_name, photo_key):
		return self.base_url + "/" + bucket_name + "/" + photo_key


	# returns the data as a bytes object
	def getPhotoByKey(self, bucket_name, photo_key):
		market_bucket = self.s3.Object(bucket_name, photo_key).get()
		data = market_bucket['Body'].read()
		return data



if __name__ == "__main__":
	s3 = S3Manager()
	data = open("test.png", "rb")
	s3.uploadPhoto("edgarusa", "test3", data)
	# print(s3.getPhotoByKey("edgarusa", "test.png"))