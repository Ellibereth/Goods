import time
import unittest
from selenium import webdriver

 
TEST_SERVER_URL = "https://edgarusa-testserver.herokuapp.com"
LOCAL_URL = "http://0.0.0.0:5000"



class WebTests(unittest.TestCase):

	@classmethod
	def setUpClass(cls):
		cls.driver = webdriver.Chrome("/Users/Darek/Desktop/Goods/tests/web_tests/chromedriver")


		# cls.driver = webdriver.Firefox("/Users/Darek/Desktop/Goods/tests/web_tests/geckodriver")

	@unittest.skip("This is an example")
	def test_title(self):
		self.driver.get(LOCAL_URL)
		self.assertEqual(
			self.driver.title,
			'Edgar USA'
		)

	# @unittest.skip("for now")
	def test_register(self):
		self.driver.get(LOCAL_URL + "/register")

		name_input = self.driver.find_element_by_css_selector(
		   'input[id="user_name"]')
		name_input.send_keys('Test User')
		email_input = self.driver.find_element_by_css_selector(
		   '#user_email')
		email_input.send_keys('edgartest@gmail.com')
		password_input = self.driver.find_element_by_css_selector(
		   '#user_password')
		password_input.send_keys('brobro')
		password_confirm_input = self.driver.find_element_by_css_selector(
		   '#user_password_confirm')
		password_confirm_input.send_keys('brobro')

		search_submit = self.driver.find_element_by_css_selector(
			 'input[value="Sign Up"]')
		search_submit.click()
		
		# time.sleep(1)
		# self.assertEqual(self.driver.find_element_by_css_selector(
		# 	'#register_fading_text_alert').text, 
		# 	'You\'re account was created. Welcome to Edgar USA'
		# )

		# time.sleep(5)
		# self.assertTrue(self.driver.find_element_by_css_selector(
		# 	'.userNameText[value="Test"]'))


		
		self.driver.get(LOCAL_URL + "/settings")
		time.sleep(3)
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
		password_input.send_keys("brobro")
		password_confirm_input = self.driver.find_element_by_css_selector (
				'input[name="password_confirm"]'
			)
		password_confirm_input.send_keys("brobro")
		delete_button = self.driver.find_element_by_css_selector(
			'.btn.btn-default.delete-account-button'
		)
		delete_button.click()

		time.sleep(4)
		self.assertTrue(
			self.driver.find_element_by_css_selector('a[id="home-login-text"]')
		)



	# def test_delete_account(self):
		






	@classmethod
	def tearDownClass(cls):
		cls.driver.quit()


if __name__ == '__main__':
	suite = unittest.TestLoader().loadTestsFromTestCase(WebTests)
	unittest.TextTestRunner(verbosity=2).run(suite)