from flask import Blueprint, jsonify, request
from api.utility.json_util import JsonUtil
from api.utility.jwt_util import JwtUtil
from api.security.tracking import LoginAttempt
from api.utility.labels import AdminLabels as Labels
from api.models.shared_models import db
from api.models.admin_user import AdminUser
	
admin_api = Blueprint('admin_api', __name__)
admin_login_username = "heathcliffe"
admin_login_password = "powerplay"

# this route needs to be udpdated for when we have admin accounts
@admin_api.route('/checkAdminLogin', methods =['POST'])
def checkAdminLogin():	
	ip = request.remote_addr
	username = request.json.get(Labels.Username)
	password = request.json.get(Labels.Password)
	if AdminUser.checkLogin(username, password):
		admin_user = AdminUser.query.filter_by(username = username).first()

		admin_jwt = JwtUtil.create_jwt(admin_user.toPublicDict())
		LoginAttempt.addLoginAttempt(username, ip 
			, success = True, is_admin = True)
		return JsonUtil.successWithOutput({
			Labels.User : admin_user.toPublicDict(), 
			"jwt" : admin_jwt})
	else:
		LoginAttempt.addLoginAttempt(username, ip, success = False, is_admin = True)
		return JsonUtil.failure("Invalid Credentials")

@admin_api.route('/checkAdminJwt', methods =['POST'])
def checkAdminJwt():
	jwt = request.json.get(Labels.Jwt)
	if not jwt:
		return JsonUtil.jwt_failure()
	if not JwtUtil.validateJwtAdmin(jwt):
		return JsonUtil.jwt_failure()
	else:
		return JsonUtil.success()