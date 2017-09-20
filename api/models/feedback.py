"""
: Module that contians Feedback class
"""

from api.models.shared_models import db
from api.utility.table_names import ProdTables
from api.utility.labels import FeedbackLabels as Labels

class Feedback(db.Model):
	"""
	: This class stores feedback user's provide to Edgar USA
	: Implemented with SQLAlchemy DB Model
	"""
	__tablename__ = ProdTables.FeedbackTable
	feedback_id = db.Column(db.Integer, primary_key = True, autoincrement = True)
	email = db.Column(db.String, nullable = False)
	name = db.Column(db.String, nullable = False)
	feedback_content = db.Column(db.String)
	category = db.Column(db.String)
	account_id = db.Column(db.String, nullable = True)
	order_id = db.Column(db.String)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())

	def __init__(self, email, name, feedback_content, category, order_id = None):
		self.name = name
		self.email = email
		self.feedback_content = feedback_content
		self.category = category
		self.order_id = order_id
		db.Model.__init__(self)
		

	def toPublicDict(self):
		"""
		: Returns the feedback as a public dictionary
		"""
		public_dict = {}
		public_dict[Labels.Name] = self.name
		public_dict[Labels.Email] = self.email
		public_dict[Labels.FeedbackContent] = self.feedback_content
		public_dict[Labels.Category] = self.category
		return public_dict
