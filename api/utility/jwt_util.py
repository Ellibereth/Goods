
import jwt
import os
from flask import jsonify


UTF8 = "utf-8"
algorithm = "HS256"
IsAdmin = "is_admin"
AccountId = "account_id"
SECRET_KEY = "SECRET_KEY"
EmailConfirmed = "email_confirmed"


class JwtUtil:	
	# payload is a dictionary to pass as well
	# although it will usually be empty
	# what should go in the payload?
	@staticmethod
	def create_jwt(payload = {}):
		secret_key = os.environ.get(SECRET_KEY)
		this_jwt = jwt.encode(payload, secret_key, algorithm= algorithm)
		return this_jwt.decode(UTF8)
		
	@staticmethod
	# still figuring out the best stuff to put in the payload
	def validateJwtUser(jwt_str, account_id):
		encoded = jwt_str.encode(UTF8)
		decoded = jwt.decode(encoded, os.environ.get(SECRET_KEY), algorithms=[algorithm])
		return decoded.get(AccountId) == account_id


	def validateJwtConfirmedUser(jwt_str, account_id):
		encoded = jwt_str.encode(UTF8)
		decoded = jwt.decode(encoded, os.environ.get(SECRET_KEY), algorithms=[algorithm])
		return decoded.get(AccountId) == account_id and decoded.get(EmailConfirmed)

	@staticmethod
	def validateJwtAdmin(jwt_str):
		encoded = jwt_str.encode(UTF8)
		decoded = jwt.decode(encoded, os.environ.get(SECRET_KEY), algorithms=[algorithm])
		decoded.get(IsAdmin)

	@staticmethod
	def decodeAdminJwt(jwt_str):
		try:
			encoded = jwt_str.encode(UTF8)
			decoded = jwt.decode(encoded, os.environ.get(SECRET_KEY), algorithms=[algorithm])
			if decoded.get(IsAdmin):
				return decoded
			else:
				return None
		except:
			return None


	@staticmethod
	def getUserInfoFromJwt(jwt_str):
		from api.models.user import User
		try:
			encoded = jwt_str.encode(UTF8)
			decoded = jwt.decode(encoded, os.environ.get(SECRET_KEY), algorithms=[algorithm])
			account_id = decoded.get(AccountId)
			if account_id == None:
				return None
			jwt_user = User.query.filter_by(account_id = account_id).first()
			return jwt_user
		except:
			return None
