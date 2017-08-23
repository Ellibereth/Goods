
from api.utility.table_names import ProdTables
from api.models.shared_models import db
import time
import random
import string
from api.utility.labels import ManufacturerLabels as Labels
from api.utility.id_util import IdUtil


class Manufacturer(db.Model):
	__tablename__ = ProdTables.ManufacturerTable
	INTEGER_INPUTS = [Labels.Fee]
	manufacturer_id = db.Column(db.Integer, primary_key=True, autoincrement = True)
	name = db.Column(db.String)
	description = db.Column(db.String)
	notes = db.Column(db.String)
	fee = db.Column(db.Integer)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())

	def __init__(self, name):
		self.name = name
		db.Model.__init__(self)

	@staticmethod
	def getAllManufacturers():
		manufacturers = Manufacturer.query.filter_by().all()
		return [manufacturer.toPublicDict() for manufacturer in manufacturers]


	def toPublicDict(self):
		public_dict = {}
		public_dict[Labels.ManufacturerId] = self.manufacturer_id
		public_dict[Labels.Name] = self.name
		public_dict[Labels.Description] = self.description
		public_dict[Labels.Notes] = self.notes
		public_dict[Labels.Fee] = self.fee
		return public_dict


