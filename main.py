from flask import Flask, g, render_template, request, url_for, redirect, send_from_directory
import time
import datetime
import os
import random
import requests
import csv
from flask_sqlalchemy import SQLAlchemy
from api.models.shared_models import db
from api.utility.jwt_util import JwtUtil
from api.utility.json_util import JsonUtil
from flask_compress import Compress
from api.utility.email import EmailLib

from base64 import b64encode
from api.security.tracking import HttpRequest

# initialize app
template_dir = os.path.abspath('./web/templates')
static_dir = os.path.abspath('./web/static')
app = Flask(__name__, template_folder=template_dir, static_folder = static_dir)
Compress(app)
# this was generated with os.urandom(24) but we can change this occasionally for more security
secret_key = b64encode(b'L=\xbf=_\xa5P \xc5+\x9b3\xa4\xfdZ\x8fN\xc6\xd5\xb7/\x0f\xbe\x1b')
secret_key = secret_key.decode('utf-8')
app.config['SECRET_KEY'] = secret_key
os.environ['SECRET_KEY'] = secret_key

DATABASE_URI = os.environ.get('DATABASE_URL')

if os.environ.get('ENVIRONMENT') == None:
	os.environ['ENVIRONMENT'] = "DEVELOPMENT"

if DATABASE_URI == None:
	# if testing locally we use the dev DB
	app.config['SQLALCHEMY_DATABASE_URI'] = "postgres://qcyekddfbkmsly:bb555734313b859808b602403e8eb13a061601df0c709826b2f25b94fb1c170d@ec2-23-21-85-76.compute-1.amazonaws.com:5432/d7namsk8b63mqs"

else:
	app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

from api.general_api.email_api import email_api
app.register_blueprint(email_api)
from api.general_api.public_api import public_api
app.register_blueprint(public_api)
from api.general_api.search_api import search_api
app.register_blueprint(search_api)
from api.general_api.product_api import product_api
app.register_blueprint(product_api)
from api.general_api.customer_service_api import customer_service_api
app.register_blueprint(customer_service_api)
from api.general_api.product_request_api import product_request_api
app.register_blueprint(product_request_api)
from api.general_api.admin_api import admin_api
app.register_blueprint(admin_api)
from api.general_api.account_api import account_api
app.register_blueprint(account_api)
from api.general_api.payment_api import payment_api
app.register_blueprint(payment_api)
from api.general_api.amazon_data_api import amazon_data_api
app.register_blueprint(amazon_data_api)
from api.general_api.cart_api import cart_api
app.register_blueprint(cart_api)
from api.general_api.analytics_api import analytics_api
app.register_blueprint(analytics_api)


# cache life span in seconds, right now set to 2 weeks
CACHE_WEEKS = 2
CACHE_MAX_AGE =  CACHE_WEEKS * 7 * 24 * 60 * 60 
CACHE_EXPIRE_DAYS = 2

@app.before_first_request
def create_database():
	# db.drop_all()
	db.create_all()

@app.after_request
def add_header(response):
	"""
	Add headers to both force latest IE rendering engine or Chrome Frame,
	and also to cache the rendered page for 10 minutes.
	"""
	response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'


	path_splits = request.path.split('/')
	# cache everything int he static/web_scripts folder
	if len(path_splits) > 2 and path_splits[1] == 'static':
		if path_splits[2] == 'web_scripts' or path_splits[2] == "dist":
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
	response.headers.add("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
	return response





@app.before_request
def before_request():
	g.start = time.time()

@app.teardown_request
def teardown_request(exception=None):
	time_spent = time.time() - g.start
	path_splits = request.path.split('/')

	# this has been commented out as it is too database taxing
	# perhaps we can modify to be more selective
	# only record the request if it's non-static
	# if not(len(path_splits) > 2 and path_splits[1] == 'static' and path_splits[2] == 'web_scripts'):
	# 	HttpRequest.recordHttpRequest(request.path, time_spent, request.remote_addr)


@app.route('/static/<path:path>', methods = ['GET'])
def send_static(path):
	return send_from_directory('static', path)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
	ip_addr = request.remote_addr
	nums = [int(s) for s in ip_addr.split() if s.isdigit()]
	NUM_AB_GROUPS = 2
	ab_group = sum(nums) % NUM_AB_GROUPS
	return render_template("index.html", ab_group = ab_group)


@app.errorhandler(404)
def page_not_found(error):
	EmailLib.reportServerError("404", error, request)
	return render_template("index.html")


@app.errorhandler(405)
def method_not_allowed(error):
	EmailLib.reportServerError("405", error, request)
	return JsonUtil.failure("Method not allowed")

@app.errorhandler(500)
def internal_server_error(error):
	EmailLib.reportServerError("500", error, request)
	return JsonUtil.failure("Internal server error")

if __name__ == '__main__':
	if os.environ.get('ENVIRONMENT') == "DEVELOPMENT":
		app.debug = True
	port = int(os.environ.get("PORT", 5000))
	app.run(host='0.0.0.0', port=port)




