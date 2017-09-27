import unittest
from selenium import webdriver
 
TEST_SERVER_URL = "https://edgarusa-testserver.herokuapp.com/"

class EdgarTest(unittest.TestCase):
 
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Firefox()
 
    def test_title(self):
        self.driver.get('https://www.aweber.com')
        self.assertEqual(
            self.driver.title,
            'AWeber Email Marketing Services & Software Solutions for Small Business')
 
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()