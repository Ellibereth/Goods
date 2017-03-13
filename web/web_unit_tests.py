import unittest
from product_data_manager import ProductDataManager


class TestWeb(unittest.TestCase):
	def testGetAsinFromUrl_ReturnsCorrectAsin(self):
		processor = AmazonProcessor(1)
		asin = processor.getAsinFromUrl("amazon.com/dp/3214124")
		self.assertEqual('3214124', asin)
		
	def testId_generator_ReturnsValidId(self):
		processor = AmazonProcessor(1)
		this_id = processor.id_generator()
		self.assertGreater(len(this_id), 0)
		for c in id:
			self.verifyIsValidChar(c)

		
if __name__ == '__main__':
	suite = unittest.TestLoader().loadTestsFromTestCase(TestAmazon)
	unittest.TextTestRunner(verbosity=2).run(suite)

