
from api.utility.table_names import ProdTables
from api.models.shared_models import db
import time
import random
import string
from api.utility.labels import ProductImageLabels as Labels
from api.utility.id_util import IdUtil
from passlib.hash import argon2


class HomeImage(db.Model):
	__tablename__ = ProdTables.HomeImageTable
	image_id = db.Column(db.String, primary_key=True)
	image_text = db.Column(db.String)
	live = db.Column(db.Boolean, default = False)
	soft_deleted = db.Column(db.Boolean, default = False)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())

	# name,email, password all come from user inputs
	# email_confirmation_id, stripe_customer_id will be generated with try statements 
	def __init__(self, image_text = ""):
		self.image_text = ""
		self.image_id = self.generateImageId()
		db.Model.__init__(self)

	@staticmethod
	def generateImageId():
		new_image_id = IdUtil.id_generator()
		missing = HomeImage.query.filter_by(image_id = new_image_id).first()
		while missing is not None:
			new_image_id = IdUtil.id_generator()
			missing = HomeImage.query.filter_by(image_id = new_image_id).first()
		return new_image_id

	@staticmethod
	def addHomeImage(image_data):
		home_image = ProductImage()
		db.session.add(image_record)
		# upload the image to S3
		S3.uploadHomeImage(image_record.image_id, image_decoded)
		# commit to database
		db.session.commit()

	def toPublicDict(self):
		public_dict = {}
		public_dict[Labels.ImageId] = self.image_id
		public_dict[Labels.ImageText] = self.image_text
		public_dict[Labels.Live] = self.live
		return public_dict







