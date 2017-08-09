from api.utility.table_names import ProdTables
from api.models.shared_models import db


class LaunchListEmail(db.Model):
	__tablename__ = ProdTables.LaunchListEmailTable
	launch_list_email_id = db.Column(db.Integer, primary_key = True, autoincrement = True)
	email = db.Column(db.String)
	ip = db.Column(db.String)
	date_created  = db.Column(db.DateTime,  default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime,  default=db.func.current_timestamp(),
										   onupdate=db.func.current_timestamp())


	# name,email, password all come from user inputs
	# email_confirmation_id, stripe_customer_id will be generated with try statements 
	def __init__(self, email, ip):
		self.ip = ip
		self.email = email
		db.Model.__init__(self)

	@staticmethod
	def AddToLaunchList(email, ip):
		new_entry = LaunchListEmail(email, ip)
		db.session.add(new_entry)
		db.session.commit(new_entry)




