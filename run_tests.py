import unittest
import sys
from web.models.test_models import TestModels


if __name__ == '__main__':

	suite = unittest.TestLoader().loadTestsFromTestCase(TestModels)
	unittest.TextTestRunner(verbosity=2).run(suite)
	
