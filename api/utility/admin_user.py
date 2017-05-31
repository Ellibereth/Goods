
from api.utility.table_names import ProdTables
from api.models.shared_models import db
import time
import random
import string
from api.utility.labels import AdminLabels as Labels
from api.utility.id_util import IdUtil


class AdminUser(db.Model):
	__tablename__ = ProdTables.LoginAttempTable
	attempt_id = db.Column(db.Interger, primary_key=True, autoincrement = True)
	username = db.Column(db.String)
	password_hash = db.Column(db.String)
	ip = db.Column(db.String)
	success = db.Column(db.Boolean)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())

	# name,email, password all come from user inputs
	# email_confirmation_id, stripe_customer_id will be generated with try statements 
	def __init__(self, username, password)
		self.username = username
		self.password = password
		db.Model.__init__(self)

	
	@staticmethod
	def getRecentLoginAttemps():
		return 0

	def toPublicDict(self):
		public_dict = {}
		public_dict[Labels.AttempId] = self.attempt_id
		public_dict[Labls.Username] = self.username
		public_dict[Labels.DateCreated] = self.date_created
		public_dict[Labels.Ip] = self.ip
		public_dict[Labels.Success] = self.success
		return public_dict





