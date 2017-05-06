import smtplib
import time
from email.mime.image import MIMEImage
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from api.utility.labels import CartLabels as Labels

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
	# try:
	smtpserver.send_message(msg)
	# 	output = {Success : True, Labels.EmailConfirmationId : confirmation_id}
	# except:
	# 	output = {"success" : False}
	smtpserver.close()

def sendEmailConfirmation(email, email_confirmation_id):
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
	msg['Subject'] = "Please Confirm Your Email!"
	msg['From'] = "noreply@edgarusa.com"
	msg['To'] = email
	url = URL + "confirmEmail/" + email_confirmation_id
	body = "Click on the following link to confirm your e-mail \n " + url
	textPart = MIMEText(body, 'plain')
	msg.attach(textPart)
	smtpserver = smtplib.SMTP('smtp.fastmail.com',587)
	smtpserver.ehlo()
	smtpserver.starttls()
	smtpserver.ehlo
	smtpserver.login(sender, passW)
	# smtpserver.sendmail(sender, receiver, msg)
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
	body = "Name: " + feedback.name + "\n Email: " + feedback.email + \
			"\n Content: " + feedback.feedback_content
	textPart = MIMEText(body, 'plain')
	msg.attach(textPart)
	smtpserver = smtplib.SMTP('smtp.fastmail.com',587)
	smtpserver.ehlo()
	smtpserver.starttls()
	smtpserver.ehlo
	smtpserver.login(sender, passW)
	smtpserver.send_message(msg)
	smtpserver.close()

def sendPurchaseNotification(user, cart, address):
	sender = 'darek@manaweb.com'
	passW = "sqwcc23mrbnnjwcz"
	
	smtpserver = smtplib.SMTP('smtp.fastmail.com',587)
	smtpserver.ehlo()
	smtpserver.starttls()
	smtpserver.ehlo
	smtpserver.login(sender, passW)
	msg = generateCartEmailNotificationMime([user.email], user, cart, address)
	smtpserver.send_message(msg)

	# send the customer confirmation msg = MIMEMultipart()
	# this will be changed but is a fun place holder!
	msg = generateCartEmailNotificationMime(ADMIN_RECIPIENTS, user, cart, address)
	smtpserver.send_message(msg)
	smtpserver.close()



# returns MIMText to attach to a message
def generateCartEmailNotificationMime(recipients, user, cart, address):
	msg = MIMEMultipart()
	msg['Subject'] = "User Order!"
	msg['From'] = "noreply@edgarusa.com"
	msg['To'] = ", ".join(recipients)
	body = """
		<span> Thank you for ordering with Edgar USA! Below is a summary if your order!" </span>
		<br/>
	"""
	textPart = MIMEText(body, 'html')
	msg.attach(textPart)

	for product in cart.toPublicDict()['items']:
		cart_item_html = generateCartItemRow(product)
		msg.attach(cart_item_html)

	body = "------------------------------------" + "\n All of this was sent to "
	body = body + "\n" + address.address_line1 + " " + address. address_line2
	body = body + "\n " + address.address_city + ", " + address.address_state + " " + address.address_zip

	textPart = MIMEText(body, 'plain')
	msg.attach(textPart)
	return msg

def generateCartItemRow(product):
	html = (
		" \
		<span> Name: " + str(product[Labels.Name]) + " </span> <br/> \
		<span> Unit Price : " + str(product[Labels.Price]) + "</span> <br/> \
		<span> Quantity : " + str(product[Labels.NumItems]) + "</span> <br/> \
		<img style = 'height: 100px; width 100px' src='" + PHOTO_SRC_BASE 
	+ product[Labels.MainImage] + "'/> <br/> \
		<hr/> <br/>"
	)
	cart_item_html = MIMEText(html, 'html')
	return cart_item_html





