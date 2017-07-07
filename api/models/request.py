from api.utility.table_names import ProdTables
from api.models.shared_models import db
import time
import random
import string
from api.utility.labels import RequestLabels as Labels
from api.utility.id_util import IdUtil

class Request(db.Model):
	__tablename__ = ProdTables.UserRequestTable
	request_id = db.Column(db.Integer, primary_key = True, autoincrement = True)
	email = db.Column(db.String, nullable = False)
	name = db.Column(db.String, nullable = False)
	description = db.Column(db.String)
	price_range = db.Column(db.String)
	phone_number = db.Column(db.String)
	completed = db.Column(db.Boolean, default = False)
	confirmed = db.Column(db.Boolean, default = False)
	confirmation_id = db.Column(db.String, unique = True)
	account_id = db.Column(db.String, nullable = True)
	soft_deleted = db.Column(db.Boolean)
	date_completed = db.Column(db.DateTime)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())

	def __init__(self, email, name, description, price_range, phone_number, account_id = None):
		self.confirmation_id = Request.generateConfirmationId()
		self.name = name
		self.email = email
		self.description = description
		self.price_range = price_range
		self.phone_number = phone_number
		self.account_id = account_id
		db.Model.__init__(self)

	@staticmethod
	def generateConfirmationId():
		new_confirmation_id = IdUtil.id_generator()
		missing = Request.query.filter_by(confirmation_id = new_confirmation_id).first()
		while missing is not None:
			new_confirmation_id = IdUtil.id_generator()
			missing = Request.query.filter_by(confirmation_id = new_confirmation_id).first()
		return new_confirmation_id

	def toPublicDict(self):
		public_dict = {}
		public_dict[Labels.Name] = self.name
		public_dict[Labels.Email] = self.email
		public_dict[Labels.Description] = self.description
		public_dict[Labels.PriceRange] = self.price_range
		public_dict[Labels.Confirmed] = self.confirmed
		public_dict[Labels.Completed] = self.completed
		public_dict[Labels.DateCreated] = self.date_created
		public_dict[Labels.RequestId] = self.request_id
		public_dict[Labels.DateCompleted] = self.date_completed
		return public_dict

