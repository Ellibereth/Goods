"""
This module runs the flask app for Edgar USA

"""

import time
import datetime
import os
import sys
from base64 import b64encode

from flask_compress import Compress
from flask import Flask
from flask import g
from flask import render_template
from flask import request
from flask import url_for
from flask import send_from_directory

from api.models.shared_models import db
from api.utility.email import EmailLib
from api.utility.json_util import JsonUtil
# from api.security.tracking import HttpRequest
from api.general_api.email_api import email_api
from api.general_api.search_api import search_api
from api.general_api.product_api import product_api
from api.general_api.customer_service_api import customer_service_api
from api.general_api.product_request_api import product_request_api
from api.general_api.admin_api import admin_api
from api.general_api.account_api import account_api
from api.general_api.payment_api import payment_api
from api.general_api.amazon_data_api import amazon_data_api
from api.general_api.cart_api import cart_api
from api.general_api.analytics_api import analytics_api

ENVIRONMENT_STRING = "ENVIRONMENT"
DEVELOPMENT_STRING = "DEVELOPMENT"
STAGING_STRING = "STAGING"
PRODUCTION_STRING = "PRODUCTION"

# initialize app
TEMPLATE_DIR = os.path.abspath('./web/templates')
STATIC_DIR = os.path.abspath('./web/static')
app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder = STATIC_DIR)
app.register_blueprint(email_api)
app.register_blueprint(search_api)
app.register_blueprint(product_api)
app.register_blueprint(customer_service_api)
app.register_blueprint(product_request_api)
app.register_blueprint(admin_api)
app.register_blueprint(account_api)
app.register_blueprint(analytics_api)
app.register_blueprint(cart_api)
app.register_blueprint(amazon_data_api)
app.register_blueprint(payment_api)
Compress(app)
# this was generated with os.urandom(24) but we can change this occasionally for more security
SECRET_KEY = b64encode(b'L=\xbf=_\xa5P \xc5+\x9b3\xa4\xfdZ\x8fN\xc6\xd5\xb7/\x0f\xbe\x1b')
SECRET_KEY = SECRET_KEY.decode('utf-8')
app.config['SECRET_KEY'] = SECRET_KEY
os.environ['SECRET_KEY'] = SECRET_KEY

DATABASE_URI = os.environ.get('DATABASE_URL')

if os.environ.get(ENVIRONMENT_STRING) is None:
	os.environ[ENVIRONMENT_STRING] = DEVELOPMENT_STRING

if DATABASE_URI is None:
	# if testing locally we use the dev DB
	LOCAL_URL = "postgres://qcyekddfbkmsly:bb555734313b859808b602403e8eb13a061601df0c709826b2f25b94fb1c170d@ec2-23-21-85-76.compute-1.amazonaws.com:5432/d7namsk8b63mqs"
	app.config['SQLALCHEMY_DATABASE_URI'] = LOCAL_URL

else:
	app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# cache life span in seconds, right now set to 2 weeks
CACHE_WEEKS = 2
CACHE_MAX_AGE = CACHE_WEEKS * 7 * 24 * 60 * 60
CACHE_EXPIRE_DAYS = 2

@app.before_first_request
def create_database():
	"""
	: we create the database before the first request
	"""
	db.create_all()

@app.after_request
def add_header(response):
	"""
	: Add headers to both force latest IE rendering engine or Chrome Frame,
	: and also to cache the rendered page for 10 minutes.
	"""
	this_env = os.environ[ENVIRONMENT_STRING]
	response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
	path_splits = request.path.split('/')
	# cache everything int he static/web_scripts folder
	if len(path_splits) > 2 and path_splits[1] == 'static':
		# if path_splits[2] == 'web_scripts' or path_splits[2] == "dist":
		if path_splits[2] == 'web_scripts' or this_env == PRODUCTION_STRING:
			response.headers['Cache-Control'] = 'public,max-age=' + str(CACHE_MAX_AGE)
			# commented out since max-age should do enough by itself
			right_now = datetime.datetime.now()
			expire_time = right_now + datetime.timedelta(days = CACHE_EXPIRE_DAYS)
			response.headers['Expires'] = str(expire_time)

		# otherwise do not cache
		else:
			response.headers['Cache-Control'] = 'public,max-age=0'
	else:
		response.headers['Cache-Control'] = 'public,max-age=0'


	response.headers['Vary'] = 'Accept-Encoding'
	response.headers.add('Access-Control-Allow-Origin', '*')
	response.headers.add("Access-Control-Allow-Credentials", "true")
	response.headers.add("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
	response.headers.add("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, \
														Origin,Accept, X-Requested-With,\
														Content-Type, Access-Control-Request-Method,\
														Access-Control-Request-Headers")
	return response


@app.before_request
def before_request():
	"""
	: We use this to time requests 
	"""
	g.start = time.time()

# @app.teardown_request
# def teardown_request(exception = None):
# 	# print(exception)
# 	time_spent = time.time() - g.start
# 	path_splits = request.path.split('/')

# 	# this has been commented out as it is too database taxing
# 	# perhaps we can modify to be more selective
# 	# only record the request if it's non-static
# 	if not(len(path_splits) > 2 and path_splits[1] == 'static' and path_splits[2] == 'web_scripts'):
# 		print(time_spent, path_splits)
# 	# 	HttpRequest.recordHttpRequest(request.path, time_spent, request.remote_addr)


@app.route('/static/<path:path>', methods = ['GET'])
def send_static(path):
	"""
	: This route allows static files to be sent to server
	"""
	return send_from_directory('static', path)

@app.route('/',defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
	"""
	: This route prevents all non-static files from being called by the server 
	: apart from index.html
	"""
	this_env = os.environ.get(ENVIRONMENT_STRING)
	# use this for the production bundle
	# update this value when the bundle version changes or production
	if this_env == PRODUCTION_STRING:
		version = "v0.0.1"
		bundle_url = url_for('static', filename='bundles/bundle' + version + '.js')
	# otherwise use the development one
	else:
		bundle_url = url_for('static', filename='bundle.js')
	return render_template("index.html", bundle_url =  bundle_url)


@app.errorhandler(404)
def page_not_found(error):
	"""
	: in the event of a 404 page error, we return index.html
	"""
	EmailLib.reportServerError("404", error, request)
	return render_template("index.html")


@app.errorhandler(405)
def method_not_allowed(error):
	"""
	: in the event of a 405 method error, we return an internal server error
	"""
	EmailLib.reportServerError("405", error, request)
	return JsonUtil.failure("Method not allowed")

@app.errorhandler(500)
def internal_server_error(error):
	"""
	: in the event of a 500 internal server error, we return an internal server error
	"""
	EmailLib.reportServerError("500", error, request)
	return JsonUtil.failure("Internal server error")

if __name__ == '__main__':
	# this allows us to test production locally, using command line argument
	# python3 main.py prod
	# note this does not test the production database
	if len(sys.argv) > 1:
		if sys.argv[1] == "prod":
			os.environ[ENVIRONMENT_STRING] = PRODUCTION_STRING
			app.debug = False

	if os.environ.get(ENVIRONMENT_STRING) == DEVELOPMENT_STRING:
		app.debug = True

	PORT = int(os.environ.get("PORT", 5000))
	app.run(host='0.0.0.0', port=PORT)
	