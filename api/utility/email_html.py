from email.mime.image import MIMEImage
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from api.utility.labels import CartLabels as Labels

URL = "https://edgarusa-testserver.herokuapp.com/"

PHOTO_SRC_BASE = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"

class EmailHtml:

	def generateEmailHtml(email, email_confirmation_id, name):
		url = URL + "confirmEmail/" + email_confirmation_id
		body = "<h2> Hello, " + name.title() + "</h2>"
		body = body + "<span style = \"display:block;font-size: 14px;\"> Thank you for signing up! Click below to confirm your account </span>"
		body = body + "<span style = \"display:block;font-size: 14px;\"> " +  url + "</span>"
		body = body + "<h2> Welcome to Edgar USA! </h2>"

		return body


	# returns MIMText to attach to a message
	def generateCartEmailNotificationMime(recipients, user, cart, address):
		msg = MIMEMultipart()
		msg['Subject'] = "User Order!"
		msg['From'] = "noreply@edgarusa.com"
		msg['To'] = ", ".join(recipients)
		body = "<span style = \"display:block;font-size: 14px;color:#002868\"> Hello, " + user.name + " </span>"
		body = body + "<hr/>"
		num_items = len(cart.toPublicDict()['items'])
		first_item = cart.toPublicDict()['items'][0]
		url_link = URL + "/oders"
		if num_items == 1:
			link_text = first_item['name']
		elif num_items == 2:
			link_text = first_item['name'] + " and " + str(num_items - 1) + " other has been received"
		else:
			link_text = first_item['name'] + " and " + str(num_items - 1) + " others has been received"

		body =  body + "<span style = \"display:block;font-size: 12px;\"> Your order for \
		<a href = \"" + url_link + "\">" + link_text + "</span>"
		body = body + "<span style = \"display:block;font-size: 14px;color:#002868\"> Details </span>"
		body = body + "<div style = \"border-style: solid;border-width:2px;border-radius:4px;padding:8px;width:50%\">"

		body = body + "<div style = \"width:50%\">"
		body = body + "<span style = \"display:block;color:grey;\"> Shipped to </span>"
		body = body + "<span style = \"display:block;\"> <b>" + user.name + "</b> </span>"
		body = body + "<span style = \"display:block;\"> <b>" + address.address_line1 + "</b> </span>"
		body = body + "<span style = \"display:block;\"> <b>" + address.address_line2 + "</b> </span>"
		body = body + "</div>"
		body = body + "<div style = \"width:50%\">"
		body = body + "<button type = \"button\" style = \"border-radius:4px; background-color:white\">"
		body = body + "<span style = \"display:block;\"> <a href = \"" + url_link + "\"> View Order </a> </span>"
		body = body + "</button>"
		body = body + "</div>"
		body = body + "</div>"

		textPart = MIMEText(body, 'html')
		msg.attach(textPart)
		return msg

	def generateCartItemRow(product):
		html = (
			"<span> Name: " + str(product[Labels.Name]) + " </span> <br/> \
			<span> Unit Price : " + str(product[Labels.Price]) + "</span> <br/> \
			<span> Quantity : " + str(product[Labels.NumItems]) + "</span> <br/> \
			<img style = \"height:100px;width:100px\" src=\"" + PHOTO_SRC_BASE 
		+ product[Labels.MainImage] + "\"/> <br/> \
			<hr/> <br/>"
		)

		cart_item_html = MIMEText(html, 'html')
		return cart_item_html

	

