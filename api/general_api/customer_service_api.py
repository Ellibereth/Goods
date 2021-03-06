from flask import Blueprint, jsonify, request
from api.utility.table_names import ProdTables
from api.models.feedback import Feedback
from api.models.shared_models import db
from api.utility.labels import FeedbackLabels as Labels
from api.utility.email import EmailLib
from api.utility.json_util import JsonUtil
from api.utility.error import ErrorMessages

customer_service_api = Blueprint('customer_service_api', __name__)


@customer_service_api.route('/addFeedback', methods = ['POST'])
def addFeedback():
	email = request.json.get(Labels.Email)
	name = request.json.get(Labels.Name)
	feedback_content = request.json.get(Labels.FeedbackContent)
	category = request.json.get(Labels.Category)
	order_id = request.json.get(Labels.OrderId)

	if category == "":
		return JsonUtil.failure(ErrorMessages.BlankCategory)
	if feedback_content == "":
		return JsonUtil.failure(ErrorMessages.BlankMessage)

	this_feedback = Feedback(email, name, feedback_content, category, order_id)
	db.session.add(this_feedback)
	db.session.commit()

	# then email us about the feedback
	EmailLib.sendFeedbackEmailNotification(this_feedback)
	return JsonUtil.success()

