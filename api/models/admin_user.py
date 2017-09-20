"""
: This module contains the admin user class
"""
from api.utility.argon import Argon
from api.utility.labels import AdminLabels as Labels
from api.utility.table_names import ProdTables
from api.models.shared_models import db

class AdminUser(db.Model):
	"""
	: This class represents an admin user 
	: extending a FlaskSQLAlchemy db.model
	"""
	__tablename__ = ProdTables.AdminUserTable
	is_admin = True
	admin_id = db.Column(db.Integer, primary_key=True, autoincrement = True)
	username = db.Column(db.String, unique = True)
	password_hash = db.Column(db.String)
	name = db.Column(db.String)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())

	def __init__(self, username, password, name):
		self.username = username
		self.password_hash = Argon.argonHash(password)
		self.name = name
		self.is_admin = True
		db.Model.__init__(self)

	@staticmethod
	def checkLogin(username, password):
		"""
		: Checks if the admin's password goes with the given username
		: returns True of so, False otherwise
		"""
		admin_user = AdminUser.query.filter_by(username = username).first()
		if not admin_user:
			return False
		return Argon.argonCheck(password, admin_user.password_hash)

	def toPublicDict(self):
		"""
		: returns the admin user as a public dictionary
		"""
		public_dict = {}
		public_dict[Labels.Username] = self.username
		public_dict[Labels.DateCreated] = self.date_created
		public_dict[Labels.Name] = self.name
		public_dict[Labels.IsAdmin] = True
		return public_dict
