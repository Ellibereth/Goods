import unittest
from tests.test_sql_manager import TestSqlManager

if __name__ == '__main__':
	suite = unittest.TestLoader().loadTestsFromTestCase(TestSqlManager)
	unittest.TextTestRunner(verbosity=2).run(suite)