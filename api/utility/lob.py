import lob
lob.api_key = 'test_0dc8d51e0acffcb1880e0f19c79b2f5b0cc'
AccountId = "account_id"

class Lob:
	@staticmethod
	def addUserAddress(user, description = "", name = "", address_line1 = "", address_line2 = "", address_city = ""
		,address_state = "", address_zip = "", address_country = "US"):
		# we don't do international right now
		if address_country != "US":
			raise Exception("Address must be in US!")
		# try: 
		address = lob.Address.create(
		  description= description,
		  name= name,
		  company='Lob',
		  email= user.email,
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
		# except Exception as e:
		# 	return e


	@staticmethod
	def verifyAddress(name = "", address_line1 = "", address_line2 = "", address_city = ""
		,address_state = "", address_zip = "", address_country = "US"):
		# we don't do international right now
		if address_country != "US":
			raise Exception("Address must be in US!")
		# try: 
		output = lob.Verification.create(
			name = name,
			address_line1= address_line1,
			address_line2 = address_line2,
			address_city= address_city,
			address_state= address_state,
			address_zip= address_zip,
			address_country = address_country
		)
		return output

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
