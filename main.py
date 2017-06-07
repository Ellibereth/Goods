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
from flask_compress import Compress

from base64 import b64encode


# logging speed of requests
# log_dir = "logs/"
# logging.basicConfig(filename=(log_dir + 'request_speed.log'), 
# 	level=logging.DEBUG, format='%(message)s')


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


## switch these when on dev server and production
# production database
# app.config['SQLALCHEMY_DATABASE_URI'] = "postgres+psycopg2://uc7qa98kmmve1o:p89beda55b5c58f71842847b0d4418111f3e3ba233cf3dbede57a405e7b0dc630@ec2-34-207-18-104.compute-1.amazonaws.com:5432/der386f4nnibg1"
# dev server database
app.config['SQLALCHEMY_DATABASE_URI'] = "postgres+psycopg2://skivafwmffefsc:0b550d51de8c629c24a4845dbbfd16ec283214c9452e0755991304481498c6e4@ec2-54-235-72-121.compute-1.amazonaws.com:5432/d57p2u2b5qvp4i"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

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
	if len(path_splits) > 2 and path_splits[1] == 'static' and path_splits[2] == 'web_scripts':
			response.headers['Cache-Control'] = 'public,max-age=' + str(CACHE_MAX_AGE)
			# commented out since max-age should do enough by itself
			right_now = datetime.datetime.now()
			expire_time = right_now + datetime.timedelta(days = CACHE_EXPIRE_DAYS)
			response.headers['Expires'] = str(expire_time)

	# otherwise we do not cache, this can be changed later
	else:
		response.headers['Cache-Control'] = 'public,max-age=0'

	response.headers['Vary'] = 'Accept-Encoding'
	response.headers.add('Access-Control-Allow-Origin', '*')
	response.headers.add("Access-Control-Allow-Credentials", "true")
	response.headers.add("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
	response.headers.add("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
	return response


@app.route('/static/<path:path>', methods = ['GET'])
def send_static(path):
	return send_from_directory('static', path)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
	return render_template("index.html")


if __name__ == '__main__':
	app.debug = True
	port = int(os.environ.get("PORT", 5000))
	app.run(host='0.0.0.0', port=port)




