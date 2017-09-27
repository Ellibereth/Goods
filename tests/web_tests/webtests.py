import time
import unittest
from selenium import webdriver

 
TEST_SERVER_URL = "https://edgarusa-testserver.herokuapp.com"
LOCAL_URL = "http://0.0.0.0:5000"

FIRST_NAME = "TEST"

LAST_NAME = "USER"
FULL_NAME = FIRST_NAME + " " + LAST_NAME
PASSWORD = "brobro"
# I really hope no one has this email....
EMAIL = "edgartest@gmail.com"
PAGE_TITLE = "Edgar USA"

class WebTests(unittest.TestCase):

	@classmethod
	def setUpClass(cls):
		cls.driver = webdriver.Chrome("/Users/Darek/Desktop/Goods/tests/web_tests/chromedriver")
		cls.driver.implicitly_wait(10)

		# cls.driver = webdriver.Firefox("/Users/Darek/Desktop/Goods/tests/web_tests/geckodriver")

	@unittest.skip("This is an example")
	def test_title(self):
		self.driver.get(LOCAL_URL)
		self.assertEqual(
			self.driver.title,
			PAGE_TITLE
		)

	# @unittest.skip("for now")
	def test_register_and_delete(self):
		self.driver.get(LOCAL_URL + "/register")

		name_input = self.driver.find_element_by_css_selector(
		   'input[id="user_name"]')
		name_input.send_keys(FULL_NAME)
		email_input = self.driver.find_element_by_css_selector(
		   '#user_email')
		email_input.send_keys(EMAIL)
		password_input = self.driver.find_element_by_css_selector(
		   '#user_password')
		password_input.send_keys(PASSWORD)
		password_confirm_input = self.driver.find_element_by_css_selector(
		   '#user_password_confirm')
		password_confirm_input.send_keys(PASSWORD)

		search_submit = self.driver.find_element_by_css_selector(
			 'input[value="Sign Up"]')
		search_submit.click()

		try:
			
			self.assertTrue(self.driver.find_element_by_css_selector(
					'.register-success'
				).text == 'You\'re account was created. Welcome to Edgar USA')
		except Exception as e:
			print(e)

		self.assertTrue(self.driver.find_element_by_css_selector(
		'.userNameText').text == FIRST_NAME)

		self.driver.get(LOCAL_URL + "/settings")
		time.sleep(5)
		edit_button = self.driver.find_element_by_css_selector (
			'button[id="edit-address-button"')
		edit_button.click()

		delete_tab = self.driver.find_element_by_css_selector(
				'a[id="Delete Account_tab"]'
			)
		delete_tab.click()

		password_input = self.driver.find_element_by_css_selector (
				'input[name="password"]'
			)
		password_input.send_keys(PASSWORD)
		password_confirm_input = self.driver.find_element_by_css_selector (
				'input[name="password_confirm"]'
			)
		password_confirm_input.send_keys(PASSWORD)
		delete_button = self.driver.find_element_by_css_selector(
			'.btn.btn-default.delete-account-button'
		)
		delete_button.click()

		time.sleep(5)
		self.assertTrue(
			self.driver.find_element_by_css_selector('a[id="home-login-text"]')
		)

	@classmethod
	def tearDownClass(cls):
		cls.driver.quit()

if __name__ == '__main__':
	suite = unittest.TestLoader().loadTestsFromTestCase(WebTests)
	unittest.TextTestRunner(verbosity=2).run(suite)