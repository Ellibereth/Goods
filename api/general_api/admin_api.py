from flask import Blueprint, jsonify, request
from api.utility.json_util import JsonUtil


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
		return JsonUtil.success()
	else:
		return JsonUtil.failire("Invalid Credentials")


