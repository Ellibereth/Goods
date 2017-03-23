import boto3
import urllib.request
# Let's use Amazon S3
if __name__ == "__main__":
	s3 = boto3.resource( 's3',
		aws_access_key_id="AKIAJDIH6XBW42FXQX2Q",
		aws_secret_access_key="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"
	)
	# s3 = boto3.resource('s3')
	# Print out bucket names
	buckets = s3.buckets.all()
	for bucket in buckets:
		print(bucket.name)