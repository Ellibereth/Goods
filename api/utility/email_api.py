import smtplib
import time
from email.mime.image import MIMEImage
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

recipients = ['elichang@remaura.com', 'darek@manaweb.com', 'elichang@manaweb.com']

def sendImageEmail(image_name, image_data):
	#to send from temporary gmail 
	"""
	sender = "manaweb.noreply@gmail.com"
	passW = "powerplay"
	smtpserver = smtplib.SMTP('smtp.gmail.com', 587)
	"""
	# to send from manaweb
	sender = 'darek@manaweb.com'
	passW = "sqwcc23mrbnnjwcz"
	message = image_name
	msg = MIMEMultipart()
	msg['Subject'] = "Please find attached images " + image_name
	msg['From'] = "noreply@edgarusa.com"
	msg['To'] = ", ".join(recipients)
	msg['Body'] = 'Image Submission ' + image_name
	with open('./web/static/images/product_submissions/' + image_name, 'rb') as image:
		img = MIMEImage(image.read())
	msg.attach(img)
	smtpserver = smtplib.SMTP('smtp.fastmail.com',587)
	smtpserver.ehlo()
	smtpserver.starttls()
	smtpserver.ehlo
	smtpserver.login(sender, passW)
	smtpserver.send_message(msg)
	smtpserver.close()

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

