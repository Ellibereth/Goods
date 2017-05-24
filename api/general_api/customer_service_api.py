from flask import Blueprint, jsonify, request
from api.utility.table_names import ProdTables
from api.models.feedback import Feedback
from api.models.shared_models import db
from api.utility.labels import FeedbackLabels as Labels
from api.utility import email_api
from api.utility.json_util import JsonUtil

customer_service_api = Blueprint('customer_service_api', __name__)


@customer_service_api.route('/addFeedback', methods = ['POST'])
def addFeedback():
	email = request.json.get(Labels.Email)
	name = request.json.get(Labels.Name)
	feedback_content = request.json.get(Labels.FeedbackContent)
	category = request.json.get(Labels.Category)
	this_feedback = Feedback(email, name, feedback_content, category)
	db.session.add(this_feedback)
	db.session.commit()

	# then email us about the feedback
	email_api.sendFeedbackEmailNotification(this_feedback)
	return JsonUtil.success()

