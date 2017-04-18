from api.models.user import User
import jwt
import os



class JwtUtil:
	
	
	# payload is a dictionary to pass as well
	# although it will usually be empty
	# what should go in the payload?
	@staticmethod
	def create_jwt(payload = {}):
		secret_key = os.environ.get('SECRET_KEY')
		algorithm = "HS256"
		this_jwt = jwt.encode(payload, secret_key, algorithm= algorithm)
		return this_jwt.decode('utf-8')

	# @staticmethod
	# def create_user_jwt():
		
		
	@staticmethod
	# still figuring out the best stuff to put in the payload
	def validateJwtUser(jwt_str, account_id):
		encoded = jwt_str.encode('utf-8')
		decoded = jwt.decode(encoded, os.environ.get('SECRET_KEY'), algorithms=['HS256'])
		return decoded.get('account_id') == account_id

	@staticmethod
	def create_admin_jwt():
		secret_key = os.environ.get('SECRET_KEY')
		algorithm = "HS256"
		payload = {'is_admin' : True}
		this_jwt = jwt.encode(payload, secret_key, algorithm= algorithm)
		return this_jwt.decode('utf-8')

	@staticmethod
	def valudateJwtAdmin(jwt_str):
		encoded = jwt_str.encode('utf-8')
		decoded = jwt.decode(encoded, os.environ.get('SECRET_KEY'), algorithms=['HS256'])
		return decoded.get('is_admin')

	@staticmethod
	def getUserInfoFromJwt(jwt_str):
		encoded = jwt_str.encode('utf-8')
		decoded = jwt.decode(encoded, os.environ.get('SECRET_KEY'), algorithms=['HS256'])
		account_id = decoded.get('account_id')
		if account_id == None:
			return None
		jwt_user = User.query.filter_by(account_id = account_id).first()
		return jwt_user.toPublicDict()
