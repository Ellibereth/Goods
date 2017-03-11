import unittest

sys.path.append("../")
from web.product_data_manager import ProductDataManager

class TestAmazon(unittest.TestCase):
    def testGetUrl(self):
    	processor = AmazonProcessor(20)
		test_result = processor.test()
		self.assertTrue(test_result)
		
	def testTruth(self):
		self.assertTrue(True)

if __name__ == '__main__':
    unittest.main()
