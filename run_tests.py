import unittest
from tests.test_sql_manager import TestSqlManager
from tests.test_account_manager import TestAccountManager
import sys
sys.stdout = open('./tests/logs/out_log.log', 'w')
sys.stderr = open('./tests/logs/err_log.log', 'w')


if __name__ == '__main__':
	# suite = unittest.TestLoader().loadTestsFromTestCase(TestSqlManager)
	# unittest.TextTestRunner(verbosity=2).run(suite)

	suite = unittest.TestLoader().loadTestsFromTestCase(TestAccountManager)
	unittest.TextTestRunner(verbosity=2).run(suite)