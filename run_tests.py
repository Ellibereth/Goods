import unittest
from tests.test_sql_manager import TestSqlManager
from tests.test_account_manager import TestAccountManager
from tests.test_order_manager import TestOrderManager
from tests.test_market_product_manager import TestMarketProductManager
import sys
sys.stdout = open('./tests/logs/out_log.log', 'w')
sys.stderr = open('./tests/logs/err_log.log', 'w')


if __name__ == '__main__':
	# suite = unittest.TestLoader().loadTestsFromTestCase(TestSqlManager)
	# unittest.TextTestRunner(verbosity=2).run(suite)

	# suite = unittest.TestLoader().loadTestsFromTestCase(TestAccountManager)
	# unittest.TextTestRunner(verbosity=2).run(suite)

	# suite = unittest.TestLoader().loadTestsFromTestCase(TestOrderManager)
	# unittest.TextTestRunner(verbosity=2).run(suite)

	suite = unittest.TestLoader().loadTestsFromTestCase(TestMarketProductManager)
	unittest.TextTestRunner(verbosity=2).run(suite)