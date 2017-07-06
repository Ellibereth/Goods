from api.utility.table_names import ProdTables
from api.models.shared_models import db
import time
import random
import string
from api.utility.labels import EmailLabels as Labels
from api.utility.id_util import IdUtil

## I understand there are magic strings in this, but not sure the best way to get around it right now
## it's mostly an issue in the updateSettings which takes a dictionary as input, but we'll see


## user object class
class EmailSubscription(db.Model):
	__tablename__ = ProdTables.EmailSubscriptionTable
	email_subscription_id = db.Column(db.Integer, primary_key = True, autoincrement = True)

	email = db.Column(db.String, nullable = False)
	unsubscribe_id = db.Column(db.String, unique = True)
	email_list_name = db.Column(db.String, db.ForeignKey(ProdTables.EmailListTable + '.' + Labels.EmailListName))
	email_list_id = db.Column(db.Integer, db.ForeignKey(ProdTables.EmailListTable + '.' + Labels.EmailListId))
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())



	# name,email, password all come from user inputs
	# email_confirmation_id, stripe_customer_id will be generated with try statements 
	def __init__(self, email, email_list_id, email_list_name):
		self.email = email
		self.email_list_id = email_list_id
		self.email_list_name = email_list_name
		db.Model.__init__(self)


	@staticmethod
	def generateUnsubscribeKey():
		new_unsubscribe_id = IdUtil.id_generator()
		missing = EmailSubscription.query.filter_by(unsubscribe_id = new_unsubscribe_id).first()
		while missing is not None:
			new_unsubscribe_id = IdUtil.id_generator()
			missing = User.query.filter_by(unsubscribe_id = new_unsubscribe_id).first()
		return new_unsubscribe_id

	@staticmethod
	def getEmailListSubscribers(email_list_name):
		subscribers_query = EmailSubscription.query.filter_by(email_list_name = email_list_name).all()
		if len(subscribers_query) == 0:
			return []
		else:
			return [subscriber.email for subscriber in subscribers_query]
		
	@staticmethod
	def addEmailSubscription(email, email_list_id):
		email_list_name = EmailList.getEmailListNameById(email_list_id)
		if not email_list_name:
			return None
		new_sub = EmailSubscription(email, email_list_id)
		db.session.add(new_sub)
		db.session.commit(new_sub)
		return new_sub.toPublicDict()

	def toPublicDict(self):
		public_dict = {}
		public_dict[Labels.Email] = self.email
		public_dict[Labels.EmailListId] = self.email_list_id
		public_dict[Labels.EmailListName] = self.email_list_name
		public_dict[Labels.UnsubscribeId] = self.unsubscribe_id
		return public_dict

class EmailList(db.Model):
	__tablename__ = ProdTables.EmailListTable
	email_list_id = db.Column(db.Integer, autoincrement = True, primary_key = True)
	email_list_name = db.Column(db.String, unique = True)


	# name,email, password all come from user inputs
	# email_confirmation_id, stripe_customer_id will be generated with try statements 
	def __init__(self, email_list_name):
		self.email_list_name = email_list_name
		db.Model.__init__(self)
		
	@staticmethod
	def addNewEmailList(email_list_name):
		new_email_list = EmailList(email_list_name)
		db.session.add(new_email_list)
		db.session.commit()

	@staticmethod
	def getEmailListNameById(email_list_id):
		this_list = EmailList.query.filter_by(email_list_id = email_list_id).first()
		if this_list:
			return this_list.email_list_name
		return None

	@staticmethod
	def getAllEmailListData():
		email_lists = EmailList.query.filter_by().all()
		return [email_list.toPublicDict() for email_list in email_lists]

	@staticmethod
	def getEmailListInfo(email_list_id):
		if email_list_id == None:
			return None
		return EmailList.query.filter_by(email_list_id = email_list_id).first()



	def toPublicDict(self):
		public_dict = {}
		public_dict[Labels.EmailListName] = self.email_list_name
		public_dict[Labels.EmailListId] = self.email_list_id
		subscriber_list  = EmailSubscription.getEmailListSubscribers(self.email_list_name)
		public_dict[Labels.SubscribedUsers] = subscriber_list
		public_dict[Labels.NumSubscribers] = len(subscriber_list)
		return public_dict
