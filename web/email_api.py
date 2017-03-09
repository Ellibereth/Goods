import smtplib
import time
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart

def sendImageEmail(email, image_name, image_data):
	#to send from temporary gmail 
	"""
	sender = "manaweb.noreply@gmail.com"
	passW = "powerplay"
	smtpserver = smtplib.SMTP('smtp.gmail.com', 587)
	"""
	
	# to send from manaweb
	sender = 'darek@manaweb.com'
	passW = "sqwcc23mrbnnjwcz"
	
	receiver = email
	message = image_name
	msg = MIMEMultipart()
	msg['Subject'] = "Please find attached images " + image_name
	msg['From'] = "noreply@manaweb.com"
	msg['To'] = "darek@manaweb.com"
	msg.preamble = 'Image Submission ' + image_name

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

