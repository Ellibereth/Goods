from flask import Blueprint, jsonify, request
from api.utility.json_util import JsonUtil
from api.utility.jwt_util import JwtUtil
class Labels:
	Success = "success"
	Password = "password"
	

admin_api = Blueprint('admin_api', __name__)
admin_login_password = "powerplay"

# this route needs to be udpdated for when we have admin accounts
@admin_api.route('/checkAdminLogin', methods =['POST'])
def checkAdminLogin():
	password = request.json.get(Labels.Password)
	if password == admin_login_password:
		admin_jwt = JwtUtil.create_admin_jwt()
		return JsonUtil.successWithOutput({"jwt" : admin_jwt})
	else:
		return JsonUtil.failire("Invalid Credentials")


