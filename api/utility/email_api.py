import smtplib
import time
from email.mime.image import MIMEImage
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from api.utility.email_html import EmailHtml
from api.utility.labels import CartLabels as Labels

from api.models.user import User
from api.models.cart import Cart
from api.utility.labels import ErrorLabels

PHOTO_SRC_BASE = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"

ADMIN_RECIPIENTS = ['eli@edgarusa.com', 'darek@manaweb.com', 'darek@edgarusa.com']


URL = "https://edgarusa-testserver.herokuapp.com/"
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
	msg['Subject'] = "Please Confirm Your Email!"
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
	msg['To'] = ", ".join(recipients)
	html = EmailHtml.generateCartEmailNotificationHtml(user, cart, address, order_id)
	htmlPart = MIMEText(html, 'html')
	msg.attach(htmlPart)
	smtpserver.send_message(msg)

	msg = MIMEMultipart()
	msg['Subject'] = "Order Confirmation"
	msg['From'] = "noreply@edgarusa.com"
	msg['To'] = ", ".join(recipients)
	html = EmailHtml.generateCartEmailNotificationHtml(user, cart, address, order_id)
	htmlPart = MIMEText(html, 'html')
	msg.attach(htmlPart)
	smtpserver.send_message(msg)
	smtpserver.close()

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

def notifyUserCheckoutErrorEmail(user, cart, address, error_type):
	sender = 'darek@manaweb.com'
	passW = "sqwcc23mrbnnjwcz"
	msg = MIMEMultipart()
	msg['Subject'] = "USER CHECKOUT ERROR"
	msg['From'] = "noreply@edgarusa.com"
	msg['To'] = ", ".join(ADMIN_RECIPIENTS)
	if not user:
		return
	body = EmailHtml.generateCheckoutErrorHtml(user, cart, address, error_type)
	textPart = MIMEText(body, 'html')
	msg.attach(textPart)
	smtpserver = smtplib.SMTP('smtp.fastmail.com',587)
	smtpserver.ehlo()
	smtpserver.starttls()
	smtpserver.ehlo
	smtpserver.login(sender, passW)
	smtpserver.send_message(msg)
	smtpserver.close()


def testEmail():
	email = "spallstar28@gmail.com"
	# confirmation_id = "ASDFADSF_CONFIRMATIONID1213"
	# name = "DAREK"
	# sendEmailConfirmation(email, confirmation_id, name)
	user = User.query.filter_by(email = email).first()
	cart = Cart(user.account_id)
	address = user.getAddresses()[0]
	# sendPurchaseNotification(user, cart, address, order_id)
	notifyUserCheckoutErrorEmail(user, cart, address, ErrorLabels.Database)
	# notifyUserCheckoutErrorEmail(user, cart, address, ErrorLabels.Charge)
	# notifyUserCheckoutErrorEmail(user, cart, address, ErrorLabels.Email)
	






