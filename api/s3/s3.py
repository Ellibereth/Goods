import boto3
import urllib.request
# Let's use Amazon S3

class Labels:
	MARKET_PRODUCTS = "marketproductbucket"

class S3Manager:
	def __init__(self):
		self.s3 = boto3.resource('s3',
			aws_access_key_id="AKIAJDIH6XBW42FXQX2Q",
			aws_secret_access_key="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"
		)

	# takes photo_data input as a buffered reader
	# see data = open('test.png', 'rb') data type
	def uploadPhoto(self, photo_key, photo_data):
		self.s3.Bucket(Labels.MARKET_PRODUCTS).put_object(Key= photo_key, Body=data)


	# returns the data as a bytes object
	def getPhotoByKey(self, bucket_name, photo_key):
		market_bucket = self.s3.Object(bucket_name, photo_key).get()
		data = market_bucket['Body'].read()
		return data



if __name__ == "__main__":
	s3 = S3Manager()
	print(s3.getPhotoByKey("edgarusa", "test.png"))