from email.mime.image import MIMEImage
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from api.utility.labels import CartLabels as Labels
import datetime

URL = "https://edgarusa-testserver.herokuapp.com/"

PHOTO_SRC_BASE = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"

class EmailHtml:

	def generateRecoveryEmail(user):
		msg = MIMEMultipart()
		msg['Subject'] = "Account Recovery"
		msg['From'] = "noreply@edgarusa.com"
		msg['To'] = user.email
		url = URL + "recovery/" + user.recovery_pin
		body = "<h2> Hello " + user.name.title() + ",</h2>"
		body = body + "<span style = \"display:block;font-size: 14px;\">  Click below to recover your account </span>"
		body = body + "<span style = \"display:block;font-size: 14px;\">  This link will expire in 15 minutes </span>"
		body = body + "<div style = \"padding-top:12px;\"> <button type = \"button\" style = \"background-color:skyblue;color:white;padding:16px; border:none;border-radius:6px;\"> \
			<a href = \"" + url + "\" style = \"font-size: 18px;text-decoration:none;color:white;\">  Recover Account </a> </button> </div>"

		textPart = MIMEText(body, 'html')
		msg.attach(textPart)
		return msg

	def generateConfirmationEmailHtml(email, email_confirmation_id, name):
		url = URL + "confirmEmail/" + email_confirmation_id
		body = "<h2> Hello " + name.title() + ",</h2>"
		body = body + "<span style = \"display:block;font-size: 14px;\"> Thank you for signing up! Click below to confirm your account </span>"
		body = body + "<div style = \"padding-top:12px;\"> <button type = \"button\" style = \"background-color:skyblue;color:white;padding:24px; border:none;border-radius:6px;\"> \
			<a href = \"" + url + "\" style = \"font-size: 18px;text-decoration:none;color:white;\">  Confirm Email </a> </button> </div>"

		return body


	# returns MIMText to attach to a message
	def generateCartEmailNotificationHtml(user, cart, address, order_id):
		
		body = "<div style = \"width:70%\">"
		body = body + "<div style = \"text-align:center\">"
		body = body + "<span style = \"display:block;font-size: 24px;color:#002868;\"> Hi " + user.name + ", </span>"
		body = body + "<div style = \"border-top:solid; border-width: 1px; border-color:lightgrey; padding-bottom: 12px\"> </div>"
		url_link = URL + "myOrders"
		


		body =  body + "<span style = \"display:block;font-size: 18px;\"> Your order has been confirmed. Thank you for shopping at Edgar USA. </span>"


		body = body + "<div style = \"padding-top:12px\"> </div>"
		body = body + "<span style = \"text-align:center\"> <button style = \"border-radius:8px; padding: 18px; border-style: none; background-color:skyblue\" type = \"button\"> \
		<a href= \"" + url_link + "\" style = \"text-decoration:none; color:white; font-size: 18px;\"> View Order </a> </button> </span>"
		body = body + "<div style= \"padding-top:12px\"> </div>"

		body = body + "</div>"
		body = body + "<div style = \"border-radius:8px;border-color:lightgrey;border-style: solid;border-width:2px;border-radius:4px;padding:14px;width:100%\">"
		body = body + "<div style = \"display:inline;\">"
		body = body + "<span style = \"font-size:18px; float:left\"> Order </span>"
		body = body + "<span style = \"font-size:18px; float:right\"> " + order_id + " </span>"
		body = body + "</div> <br/>"

		body = body + "<div style = \"padding-top: 18px;\"> </div>"
		body = body + "<div style = \"border-top:solid; border-width: 1px; border-color:lightgrey\"> </div>"
		body = body + "<div style = \"padding-top: 18px;\"> </div>"

		body = body + "<span style = \"font-size:18px;\"> <b> Shipping Address </b> </span>"
		body = body + "<div style = \"padding-top:12px;\"> </div>"
		if address.address_line1 and address.address_line1 != "":
			body = body + "<span style = \"display:block;font-size: 18px;\"> " + address.name + " </span> \
		<span style = \"display:block;font-size: 18px;\"> " + address.address_line1 + " </span> "
		if address.address_line2 and address.address_line2 != "":
			body = body + "<span style = \"display:block;font-size: 18px;\"> " + address.address_line2 + " </span>"
		if address.address_city and address.address_zip and address.address_state:
			body = body + "<span style = \"display:block;font-size: 18px;\"> " + address.address_city + ", " + address.address_state \
		+ " " + str(address.address_zip) + " </span>"
		body = body + "<div style = \"padding-top: 18px;\"> </div>"
		body = body + " <table cellspacing = \"0\" cellpadding = \"0\" \
		 style = \"width: 100%\"> "
		
		for product in cart.toPublicDict()['items']:
			body = body + EmailHtml.generateCartItemRow(product, order_id)

		body = body + "</table>"

		body = body + "<div style = \"border-top:solid; border-width: 1px; border-color:lightgrey\"> </div>"
		body = body + "<div style = \"padding-top: 18px;\"> </div>"
		body = body + "<span style = \"display:block\">"
		body = body + "<span style= \"font-size: 18px;color:#002868;\"> Items </span>"
		body = body + "<span style= \"font-size: 18px;color:#002868; float:right;margin-right: 12px\">" + EmailHtml.formatPrice(cart.items_price) + "</span>"
		body = body + "</span>"
		body = body + "<br/>"
		body = body + "<span style = \"display:block\">"
		body = body + "<span style= \"font-size: 18px;color:#002868;\"> Shipping </span>"
		body = body + "<span style= \"font-size: 18px;color:#002868; float:right;margin-right: 12px\">" + EmailHtml.formatPrice(cart.shipping_price) + "</span>"
		body = body + "</span>"
		body = body + "<br/>"
		body = body + "<span style = \"display:block\">"
		body = body + "<span style= \"font-size: 18px;color:#002868;\"> Total </span>"
		body = body + "<span style= \"font-size: 18px;color:#002868; float:right; margin-right: 12px\">" + EmailHtml.formatPrice(cart.total_price) + "</span>"
		body = body + "</span>"
		body = body + "</div>"
		body = body + "<div style = \"padding-top:12px\"></div>"
		support_url = URL + "support"
		body = body + "<div style = \"text-align:center\"> <button type = \"button\" style = \"background-color:skyblue;color:white;padding:24px; border:none;border-radius:6px;\">  \
		<a style = \"font-size: 18px;text-decoration:none;color:white;\" href = \"" + support_url + "\"> Contact Support </a> </button> </div>"
		body = body + "</div>"
		return body


	def generateCartItemRow(product, order_id):
		url_link = URL + "myOrders"
		html = (
			"<tr> <td align = \"left\" style =  \"border-top:solid; border-width: 1px; border-color:lightgrey\"> \
			<img style = \"height:100px;width:100px; padding: 6px;\" src=\"" + PHOTO_SRC_BASE 
			+ product[Labels.MainImage] + "\"/>  </span> </td>\
			<td align = \"right\" style = \"border-top:solid; border-width: 1px; border-color:lightgrey\"> <span style = \"display:block;padding:12px;\">  \
			<span style = \"font-size: 18px\"> " + str(product[Labels.Name]) + " </span> <br/> \
			<span style = \"font-size: 18px\"> Price: " + EmailHtml.formatPrice(product[Labels.Price]) + "</span> <br/> \
			<span style = \"font-size: 18px\"> Quantity: " + str(product[Labels.NumItems]) + "</span> <br/> \
			</span> </td>  </tr> "
		)

		return html

	def generateCheckoutErrorHtml(user, cart, address, error_type, python_error):
		right_now_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
		html = "<h2> Checkout error for " + user.name.title() + " with email " + str(user.email) + "</h2>"
		html = html + "<span style = \"display:block;font-size: 14px;\"> Error Type: " + str(error_type) + " </span>"
		html = html + "<span style = \"display:block;font-size: 14px;\"> Error Message: " + str(python_error) + " </span>"
		html = html + "<span style = \"display:block;font-size: 14px;\"> Date : " + right_now_date + "  </span>"
		html = html + "<br/> <h1> User tried to buy </h1> <br/> <hr/>"

		order_id = "SAMPLE_ORDERID"
		html = html + EmailHtml.generateCartEmailNotificationHtml(user, cart, address, order_id)
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
	

