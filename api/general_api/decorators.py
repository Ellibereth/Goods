from flask import Blueprint, jsonify, request
from api.utility.json_util import JsonUtil
from api.utility.jwt_util import JwtUtil
from api.utility.labels import MarketProductLabels as Labels
from api.models.shared_models import db

from api.security.tracking import AdminAction
from functools import wraps

import base64
from api.s3.s3_api import S3


def check_admin(func):
	@wraps(func)
	def wrapper():
		jwt = request.json.get(Labels.Jwt)
		decoded_jwt = JwtUtil.decodeAdminJwt(jwt)
		if not decoded_jwt:
			AdminAction.addAdminAction(decoded_jwt, request.path, request.remote_addr, success = False)
			return JsonUtil.jwt_failure()
		return func()
	return wrapper