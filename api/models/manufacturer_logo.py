from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables
from api.models.shared_models import db
import time
import random
import string
from api.utility.labels import ProductImageLabels as Labels
from api.utility.id_util import IdUtil
import os

ENVIRONMENT = os.environ.get('ENVIRONMENT')


## user object class
class ManufacturerLogo(db.Model):
	__tablename__ = ProdTables.ManufacturerLogoTable
	logo_id = db.Column(db.String, primary_key = True)
	product_id = db.Column(db.Integer, db.ForeignKey(ProdTables.MarketProductTable + '.' + Labels.ProductId))
	soft_deleted = db.Column(db.Boolean, default = False)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())

	def __init__(self, product_id):
		self.product_id = product_id
		self.logo_id = ManufacturerLogo.generateLogoId()
		db.Model.__init__(self)

	@staticmethod
	def generateLogoId():
		new_logo_id = ENVIRONMENT + "/" + IdUtil.id_generator()
		missing = ManufacturerLogo.query.filter_by(logo_id = new_logo_id).first()
		while missing is not None:
			new_logo_id = ENVIRONMENT + "/" +  IdUtil.id_generator()
			missing = ManufacturerLogo.query.filter_by(logo_id = new_logo_id).first()
		return new_logo_id

	def toPublicDict(self):
		public_dict = {}
		public_dict['product_id'] = self.product_id
		public_dict['logo_id'] = self.logo_id
		return public_dict




