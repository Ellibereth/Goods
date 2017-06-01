
from api.utility.table_names import ProdTables
from api.models.shared_models import db
import time
import random
import string
from api.utility.labels import AdminLabels as Labels
from api.utility.id_util import IdUtil
from passlib.hash import argon2


class AdminUser(db.Model):
	__tablename__ = ProdTables.AdminUserTable
	admin_id = db.Column(db.Integer, primary_key=True, autoincrement = True)
	username = db.Column(db.String)
	password_hash = db.Column(db.String)
	name = db.Column(db.String)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())

	# name,email, password all come from user inputs
	# email_confirmation_id, stripe_customer_id will be generated with try statements 
	def __init__(self, username, password, name):
		self.username = username
		self.password_hash = AdminUser.argonHash(pre_hash)
		self.name = name
		db.Model.__init__(self)


	@staticmethod
	def argonHash(pre_hash):
		return argon2.using(rounds=4).hash(pre_hash)

	@staticmethod
	def argonCheck(pre_hash, post_hash):
		return argon2.verify(pre_hash, post_hash)
	

	@staticmethod
	def checkLogin(username, password):
		admin_user = AdminUser.query.filter_by(username = username).first()
		if not admin_user:
			return False

		return AdminUser.argonCheck(password, admin_user.password_hash)

	@staticmethod
	def getRecentLoginAttemps():
		return 0

	def toPublicDict(self):
		public_dict = {}
		public_dict[Labels.Username] = self.username
		public_dict[Labels.DateCreated] = self.date_created
		public_dict[Labels.Name] = self.name
		public_dict[Labels.IsAdmin] = True
		return public_dict







