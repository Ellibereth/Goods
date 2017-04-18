import smtplib
import time
from email.mime.image import MIMEImage
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


recipients = ['elichang@remaura.com', 'darek@manaweb.com', 'elichang@manaweb.com']

## informs darek@manaweb.com of the incoming request 
def sendRequestEmail(request):
	sender = 'darek@manaweb.com'
	passW = "sqwcc23mrbnnjwcz"
	msg = MIMEMultipart()
	msg['Subject'] = "User Request!"
	msg['From'] = "noreply@edgarusa.com"
	msg['To'] = ", ".join(recipients)
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
	url = "https://whereisitmade.herokuapp.com/confirmRequest/" + request.confirmation_id
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
	url = "https://whereisitmade.herokuapp.com/confirmEmail/" + email_confirmation_id
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
	msg['To'] = ", ".join(recipients)
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

def sendPurchaseNotification(user, cart):
	sender = 'darek@manaweb.com'
	passW = "sqwcc23mrbnnjwcz"
	msg = MIMEMultipart()
	# the first part notifies us
	msg['Subject'] = "User Order!"
	msg['From'] = "noreply@edgarusa.com"
	msg['To'] = ", ".join(recipients)
	body = "From \n Name: " + user.name + "\n Email: " + user.email + "\n"

	for product in cart.getProductsAsDict():
		body = body + "\n Name : " + product[Labels.Name]
		body = body + "\n Product ID : " + product[Labels.ProductId]
		body = body + "\n Unit Price : " + product[Labels.Price]
		body = body + "\n Quantity : " + product[Labels.NumItems]
		body = body + "\n \n Moving on to Next Item \n \n ------------------------------"

	textPart = MIMEText(body, 'plain')
	msg.attach(textPart)
	smtpserver = smtplib.SMTP('smtp.fastmail.com',587)
	smtpserver.ehlo()
	smtpserver.starttls()
	smtpserver.ehlo
	smtpserver.login(sender, passW)
	smtpserver.send_message(msg)

	# send the customer confirmation msg = MIMEMultipart()
	# this will be changed but is a fun place holder!
	msg['Subject'] = "User Order!"
	msg['From'] = "noreply@edgarusa.com"
	msg['To'] = user.email
	body = "Thank you for ordering with Edgar USA! Below is a summary if your order!"

	for product in cart.getProductsAsDict():
		body = body + "\n Name : " + product[Labels.Name]
		body = body + "\n Product ID : " + product[Labels.ProductId]
		body = body + "\n Unit Price : " + product[Labels.Price]
		body = body + "\n Quantity : " + product[Labels.NumItems]
		body = body + "\n \n Moving on to Next Item \n \n ------------------------------"

	textPart = MIMEText(body, 'plain')
	msg.attach(textPart)
	smtpserver = smtplib.SMTP('smtp.fastmail.com',587)
	smtpserver.ehlo()
	smtpserver.starttls()
	smtpserver.ehlo
	smtpserver.login(sender, passW)
	smtpserver.send_message(msg)
	smtpserver.close()

