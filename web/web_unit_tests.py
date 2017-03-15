import unittest
import string
import random
from product_data_manager import ProductDataManager
from account_manager import AccountManager

def id_generator(size=5, chars=string.ascii_uppercase + string.digits):
		return ''.join(random.choice(chars) for _ in range(size))

# checks if the two lists of dictionaries have each element equal on a set of keys
def areQueriesEqual(this_query, that_query, keys = None):
	# if both are empty return false
	if len(this_query) == 0 and len(that_query) == 0:
		return True
	# if one is empty, but not the other return false
	elif len(this_query) == 0 or len(that_query) == 0:
		return False

	if keys == None:
		this_keys = this_query[0].keys()
		that_keys = that_query[0].keys()
		if set(this_keys) != set(that_keys):
			return False
		else:
			keys = this_keys

	this_len = len(this_query)
	that_len = len(that_query)
	if this_len != that_len:
		return False
	for i in range(0, this_len):
		for key in keys:
			if this_query[i][key] != that_query[i][key]:
				return False
	return True


class TestWeb(unittest.TestCase):

	## inserts some random requests into the datbase, checks the get by submissionId method if it works
	## then deletes and after deletion verifies the initial query is same as at the end
	## test, insert, get, delete, and getAll
	def testAddProductRequest_ReturnsSameList(self):
		print("\n")
		request = {}
		keys = ['name', 'email', 'product_description', 'phone_number', 'price_range']
		request_list = list()
		num_entires = 3
		for i in range(0, num_entires):
			request = {}
			for key in keys:
				if key == 'email':
					request[key] = 'darek@manaweb.com'
				else:
					request[key] = id_generator()
			request_list.append(request)

		product_manager = ProductDataManager()
		initial_list = product_manager.getProductRequests()
		for request in request_list:
			output = product_manager.addProductRequest(request)
			submission_id = output['submission_id']
			output_request = product_manager.getProductRequestBySubmissionId(submission_id)
			print(" --------------------------------------------------------- ")
			for key in keys:
				self.assertEquals(request[key], output_request[key])
			product_manager.deleteProductRequestBySubmissionId(submission_id)
		end_list = product_manager.getProductRequests()
		product_manager.closeConnection()
		
		# checks if both queries are the same length
		self.assertTrue(areQueriesEqual(initial_list, end_list))

		
if __name__ == '__main__':
	suite = unittest.TestLoader().loadTestsFromTestCase(TestWeb)
	unittest.TextTestRunner(verbosity=2).run(suite)

