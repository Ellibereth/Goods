from api.utility.table_names import ProdTables
from api.utility.table_names import TestTables
from api.models.shared_models import db
import time
import random
import string
from api.utility.labels import ProductImageLabels as Labels

## user object class
class ProductImage(db.Model):
	__tablename__ = TestTables.ImageTable
	image_id = db.Column(db.String, primary_key = True)
	main_image = db.Column(db.Boolean)
	product_id = db.Column(db.Integer, db.ForeignKey(TestTables.MarketProductTable + '.' + Labels.ProductId))
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())

	def __init__(self):
		self.image_id = ProductImage.generateImageId()
		db.Model.__init__(self)

	@staticmethod
	def id_generator(size=20, chars=string.ascii_uppercase + string.digits):
		return ''.join(random.choice(chars) for _ in range(size))

	@staticmethod
	def generateImageId():
		new_image_id = ProductImage.id_generator()
		missing = User.query.filter_by(image_id = new_image_id).first()
		while missing is not None:
			new_image_id = ProductImage.id_generator()
			missing = User.query.filter_by(image_id = new_image_id).first()
		return new_confirmation_id

	def toPublicDict(self):
		public_dict = {}
		public_dict['product_id'] = self.product_id
		public_dict['main_image'] = self.main_image
		public_dict['image_id'] = self.image_id
		return public_dict




