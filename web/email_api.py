import smtplib
import time
from email.mime.image import MIMEImage
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

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
	msg['From'] = "noreply@manaweb.com"
	msg['To'] = "darek@manaweb.com"
	msg['Body'] = 'Image Submission ' + image_name

	with open('./web/static/images/product_submissions/' + image_name, 'rb') as image:
		img = MIMEImage(image.read())
	msg.attach(img)

	smtpserver = smtplib.SMTP('smtp.fastmail.com',587)
	smtpserver.ehlo()
	smtpserver.starttls()
	smtpserver.ehlo
	smtpserver.login(sender, passW)
	# smtpserver.sendmail(sender, receiver, msg)
	
	smtpserver.send_message(msg)
	smtpserver.close()

def sendRequestEmail(request):
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
	msg['Subject'] = "User Request!"
	msg['From'] = "noreply@manaweb.com"
	msg['To'] = "darek@manaweb.com"
	contact_information = str(request.get('contact_information'))
	product_name = str(request.get('product_name'))
	price_min = str(request.get('price_min'))
	price_max = str(request.get('price_max'))
	body = 'Here is a request from ' + contact_information + "\n" + "Looking for a " + product_name + \
		" within the price range : ( " + price_min + " , " + price_max  + ")"
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
	msg['From'] = "noreply@manaweb.com"
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

