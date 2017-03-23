import boto3

# Let's use Amazon S3
if __name__ == "__main__":
	s3 = boto3.resource('s3')
	# Print out bucket names
	buckets = s3.buckets.all()
	for bucket in buckets:
		print(bucket.name)