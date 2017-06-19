from flask import Blueprint, jsonify, request
from api.utility.json_util import JsonUtil
from api.utility.jwt_util import JwtUtil
from api.utility.labels import MarketProductLabels as Labels
from api.models.shared_models import db
from api.models.user import User

from api.security.tracking import AdminAction
from functools import wraps
from api.utility.error import ErrorMessages

import base64
from api.s3.s3_api import S3


def check_admin_jwt(func):
	@wraps(func)
	def wrapper():
		jwt = request.json.get(Labels.Jwt)
		admin_user = JwtUtil.decodeAdminJwt(jwt)
		if not admin_user:
			AdminAction.addAdminAction(admin_user, request.path, request.remote_addr, success = False)
			return JsonUtil.failure(ErrorMessages.InvalidCredentials)
		return func(admin_user)
	return wrapper


def check_user_jwt(func):
	@wraps(func)
	def wrapper():
		jwt = request.json.get(Labels.Jwt)
		this_user = JwtUtil.getUserInfoFromJwt(jwt)
		if this_user == None:
			return JsonUtil.failure(ErrorMessages.InvalidCredentials)
		return func(this_user)
	return wrapper