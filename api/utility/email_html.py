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
	def generateCartEmailNotificationMime(recipients, user, cart, address, order_id):
		msg = MIMEMultipart()
		msg['Subject'] = "User Order!"
		msg['From'] = "noreply@edgarusa.com"
		msg['To'] = ", ".join(recipients)
		body = "<div style = \"width:70%\">"
		body = body + "<span style = \"display:block;font-size: 36px;color:#002868\"> Hello, " + user.name + " </span>"
		body = body + "<hr/>"
		num_items = len(cart.toPublicDict()['items'])
		first_item = cart.toPublicDict()['items'][0]
		url_link = URL + "myOrders"
		if num_items == 1:
			link_text = first_item['name']
		elif num_items == 2:
			link_text = first_item['name'] + " and " + str(num_items - 1) + " other"
		else:
			link_text = first_item['name'] + " and " + str(num_items - 1) + " others"


		body =  body + "<span style = \"display:block;font-size: 18px;\"> Your order for </span>\
		<span style = \"display:block;font-size: 28px;\"> <a href = \"" + url_link + "\">" + link_text + "</a> </span> \
		<span style = \"display:block;font-size: 18px;\"> has been received and will be shipped to </span> \
		<div style= \"padding-top:12px;\"/> \
		<span style = \"display:block;font-size: 24px;\"> " + address.name + " </span> \
		<span style = \"display:block;font-size: 24px;\"> " + address.address_line1 + " </span> "
		if address.address_line2 != "":
			body = body + "<span style = \"display:block;font-size: 24px;\"> " + address.address_line2 + " </span>"
		body = body + "<span style = \"display:block;font-size: 24px;\"> " + address.address_city + ", " + address.address_state \
		+ " " + str(address.address_zip) + " </span>"

		body = body + "<div style = \"padding-top:12px\"/>"

		body = body + "<span style = \"display:block;font-size: 36px;color:#002868\"> Item Details </span>"
		body = body + "<div style = \"border-style: solid;border-width:2px;border-radius:4px;padding:6px;width:75%\">"
		body = body + "<table cellspacing = \"0\" cellpadding = \"4\" \
		 style = \"width: 100%; border:solid; border-width: 2px; border-color:grey; border-collapse: collapse\">"
		
		for product in cart.toPublicDict()['items']:
			body = body + EmailHtml.generateCartItemRow(product, order_id)

		body = body + "</table>"

		body = body + "<hr/>"
		body = body + "<span style = \"display:block\">"
		body = body + "<span style= \"font-size: 14px;color:#002868;\"> Items </span>"
		body = body + "<span style= \"font-size: 14px;color:#002868; float:right\">" + EmailHtml.formatPrice(cart.items_price) + "</span>"
		body = body + "</span>"
		body = body + "<br/>"
		body = body + "<span style = \"display:block\">"
		body = body + "<span style= \"font-size: 14px;color:#002868;\"> Shipping </span>"
		body = body + "<span style= \"font-size: 14px;color:#002868; float:right\">" + EmailHtml.formatPrice(cart.shipping_price) + "</span>"
		body = body + "</span>"
		body = body + "<br/>"
		body = body + "<span style = \"display:block\">"
		body = body + "<span style= \"font-size: 14px;color:#002868;\"> Total </span>"
		body = body + "<span style= \"font-size: 14px;color:#002868; float:right\">" + EmailHtml.formatPrice(cart.total_price) + "</span>"
		body = body + "</span>"
		body = body + "</div>"
		body = body + "</div>"

		textPart = MIMEText(body, 'html')
		msg.attach(textPart)
		return msg

	def generateCartItemRow(product, order_id):
		url_link = URL + "myOrders"
		html = (
			"<tr> <td style =  \"border:solid; border-width: 2px; border-color:grey\"\"> \
			<img style = \"height:100px;width:100px; padding: 6px;\" src=\"" + PHOTO_SRC_BASE 
			+ product[Labels.MainImage] + "\"/>  </span> </td>\
			<td style = \"border:solid; border-width: 2px; border-color:grey\"> <span style = \"display:block;padding:12px;\">  \
			<span> Name: " + str(product[Labels.Name]) + " </span> <br/> \
			<span> Unit Price : " + EmailHtml.formatPrice(product[Labels.Price]) + "</span> <br/> \
			<span> Quantity : " + str(product[Labels.NumItems]) + "</span> <br/> \
			<span> Order# : <a href = \"" + url_link + "\">" + str(order_id) + "</a> </span> <br/> \
			<span> Click <a href = \"" + url_link + "\">here</a> to view </span> <br/> \
			</span> </td>  </tr> "
		)

		return html

	def formatPrice(price):
		if not price:
			if price == 0: 
				return "0.00"
			else:
				return ""	
		decimal_splits = str(price).split('.')
		dollars = decimal_splits[0]
		
		if len(decimal_splits) < 2:
			cents = "00"
		else:
			cents = decimal_splits[1]
			if len(cents) == 1: 
				cents = cents + "0"
			
		return "$" + dollars + "." + cents
	

