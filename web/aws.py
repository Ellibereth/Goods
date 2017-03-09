import boto3
import os

if __name__ == '__main__':
	# s3 = boto3.resource('s3')
	os.environ["AWS_DEFAULT_REGION"] = "us-east-1"
	os.environ['AWS_ACCESS_KEY_ID']="AKIAJEGXYAPQ5DFQWHMA"
	os.environ['AWS_SECRET_ACCESS_KEY']="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"
	s3 = boto3.resource('s3')
	# for bucket in s3.buckets.all():
	# 	print(bucket.name)
	# s3.create_bucket(Bucket='mybucket')
	image = open("test.png", "rb")
	s3.Bucket('remaura').put_object(Key='test.png', Body=image)


