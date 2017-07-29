from email.mime.image import MIMEImage
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from api.utility.labels import CartLabels as Labels
import datetime
import os
from jinja2 import Template
from api.utility.membership_tiers import MembershipTiers

URL = os.environ.get('HEROKU_APP_URL')
# in this use the dev environment
if URL == None:
	URL = 'https://edgarusa-devgeniy.herokuapp.com/'

PHOTO_SRC_BASE = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"


class EmailHtml:

	def generateRecoveryEmail(user):
		msg = MIMEMultipart()
		msg['Subject'] = "Account Recovery"
		msg['From'] = "noreply@edgarusa.com"
		msg['To'] = user.email

		f = open('./api/utility/email_templates/recovery_email.html')
		template = Template(f.read())
		recovery_link = URL + "recovery/" + user.recovery_pin
		html = template.render(user = user, url_base = URL, recovery_link = recovery_link)

		textPart = MIMEText(html, 'html')
		msg.attach(textPart)
		return msg

	def generateConfirmationEmailHtml(email, email_confirmation_id, name):
		f = open('./api/utility/email_templates/confirm_email.html')
		template = Template(f.read())
		confirmation_link = URL + "confirmEmail/" + email_confirmation_id
		html = template.render(email = email, url_base = URL, confirmation_link = confirmation_link)
		return html

	def generateConfirmationChangeEmailHtml(email, email_confirmation_id, name):
		url = URL + "confirmEmail/" + email_confirmation_id
		body = "<h2> Hello " + name.title() + ",</h2>"
		body = body + "<span style = \"display:block;font-size: 14px;\"> Your email has been changed. Please click below to confirm this change. </span>"
		body = body + "<div style = \"padding-top:12px;\"> <button type = \"button\" style = \"background-color:#6090a8;color:white;padding:24px; border:none;border-radius:6px;\"> \
			<a href = \"" + url + "\" style = \"font-size: 18px;text-decoration:none;color:white;\">Confirm Email</a> </button> </div>"

		return body


	# returns MIMText to attach to a message
	def generateCartEmailNotificationHtml(user, cart, address, order_id):
		
		

		address_display = ""
		if address.address_line1 and address.address_line1 != "":
			address_display = address_display + "<span style = \"display:block;font-size: 18px;\"> " + address.name + " </span> \
			<span style = \"display:block;font-size: 18px;\"> " + address.address_line1 + " </span> "
		if address.address_line2 and address.address_line2 != "":
			address_display = address_display + "<span style = \"display:block;font-size: 18px;\"> " + address.address_line2 + " </span>"
		if address.address_city and address.address_zip and address.address_state:
			address_display = address_display + "<span style = \"display:block;font-size: 18px;\"> " + address.address_city + ", " + address.address_state \
		+ " " + str(address.address_zip) + " </span>"

		todays_date = datetime.date.today().strftime('%A %B %d, %Y')

		items_price = EmailHtml.formatPrice(cart.getCartItemsPrice())
		shipping_price = EmailHtml.formatPrice(cart.getCartShippingPrice(address))

		total_price = EmailHtml.formatPrice(cart.getCartTotalPrice(address))
		sales_tax_price = EmailHtml.formatPrice(cart.getCartSalesTaxPrice(address))

		tax_disp = ""
		if cart.getCartSalesTaxPrice(address) != 0:
			tax_disp = tax_disp + "<span style = \"display:block\">"
			tax_disp = tax_disp + "<span style= \"font-size: 18px;color:#002868;\"> Sales Tax </span>"
			tax_disp = tax_disp + "<span style= \"font-size: 18px;color:#002868; float:right; margin-right: 12px\">" + sales_tax_price + "</span>"
			tax_disp = tax_disp + "</span>"
			tax_disp = tax_disp + "<br/>"

		support_link = URL + "support"
		orders_link = URL + "myOrders"


		cart_items = cart.toPublicDict()['items']
		for item in cart_items:
			item['html_display_price'] = EmailHtml.formatCurrentPrice(item)
		f = open('./api/utility/email_templates/checkout_confirm.html')
		template = Template(f.read())
		html = template.render(user = user, cart_items = cart_items, address = address, 
			order_id = order_id, address_display = address_display, 
			todays_date = todays_date, items_price = items_price, shipping_price = shipping_price, 
			sales_tax_price = sales_tax_price, total_price = total_price,
			support_link = support_link, orders_link = orders_link, tax_disp = tax_disp)

		return html


	def generateVendorItemRow(product, order_id, user):
		html = (
			"<div> \
			<img style = \"height:100px;width:100px; padding: 6px;\" src=\"" + str(PHOTO_SRC_BASE)
			+ str(product[Labels.MainImage]) + "\"/>  </span> </td>\
			<span style = \"border-top:solid; border-width: 1px; border-color:lightgrey\"> <span style = \"display:block;padding:12px;\">  \
			<span style = \"font-size: 18px\"> " + str(product[Labels.Name]) + " </span> <br/> \
			<span style = \"font-size: 18px\"> Price: " + str(EmailHtml.formatCurrentPrice(product, user)) + "</span> <br/> \
			<span style = \"font-size: 18px\"> Quantity: " + str(product[Labels.NumItems]) + "</span> <br/> \
			<span style = \"font-size: 18px\"> Edgar USA Fee: " + str(EmailHtml.formatVendorFee(product, user)) + "</span> <br/> \
			<span style = \"font-size: 18px\"> Vendor Charge: " + str(EmailHtml.formatVendorCut(product, user)) + "</span> <br/> \
			</span> </div> <br/> <hr/>"
		)

		return html


	def generateVendorOrderNotification(user, items, address, order_id):
		html = "<h1> Order Notification </h1>"
		html = html + "<h1> Order ID " + order_id + "</h1>"
		html = html + EmailHtml.formatAddress(address)
		html = html + "<br/> <hr/>"
		for item in items:
			html = html + EmailHtml.generateVendorItemRow(item, order_id, user)
		return html




	def generateCheckoutErrorHtml(user, cart, address, error_type, error_string):
		stack_trace = error_string.split("\n")
		right_now_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
		html = "<h2> Checkout error for " + user.name.title() + " with email " + str(user.email) + "</h2>"
		html = html + "<span style = \"display:block;font-size: 14px;\"> Error Type: " + str(error_type) + " </span>"
		html = html + "<span style = \"display:block;font-size: 14px;\"> Date : " + right_now_date + "  </span>"
		html = html + "<span style = \"display:block;font-size: 14px;\"> Error Message: "
		for line in stack_trace:
			html = html + line + "<br/>"
		html = html +  "</span>"
		html = html + "<br/> <h1> User tried to buy </h1> <br/> <hr/>"

		order_id = "SAMPLE_ORDERID"
		html = html + EmailHtml.generateCartEmailNotificationHtml(user, cart, address, order_id)
		return html


	def formatAddress(address):
		body = "<div style = \"width:50%;\">"
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
		body = body + "</div>"
		return body

	# input price must be integers in cents
	def formatPrice(price):
		price_string = str(price)
		if len(price_string) > 2:
			return "$" + price_string[:-2] + "." + price_string[-2:]
		elif len(price_string) == 2:
			return "$0." + price_string
		elif len(price_string) == 1:
			return "$0.0" + price_string
		else:
			return None
			
	def getCurrentPrice(product, user = None):
		if user == None:
			return product.get(Labels.Price)
		else:
			if user.membership_tier == MembershipTiers.TEN_PERCENT_OFF:
				return int(product.get(Labels.Price) * 90 / 100)
			else:
				return product.get(Labels.Price)


	def formatCurrentPrice(product, user = None):
		return EmailHtml.formatPrice(EmailHtml.getCurrentPrice(product, user))


	def formatVendorFee(item, user = None):
		vendor_fee = EmailHtml.calculateVendorFee(item, user)
		return EmailHtml.formatPrice(vendor_fee)
		
	def calculateVendorFee(item, user = None):
		marginal_fee = EmailHtml.getCurrentPrice(item, user) * item[Labels.ManufacturerFee] / 10000
		return int(marginal_fee * item[Labels.NumItems])


	def formatVendorCut(item, user = None):
		vendor_cut = item[Labels.NumItems] * EmailHtml.getCurrentPrice(item, user) - EmailHtml.calculateVendorFee(item, user)
		return EmailHtml.formatPrice(vendor_cut)

	

