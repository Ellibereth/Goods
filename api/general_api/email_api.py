from flask import Blueprint, jsonify, request
from api.utility.json_util import JsonUtil
from api.utility.jwt_util import JwtUtil
from api.security.tracking import LoginAttempt
from api.utility.labels import EmailLabels as Labels
from api.models.shared_models import db
from api.general_api import decorators
from api.utility.error import ErrorMessages
import base64
from api.s3.s3_api import S3
from api.utility.email import EmailLib
from api.models.email_list import EmailSubscription
from api.models.email_list import EmailList
from api.security.tracking import AdminAction
email_api = Blueprint('email_api', __name__)

@email_api.route('/getAllEmailListData', methods =['POST'])
@decorators.check_admin_jwt
def getAllEmailListData(admin_user):
	email_list_data = EmailList.getAllEmailListData()
	AdminAction.addAdminAction(admin_user, request.path, request.remote_addr, success = True)
	return JsonUtil.successWithOutput({Labels.EmailListData : email_list_data})

@email_api.route('/getEmailListInfo', methods =['POST'])
@decorators.check_admin_jwt
def getEmailListInfo(admin_user):
	email_list_id = request.json.get(Labels.EmailListId)
	email_list_info = EmailList.getEmailListInfo(email_list_id)
	if not email_list_info:
		AdminAction.addAdminAction(admin_user, request.path, request.remote_addr, success = False)
		return JsonUtil.failure()
	AdminAction.addAdminAction(admin_user, request.path, request.remote_addr, success = True)
	return JsonUtil.successWithOutput({Labels.EmailList : email_list_info.toPublicDict()})

@email_api.route('/unsubscribeUserFromEmailList', methods =['POST'])
def unsubscribeUserFromEmailList():
	unsubscribe_id = request.json.get(Labels.UnsubscribeId)
	email_subscriber = EmailSubscription.query.filter_by(unsubscribe_id = unsubscribe_id).first()
	if not email_subscriber:
		return JsonUtil.failure()
	db.session.delete(email_subscriber)
	db.session.commit()
	return JsonUtil.successWithOutput({Labels.EmailList : email_list_info.toPublicDict()})


@email_api.route('/subscribeUserToEmailList', methods =['POST'])
def subscribeUserToEmailList():
	email_list_id = request.json.get(Labels.EmailListId)
	email = request.json.get(Labels.Email)
	new_sub = EmailSubscription.addEmailSubscription(email, email_list_id)
	if not new_sub:
		return JsonUtil.failure()
	return JsonUtil.success()

@email_api.route('/addNewEmailList', methods =['POST'])
@decorators.check_admin_jwt
def addNewEmailList(admin_user):
	new_email_list_name = request.json.get(Labels.NewEmailListName)

	matching_list = EmailList.query.filter_by(email_list_name = new_email_list_name).first()
	if matching_list:
		AdminAction.addAdminAction(admin_user, request.path, request.remote_addr, success = False)
		return JsonUtil.failure(ErrorMessages.EmailListNameTaken)
	EmailList.addNewEmailList(new_email_list_name)
	AdminAction.addAdminAction(admin_user, request.path, request.remote_addr, success = True)
	return JsonUtil.successWithOutput()




