import smtplib
import time
import sys 
import os

from email.mime.image import MIMEImage
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from api.utility.email_html import EmailHtml
from api.utility.labels import CartLabels as Labels

from api.models.cart import Cart
from api.utility.labels import ErrorLabels
import os
import traceback


PHOTO_SRC_BASE = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"

ADMIN_RECIPIENTS = [
	'eli@edgarusa.com', 
	'darek@manaweb.com', 
	'darek@edgarusa.com', 
	'darekjohnson28@gmail.com', 
	'spallstar28@gmail.com', 
	'eli.chang.iv@gmail.com'
]

ITEMS = "items"
MANUFACTURER = "manufacturer"
MANUFACTURER_EMAIL = "manufacturer_email"


URL = os.environ.get('HEROKU_APP_URL')
# in this case Darek is using local host to test
if URL == None:
	URL = "0.0.0.0:5000/"


class EmailLib:
	## informs darek@manaweb.com of the incoming request 
	def sendRequestEmail(request):
		sender = 'darek@manaweb.com'
		passW = "sqwcc23mrbnnjwcz"
		msg = MIMEMultipart()
		msg['Subject'] = "User Request!"
		msg['From'] = "noreply@edgarusa.com"
		msg['To'] = ", ".join(ADMIN_RECIPIENTS)
		body = 'Here is a request from ' + request.email + "\n" + "Looking for a " + request.description + \
			" in the price range : " + request.price_range
		textPart = MIMEText(body, 'plain')
		msg.attach(textPart)
		smtpserver = smtplib.SMTP('smtp.fastmail.com',587)
		smtpserver.ehlo()
		smtpserver.starttls()
		smtpserver.ehlo
		smtpserver.login(sender, passW)
		smtpserver.send_message(msg)
		smtpserver.close()


	## sends an email to the user to confirm the request
	def sendRequestConfirmation(request):
		sender = 'darek@manaweb.com'
		passW = "sqwcc23mrbnnjwcz"
		msg = MIMEMultipart()
		msg['Subject'] = "User Request!"
		msg['From'] = "noreply@edgarusa.com"
		email = str(request.email)
		msg['To'] = email
		product_description = request.description
		price_range = request.price_range
		url = URL + "confirmRequest/" + request.confirmation_id
		body = 'This email is to confirm that you submitted a request on Edgar USA \n' \
			+ "Please click the following link to confirm : " + url + "\n"  \
			"If you did not submit a request, please ignore this email"
		textPart = MIMEText(body, 'plain')
		msg.attach(textPart)
		smtpserver = smtplib.SMTP('smtp.fastmail.com',587)
		smtpserver.ehlo()
		smtpserver.starttls()
		smtpserver.ehlo
		smtpserver.login(sender, passW)
		smtpserver.send_message(msg)
		smtpserver.close()

	def sendFeedbackEmailNotification(feedback):
		#to send from temporary gmail 
		"""
		sender = "manaweb.noreply@gmail.com"
		passW = "powerplay"
		smtpserver = smtplib.SMTP('smtp.gmail.com', 587)
		"""	
		# to send from manaweb
		sender = 'darek@manaweb.com'
		passW = "sqwcc23mrbnnjwcz"
		msg = MIMEMultipart()
		msg['Subject'] = "User Feedback!"
		msg['From'] = "noreply@edgarusa.com"
		msg['To'] = ", ".join(ADMIN_RECIPIENTS)
		name = feedback.name
		if feedback.order_id == None or feedback.order_id == "":
			order_id = "N/A"
		else:
			order_id = feedback.order_id
		body = "Name: " + feedback.name + "\n Email: " + feedback.email + \
				"\n Content: " + feedback.feedback_content + \
				"\n Category: " + feedback.category + \
				"\n OrderId : " + order_id
		textPart = MIMEText(body, 'plain')
		msg.attach(textPart)
		smtpserver = smtplib.SMTP('smtp.fastmail.com',587)
		smtpserver.ehlo()
		smtpserver.starttls()
		smtpserver.ehlo
		smtpserver.login(sender, passW)
		smtpserver.send_message(msg)
		smtpserver.close()


	def sendEmailConfirmation(email, email_confirmation_id, name):
		sender = 'darek@manaweb.com'
		passW = "sqwcc23mrbnnjwcz"
		msg = MIMEMultipart()
		msg['Subject'] = "Please confirm your email"
		msg['From'] = "noreply@edgarusa.com"
		msg['To'] = email
		body = EmailHtml.generateConfirmationEmailHtml(email, email_confirmation_id, name)
		textPart = MIMEText(body, 'html')
		msg.attach(textPart)
		smtpserver = smtplib.SMTP('smtp.fastmail.com',587)
		smtpserver.ehlo()
		smtpserver.starttls()
		smtpserver.ehlo
		smtpserver.login(sender, passW)
		smtpserver.send_message(msg)
		smtpserver.close()


	def sendEmailChangeConfirmation(email, email_confirmation_id, name):
		sender = 'darek@manaweb.com'
		passW = "sqwcc23mrbnnjwcz"
		msg = MIMEMultipart()
		msg['Subject'] = "Please confirm your email"
		msg['From'] = "noreply@edgarusa.com"
		msg['To'] = email
		body = EmailHtml.generateConfirmationChangeEmailHtml(email, email_confirmation_id, name)
		textPart = MIMEText(body, 'html')
		msg.attach(textPart)
		smtpserver = smtplib.SMTP('smtp.fastmail.com',587)
		smtpserver.ehlo()
		smtpserver.starttls()
		smtpserver.ehlo
		smtpserver.login(sender, passW)
		smtpserver.send_message(msg)
		smtpserver.close()


	@staticmethod
	def sendVendorsOrders(user, cart, address, order_id):
		email_to_vendors_dict = {}
		for cart_item in cart.toPublicDict()[ITEMS]:
			manufacturer_email = cart_item.get(Labels.ManufacturerEmail)
			if email_to_vendors_dict.get(manufacturer_email):
				new_list = email_to_vendors_dict[manufacturer_email]
				new_list.append(cart_item)
				email_to_vendors_dict[manufacturer_email] = new_list
			else:
				new_list = [cart_item]
				email_to_vendors_dict[manufacturer_email] = new_list
			

		sender = 'darek@manaweb.com'
		passW = "sqwcc23mrbnnjwcz"
		
		smtpserver = smtplib.SMTP('smtp.fastmail.com',587)
		smtpserver.ehlo()
		smtpserver.starttls()
		smtpserver.ehlo
		smtpserver.login(sender, passW)

		for manufacturer_email in email_to_vendors_dict.keys():
			msg = MIMEMultipart()
			msg['Subject'] = "Order Notification"
			msg['From'] = "noreply@edgarusa.com"
			msg['To'] = manufacturer_email
			html = EmailHtml.generateVendorOrderNotification(user, email_to_vendors_dict[manufacturer_email], address, order_id)
			htmlPart = MIMEText(html, 'html')
			msg.attach(htmlPart)
			smtpserver.send_message(msg)
		smtpserver.close()	

	def sendPurchaseNotification(user, cart, address, order_id):
		sender = 'darek@manaweb.com'
		passW = "sqwcc23mrbnnjwcz"
		smtpserver = smtplib.SMTP('smtp.fastmail.com',587)
		smtpserver.ehlo()
		smtpserver.starttls()
		smtpserver.ehlo
		smtpserver.login(sender, passW)
		msg = MIMEMultipart()
		msg['Subject'] = "Order Confirmation"
		msg['From'] = "noreply@edgarusa.com"
		msg['To'] = user.email
		html = EmailHtml.generateCartEmailNotificationHtml(user, cart, address, order_id)
		htmlPart = MIMEText(html, 'html')
		msg.attach(htmlPart)
		smtpserver.send_message(msg)

		msg = MIMEMultipart()
		msg['Subject'] = "Order Confirmation"
		msg['From'] = "noreply@edgarusa.com"
		msg['To'] = ", ".join(ADMIN_RECIPIENTS)
		html = EmailHtml.generateCartEmailNotificationHtml(user, cart, address, order_id)
		htmlPart = MIMEText(html, 'html')
		msg.attach(htmlPart)
		smtpserver.send_message(msg)
		smtpserver.close()

		EmailLib.sendVendorsOrders(user, cart, address, order_id)



	def sendRecoveryEmail(user):
		sender = 'darek@manaweb.com'
		passW = "sqwcc23mrbnnjwcz"
		smtpserver = smtplib.SMTP('smtp.fastmail.com',587)
		smtpserver.ehlo()
		smtpserver.starttls()
		smtpserver.ehlo
		smtpserver.login(sender, passW)
		msg = EmailHtml.generateRecoveryEmail(user)
		smtpserver.send_message(msg)
		smtpserver.close()

	def notifyUserCheckoutErrorEmail(user, cart, address, error_type, python_error = None):
		sender = 'darek@manaweb.com'
		passW = "sqwcc23mrbnnjwcz"
		msg = MIMEMultipart()
		msg['Subject'] = "USER CHECKOUT ERROR"
		msg['From'] = "errorbot@edgarusa.com"
		msg['To'] = ", ".join(ADMIN_RECIPIENTS)
		if not user:
			return

		if python_error:
			error_string = traceback.format_exc()
		else:
			error_string = ""

		body = EmailHtml.generateCheckoutErrorHtml(user, cart, address, error_type, error_string)
		textPart = MIMEText(body, 'html')
		msg.attach(textPart)
		smtpserver = smtplib.SMTP('smtp.fastmail.com',587)
		smtpserver.ehlo()
		smtpserver.starttls()
		smtpserver.ehlo
		smtpserver.login(sender, passW)
		smtpserver.send_message(msg)
		smtpserver.close()

	def reportServerError(reponse, python_error, request, user = None):
		sender = 'darek@manaweb.com'
		passW = "sqwcc23mrbnnjwcz"
		msg = MIMEMultipart()
		msg['Subject'] = reponse + " error"
		msg['From'] = "errorbot@edgarusa.com"
		msg['To'] = ", ".join(ADMIN_RECIPIENTS)

		body = "Environment: " + str(os.environ.get("ENVIRONMENT")) + "\n"
		body = body + "Path: " + str(request.path) + "\n" 
		body = body + "Method: " + str(request.method) + "\n"
		body =  body + traceback.format_exc()
		textPart = MIMEText(body, 'plain')
		msg.attach(textPart)
		smtpserver = smtplib.SMTP('smtp.fastmail.com',587)
		smtpserver.ehlo()
		smtpserver.starttls()
		smtpserver.ehlo
		smtpserver.login(sender, passW)
		smtpserver.send_message(msg)
		smtpserver.close()



