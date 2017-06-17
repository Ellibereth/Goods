
from api.utility.table_names import ProdTables
from api.models.shared_models import db
import time
import random
import string
from api.utility.labels import AdminLabels as Labels
from api.utility.id_util import IdUtil
import datetime

# how many login attempts allowed per IP per minute limit time interval
MINUTE_LIMIT = 15
LOGIN_LIMIT = 15


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
	def getRecentLoginAttempts(ip):
		interval_start = datetime.datetime.utcnow() - datetime.timedelta(minutes = MINUTE_LIMIT)
		login_query = LoginAttempt.query.filter_by(ip = ip, success = False).all()
		num_recent_logins = 0
		for login in login_query:
			if login.date_created > interval_start:
				num_recent_logins = num_recent_logins + 1
		return num_recent_logins

	@staticmethod
	def getUnblockedLoginTime(ip):
		last_logins = LoginAttempt.query.filter_by(ip = ip, success = False).all()
		sorted_logins = sorted(last_logins, key=lambda x: x.date_created, reverse=True)
		if len(sorted_logins) > LOGIN_LIMIT:
			return sorted_logins[LOGIN_LIMIT].date_created + datetime.timedelta(minutes = MINUTE_LIMIT)
		else:
			return None

	@staticmethod
	def blockIpAddress(ip):
		num_recent_logins = LoginAttempt.getRecentLoginAttempts(ip)
		return (num_recent_logins > LOGIN_LIMIT)

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
	def addAdminAction(admin_user, request_path, ip, success, error_message = None):
		if admin_user:
			username = admin_user.get(Labels.Username)
		else:
			username = None
		admin_action = AdminAction(username, request_path, ip, success, error_message)
		db.session.add(admin_action)
		db.session.commit()

	@staticmethod
	def getRecentAttempts(ip):
		now = datetime.datetime.now()
		before = now - timedelta(minutes = MINUTE_THRESHOLD)


		return 0


	def toPublicDict(self):
		public_dict = {}
		public_dict[Labels.ActionId] = self.action_id
		public_dict[Labls.Username] = self.username
		public_dict[Labels.DateCreated] = self.date_created
		public_dict[Labels.Ip] = self.ip
		public_dict[Labels.Success] = self.success
		public_dict[Labels.RequestPath] = self.request_path
		public_dict[Labels.ErrorMessage] = self.error_message
		return public_dict


# records activity that requires an admin jwt
class HttpRequest(db.Model):
	__tablename__ = ProdTables.HttpRequestTable
	request_id = db.Column(db.Integer, primary_key=True, autoincrement = True)
	request_path = db.Column(db.String)
	time_spent = db.Column(db.Float)
	ip = db.Column(db.String)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())

	# name,email, password all come from user inputs
	# email_confirmation_id, stripe_customer_id will be generated with try statements 
	def __init__(self, request_path, time_spent, ip):
		self.request_path = request_path
		self.time_spent = time_spent
		self.ip = ip
		db.Model.__init__(self)

	@staticmethod
	def recordHttpRequest(request_path, time_spent, ip):
		new_request = HttpRequest(request_path, time_spent, ip)
		db.session.add(new_request)
		db.session.commit()







