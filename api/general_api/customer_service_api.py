from flask import Blueprint, jsonify, request
from ..utility.feedback_manager import FeedbackManager
from ..utility.table_names import ProdTables


class Labels:
	Success = "success"
	Password = "password"
	Name = "name"
	Email = "email"
	Feedback = "feedback"
	

customer_service_api = Blueprint('customer_service_api', __name__)

feedback_keys = [Labels.Name , Labels.Email, Labels.Feedback]

@customer_service_api.route('/addFeedback', methods = ['POST'])
def addFeedback():
	feedback = {}
	for key in feedback_keys:
		feedback[key] = request.json.get(key)
	feedback_manager = FeedbackManager(ProdTables.FeedbackTable)
	output = feedback_manager.addFeedback(feedback)
	feedback_manager.closeConnection()
	return jsonify(output)

