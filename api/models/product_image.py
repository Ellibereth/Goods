from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables
from api.models.shared_models import db
import time
import random
import string
from api.utility.labels import ProductImageLabels as Labels
from api.utility.id_util import IdUtil

## user object class
class ProductImage(db.Model):
	__tablename__ = ProdTables.ImageTable
	image_id = db.Column(db.String, primary_key = True)
	product_id = db.Column(db.Integer, db.ForeignKey(ProdTables.MarketProductTable + '.' + Labels.ProductId))
	soft_deleted = db.Column(db.Boolean, default = False)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())

	def __init__(self, product_id):
		self.product_id = product_id
		self.image_id = ProductImage.generateImageId()
		db.Model.__init__(self)

	@staticmethod
	def generateImageId():
		new_image_id = IdUtil.id_generator()
		missing = ProductImage.query.filter_by(image_id = new_image_id).first()
		while missing is not None:
			new_image_id = IdUtil.id_generator()
			missing = ProductImage.query.filter_by(image_id = new_image_id).first()
		return new_image_id

	def toPublicDict(self):
		public_dict = {}
		public_dict['product_id'] = self.product_id
		public_dict['image_id'] = self.image_id
		return public_dict




