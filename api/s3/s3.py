import boto3
import urllib.request
import os

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
	# gave up on writing the image byte string to a 
	def uploadImage(self, bucket_name, image_key, image_data):
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
	def getAmazonUrl(self, bucket_name, image_key):
		return self.base_url + "/" + bucket_name + "/" + image_key + ".jpg"

	# deletes the image with the key 
	# if we have multiple images we shift the names of the other ones
	# for example if there are images 0,1,2,3,4
	# we delete image 2, then we copy 4 to position 2 and delete old image 4
	def deleteProductImage(self, image_key):
		bucket = self.s3.Bucket(Labels.PUBLIC_PHOTOS)
		bucket_has_image = True
		this_image_key = image_key
		while bucket_has_photo:
			this_image = self.getImageByKey(Labels.PUBLIC_PHOTOS, this_image_key)
			if this_image == None:
				bucket_has_photo == False
			else:
				this_image_key = self.incrementImageKey(this_image_key)

		# now copies the last image key to the position of the one we will delete 
		bucket.copy_key(this_image_key, Labels.PUBLIC_PHOTOS, image_key)
		bucket.delete_key(this_image_key)

	# given a string like <key>_<number>
	# returns <key>_<number + 1>
	# example: key_5 -> key_6
	# example: key_55 -> key_56
	def incrementImageKey(self, image_key):
		splits = image_key.split('_')
		new_index = str(splits[len(splits)-1]) + 1
		next_image_key = ""
		for i in range(0, len(splits) - 1):
			next_image_key = next_image_key + splits[i]
		next_image_key = next_image_key + str(new_index)
		return next_image_key

	# returns the data as a bytes object
	# returns none if the bucket does not containt that key
	def getImageByKey(self, bucket_name, image_key):
		try:
			market_bucket = self.s3.Object(bucket_name, image_key).get()
			data = market_bucket['Body'].read()
			return data
		except:
			return None



if __name__ == "__main__":
	s3 = S3Manager()
	data = open("test.png", "rb")
	s3.uploadPhoto("edgarusa", "test3", data)
	# print(s3.getPhotoByKey("edgarusa", "test.png"))