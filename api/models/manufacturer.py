"""
: Module containing the Maufacturer class 
"""

from api.utility.table_names import ProdTables
from api.models.shared_models import db
from api.utility.labels import ManufacturerLabels as Labels


class Manufacturer(db.Model):
	"""
	: This class represents our manufacturers
	: Implemented with SQL Alchemy db.Model
	"""
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
		"""
		: Returns a list of all manufacturers as public dictionaries
		"""
		manufacturers = Manufacturer.query.filter_by().all()
		return [manufacturer.toPublicDict() for manufacturer in manufacturers]

	def toPublicDict(self):
		"""
		: Returns a public dictionary of this manufacturer
		"""
		public_dict = {}
		public_dict[Labels.ManufacturerId] = self.manufacturer_id
		public_dict[Labels.Name] = self.name
		public_dict[Labels.Description] = self.description
		public_dict[Labels.Notes] = self.notes
		public_dict[Labels.Fee] = self.fee
		return public_dict
