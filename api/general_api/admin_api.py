from flask import Blueprint, jsonify, request
from api.utility.json_util import JsonUtil
from api.utility.jwt_util import JwtUtil
from api.utility.tracking import LoginAttempt
from api.utility.labels import AdminLabels as Labels
from api.models.shared_models import db
	
admin_api = Blueprint('admin_api', __name__)
admin_login_username = "heathcliffe"
admin_login_password = "powerplay"

# this route needs to be udpdated for when we have admin accounts
@admin_api.route('/checkAdminLogin', methods =['POST'])
def checkAdminLogin():
	ip = request.remote_addr
	username = request.json.get(Labels.Username)
	password = request.json.get(Labels.Password)
	if password == admin_login_password and username == admin_login_username:
		admin_jwt = JwtUtil.create_admin_jwt()
		login_attempt = LoginAttempt(username, ip, success = True, is_admin = True)
		db.session.add(login_attempt)
		db.session.commit()
		return JsonUtil.successWithOutput({"user" : {'is_admin' : True, "name" : "Admin"}, "jwt" : admin_jwt})
	else:

		login_attempt = LoginAttempt(username, ip, success = False, is_admin = True)
		db.session.add(login_attempt)
		db.session.commit()
		return JsonUtil.failure("Invalid Credentials")


