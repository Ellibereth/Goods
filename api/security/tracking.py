
from api.utility.table_names import ProdTables
from api.models.shared_models import db
import time
import random
import string
from api.utility.labels import AdminLabels as Labels
from api.utility.id_util import IdUtil

# records login attempt by regular users and admins
class LoginAttempt(db.Model):
	__tablename__ = ProdTables.LoginAttemptTable
	attempt_id = db.Column(db.Integer, primary_key=True, autoincrement = True)
	username = db.Column(db.String)
	ip = db.Column(db.String)
	success = db.Column(db.Boolean)
	is_admin = db.Column(db.Boolean)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())

	# name,email, password all come from user inputs
	# email_confirmation_id, stripe_customer_id will be generated with try statements 
	def __init__(self, username, ip, success, is_admin):
		self.username = username
		self.ip = ip
		self.success = success
		self.is_admin = is_admin
		db.Model.__init__(self)

	
	@staticmethod
	def getRecentLoginAttempts():
		return 0

	@staticmethod
	def addLoginAttempt(username, ip, success, is_admin):
		login_attempt = LoginAttempt(username, ip, success, is_admin)
		db.session.add(login_attempt)
		db.session.commit()


	def toPublicDict(self):
		public_dict = {}
		public_dict[Labels.AttemptId] = self.attempt_id
		public_dict[Labls.Username] = self.username
		public_dict[Labels.DateCreated] = self.date_created
		public_dict[Labels.Ip] = self.ip
		public_dict[Labels.Success] = self.success
		public_dict[Labels.IsAdmin] = self.is_admin
		return public_dict


# records activity that requires an admin jwt
class AdminAction(db.Model):
	__tablename__ = ProdTables.AdminActionTable
	admin_action_id = db.Column(db.Integer, primary_key=True, autoincrement = True)
	username = db.Column(db.String)
	ip = db.Column(db.String)
	success = db.Column(db.Boolean)
	request_path = db.Column(db.String)
	error_message = db.Column(db.String)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())

	# name,email, password all come from user inputs
	# email_confirmation_id, stripe_customer_id will be generated with try statements 
	def __init__(self, username, request_path, ip, success, error_message = None):
		self.username = username
		self.ip = ip
		self.success = success
		self.request_path = request_path
		self.error_message = error_message
		db.Model.__init__(self)

	@staticmethod
	def addAdminAction(decoded_jwt, request_path, ip, success, error_message = None):
		if decoded_jwt:
			username = decoded_jwt.get(Labels.Username)
		else:
			username = None
		admin_action = AdminAction(username, request_path, ip, success, error_message)
		db.session.add(admin_action)
		db.session.commit()

	def toPublicDict(self):
		public_dict = {}
		public_dict[Labels.ActionId] = self.action_id
		public_dict[Labls.Username] = self.username
		public_dict[Labels.DateCreated] = self.date_created
		public_dict[Labels.Ip] = self.ip
		public_dict[Labels.Success] = self.success
		public_dict[Labels.RequestPath] = self.request_path
		return public_dict





