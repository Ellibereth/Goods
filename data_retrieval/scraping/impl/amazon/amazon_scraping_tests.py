import unittest
from amazon_processor import AmazonProcessor


class TestAmazon(unittest.TestCase):
	def testGetUrl(self):
		processor = AmazonProcessor(20)
		test_result = processor.test()
		self.assertTrue(test_result)
		
	def testTruth(self):
		self.assertTrue(True)
		
if __name__ == '__main__':
	suite = unittest.TestLoader().loadTestsFromTestCase(TestAmazon)
	unittest.TextTestRunner(verbosity=2).run(suite)
