import csv
import urllib.parse
import urllib
import os


def getProxyCredentials():
	proxy_credentials = {}
	proxy_credentials['username'] = "darekjohnson28"
	proxy_credentials['password'] = "hB9CUZqI"
	### sratched this since it was giving me a bunch of import errors 

	# with open('./credential_files/proxy_credentials.csv', 'r') as f:
	# 	csv_reader = csv.reader(f)
	# 	for row in csv_reader:
	# 		proxy_credentials[row[0]] = row[1]
	return proxy_credentials

def getDatabaseCredentials():
	# with open('./credential_files/postgre_database_credentials.csv') as f:
	# 	csv_reader = csv.reader(f)
	# 	row_1 = next(csv_reader)
	# 	database_url = row_1[1]
	database_url = "postgres://uc7qa98kmmve1o:p89beda55b5c58f71842847b0d4418111f3e3ba233cf3dbede57a405e7b0dc630@ec2-34-207-18-104.compute-1.amazonaws.com:5432/der386f4nnibg1"
	urllib.parse.uses_netloc.append("postgres")
	os.environ["DATABASE_URL"] = "postgres://uc7qa98kmmve1o:p89beda55b5c58f71842847b0d4418111f3e3ba233cf3dbede57a405e7b0dc630@ec2-34-207-18-104.compute-1.amazonaws.com:5432/der386f4nnibg1"
	url = urllib.parse.urlparse(os.environ["DATABASE_URL"])
	database_credentials = {}
	database_credentials['database'] = url.path[1:]
	database_credentials['user'] = url.username
	database_credentials['password'] = url.password
	database_credentials['host'] = url.hostname
	database_credentials['port'] = url.port

	return database_credentials


def test():
	proxy_credentials = getProxyCredentials()
	database_credentials = getDatabaseCredentials()
	print(proxy_credentials)
	print(database_credentials)

