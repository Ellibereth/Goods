from flask import Blueprint, jsonify, request
import time
from passlib.hash import argon2
import base64

from ..utility.account_manager import AccountManager
from ..utility.table_names import ProdTables


class Labels:
	Success = "success"
	Password = "password"
	

admin_api = Blueprint('admin_api', __name__)
admin_login_password = "powerplay"

@admin_api.route('/checkAdminLogin', methods =['POST'])
def checkAdminLogin():
	password = request.json.get(Labels.Password)
	output = {}
	if password == admin_login_password:
		output[Labels.Success] = True
	else:
		output[Labels.Success] = False
	return jsonify(output)


