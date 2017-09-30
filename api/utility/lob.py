import os
import lob
from uszipcode import ZipcodeSearchEngine

LOB_LIVE_KEY = "live_823f35f6e24d9a3386eaf6b0c9e33ddf691"

LOB_TEST_KEY = 'test_db7ce8c5d0f8780b82f9c8e7330b9788193'
lob.api_version = '2017-09-08'

lob.api_key = LOB_TEST_KEY

# We'll start with the free LOB right now
# if os.environ.get("ENVIRONMENT") == "PRODUCTION":
# 	lob.api_key = LOB_LIVE_KEY
# else:
# 	lob.api_key = LOB_TEST_KEY


AccountId = "account_id"
DELIVERABILITY = "deliverability"
ERROR_DELIVERABLE =  ['deliverable_missing_secondary', 'undeliverable', 'no_match']
State = "State"

class Lob:
	@staticmethod
	def addUserAddress(user, description = "", name = "", address_line1 = "", address_line2 = "", address_city = ""
		,address_state = "", address_zip = "", address_country = "US"):
		# we don't do international right now
		if address_country != "US":
			raise Exception("Address must be in US")

		search = ZipcodeSearchEngine()
		zipcode = search.by_zipcode(address_zip)
		if zipcode[State] != address_state:
			raise Exception("ZIP Code and State do not match")


		try:

			verification = Lob.verifyAddress(name, address_line1, address_line2, address_city,
				address_state, address_zip, address_country)

			if verification[DELIVERABILITY] in ERROR_DELIVERABLE:
				raise Exception("Error, we cannot deliver to this address. \
				Please check your information and try again.")

			address = lob.Address.create(
				description= description,
				name= name,
				company='Lob',
				address_line1= address_line1,
				address_line2= address_line2,
				address_city= address_city,
				address_state = address_state,
				address_zip = address_zip,
				address_country= address_country,
				metadata = {
					AccountId : user.account_id
				}
			)
			return address
		except Exception as e:
			raise Exception("Error adding address : " + str(e))


	@staticmethod
	def verifyAddress(name = "", address_line1 = "", address_line2 = "", address_city = ""
		,address_state = "", address_zip = "", address_country = "US"):
		if address_country != "US":
			raise Exception("Address must be in US!")

		verification = lob.USVerification.create(
			primary_line = address_line1,
			secondary_line = address_line2,
			city= address_city,
			state= address_country,
			zip_code= address_zip
		)

		return verification

		# except Exception as e:
		# 	return e


	# returns an interable with addresss information
	@staticmethod
	def getUserAddresses(user):
		metadata = {AccountId : user.account_id}
		return lob.Address.list(metadata = metadata).data

	@staticmethod
	def deleteAddress(address_id):
		lob.Address.delete(address_id)

	@staticmethod 
	def getAddressById(address_id):
		address = lob.Address.retrieve(address_id)
		return address
