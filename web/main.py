from flask import Flask, render_template, request, url_for, redirect, session, flash, jsonify, send_from_directory
from werkzeug import secure_filename
# used for the date.today() in calculating age
from datetime import date
# used for time stamps 
import time
import datetime
import pytz
from pytz import timezone
import smtplib
import shutil
import os
import urllib
import json
from contextlib import closing
import random
import requests
import sqlite3
import sys
import re


# initialize app
app = Flask(__name__)

# NOTE !!!!  this should definitely be randomly generated and look like some crazy impossible to guess hash
# but for now we'll keep is simple and easy to remember
app.secret_key = "powerplay"

# from api.mobile_api import mobile_api
# app.register_blueprint(mobile_api)
# from api.browser_api import browser_api
# app.register_blueprint(browser_api)
from api.public_api import public_api
app.register_blueprint(public_api)

@app.after_request
def add_header(response):
	"""
	Add headers to both force latest IE rendering engine or Chrome Frame,
	and also to cache the rendered page for 10 minutes.
	"""
	response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
	response.headers['Cache-Control'] = 'public, max-age=0'
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




