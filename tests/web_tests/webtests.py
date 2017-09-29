import time
import unittest
from selenium import webdriver
from ddt import ddt, data
import itertools
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys

 
TEST_SERVER_URL = "https://edgarusa-testserver.herokuapp.com"
LOCAL_URL = "http://0.0.0.0:5000"

FIRST_NAME = "TEST"

LAST_NAME = "USER"
FULL_NAME = FIRST_NAME + " " + LAST_NAME
PASSWORD = "brobro"
# I really hope no one has this email....
EMAIL = "edgartest@gmail.com"
PAGE_TITLE = "Edgar USA"
BAD_PASSWORD = "bro"


FULL_INVENTORY_PRODUCT = 1
SOLD_OUT_PRODUCT = 3
VARIANT_PRODUCT = 21
NO_MATCH_SEARCH_STRING = "qwertyuiopasdfghjklzcxvbnm"
EMPTY_SEARCH_STRING = ""
MATCH_SEARCH_STRING = "product"


@ddt
class WebTests(unittest.TestCase):
	@classmethod
	def setUpClass(cls):
		cls.driver = webdriver.Chrome("/Users/Darek/Desktop/Goods/tests/web_tests/chromedriver")
		cls.driver.implicitly_wait(10)

	@classmethod
	def tearDownClass(cls):
		cls.driver.quit()

	@unittest.skip("This is an example")
	def test_title(self):
		self.driver.get(LOCAL_URL)
		self.assertEqual(
			self.driver.title,
			PAGE_TITLE
		)

	def register_user(self):
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

	# a user should be logged in first 
	def delete_user(self):
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

	# we test these register and delete first
	@unittest.skip("reason")
	def test_0_register_user(self):
		self.register_user()
		self.assertTrue(self.driver.find_element_by_css_selector(
				'.register-success'
			).text == 'You\'re account was created. Welcome to Edgar USA')

		self.assertTrue(self.driver.find_element_by_css_selector(
		'.userNameText').text == FIRST_NAME)

	# we test these register and delete first
	@unittest.skip("reason")
	def test_1_delete_user(self):
		self.delete_user()
		self.assertTrue(
			self.driver.find_element_by_css_selector('a[id="home-login-text"]')
		)


	@data(1,2,3)
	@unittest.skip("done")
	def test_add_to_cart_no_variant(self, qty):
		"""
		: We start by doing this for guest user's
		: We test the addition of 3 products with inventories
		: 1. Product.Inventory > 5, add 1 item. Result -> Cart Page
		: Probably going to refactor these 3 into different test cases
		"""
		self.driver.get(LOCAL_URL)
		product_link = self.driver.find_element_by_css_selector(
			'img[alt="' + str(FULL_INVENTORY_PRODUCT) + '"]'
		)
		product_link.click()
		qty_dropdown = self.driver.find_element_by_css_selector(
			'select[name="quantity_dropdown"]'
		)
		qty_dropdown.click()
		this_option = self.driver.find_element_by_css_selector(
			'option[value="' + str(qty) + '"]'
		)
		this_option.click()
		add_to_cart = self.driver.find_element_by_css_selector (
			'div[class="add-to-bag-btn-ct"]'
		)
		add_to_cart.click()
		time.sleep(2)
		cart_icon = self.driver.find_element_by_css_selector(
			'#cart_badge_number'
		)
		self.assertEqual(int(cart_icon.text), qty)
		delete_button = self.driver.find_element_by_css_selector (
			'.cart-remove-item-icon'
		)
		delete_button.click()
		time.sleep(2)
		empty_cart_display = self.driver.find_element_by_css_selector(
			'#empty_cart_display'
		)
		self.assertTrue(empty_cart_display)
		
	@data(0,1)
	@unittest.skip("done")
	def test_add_to_cart_variant(self, index):
		"""
		: this method tests adding to cart
		"""
		self.driver.get(LOCAL_URL)
		product_link = self.driver.find_element_by_css_selector(
			'img[alt="' + str(VARIANT_PRODUCT) + '"]'
		)
		product_link.click()
		variant_dropdown = self.driver.find_element_by_css_selector(
			'select[name="variant_dropdown"]'
		)
		variant_dropdown.click()

		this_option = self.driver.find_element_by_css_selector(
			'option[name="' + str(index) + '"]'
		)
		this_option.click()
		add_to_cart = self.driver.find_element_by_css_selector (
			'div[class="add-to-bag-btn-ct"]'
		)
		add_to_cart.click()
		time.sleep(2)
		cart_icon = self.driver.find_element_by_css_selector(
			'#cart_badge_number'
		)
		self.assertEqual(int(cart_icon.text), 1)
		delete_button = self.driver.find_element_by_css_selector (
			'.cart-remove-item-icon'
		)
		delete_button.click()
		time.sleep(2)
		empty_cart_display = self.driver.find_element_by_css_selector(
			'#empty_cart_display'
		)
		self.assertTrue(empty_cart_display)

	@data('/checkout', '/checkoutConfirmed')
	@unittest.skip("passed")
	def test_login_required_areas(self, route):
		"""
		: This method tests if user's must
		: login to access certain parts of the site
		"""
		self.driver.get(LOCAL_URL + route)
		please_confirm_text = self.driver.find_element_by_css_selector(
				'#LoginScreen'
			)
		self.assertTrue(please_confirm_text)

	@data('/checkout', '/checkoutConfirmed')
	@unittest.skip("passed")
	def test_confirmed_required_areas(self, route):
		"""
		: This method tests if non-confirmed user's must
		: confirm to access certain parts of the site
		"""
		self.register_user()
		self.driver.get(LOCAL_URL + route)
		time.sleep(2)
		please_confirm_text = self.driver.find_element_by_css_selector(
				'#please_confirm_text'
			)
		self.assertTrue(please_confirm_text)
		self.delete_user()

	@unittest.skip("passed")
	def test_login_and_logout(self):
		self.register_user()
		time.sleep(2)
		user_name = self.driver.find_element_by_css_selector(
			'.userNameText')

		hov = ActionChains(self.driver).move_to_element(user_name)
		hov.perform()
		time.sleep(0.5)
		logout_button = self.driver.find_element_by_css_selector(
				'a.newEdgarUserDDLink.dIB[href="/logout"]')

		logout_button.click()
		time.sleep(3)
		login_link = self.driver.find_element_by_css_selector('a[id="home-login-text"]')
		self.assertTrue(login_link)
		login_link.click()
		email_input = self.driver.find_element_by_css_selector(
			'input[name="login_email"]',
		)
		email_input.send_keys(EMAIL)
		password_input = self.driver.find_element_by_css_selector(
			'input[name="login_password"]',
		)
		password_input.send_keys(PASSWORD)
		login_buton = self.driver.find_element_by_css_selector(
				"#reqSubmit"
			)
		login_buton.click()
		time.sleep(2)
		self.assertTrue(self.driver.find_element_by_css_selector(
		'.userNameText').text == FIRST_NAME)
		self.delete_user()

	@unittest.skip("passed")
	def test_add_to_cart_sold_out(self):
		"""
		: by the html element being disabled 
		: (click doesn't take you to cart page)
		: makes sure the link has the sold out tag
		: Product Id 3 should not 
		"""
		product_id = 3
		self.driver.get(LOCAL_URL + '/eg/' + str(SOLD_OUT_PRODUCT))
		sold_out_link = self.driver.find_element_by_css_selector(
				'a.soldOut'
			)
		self.assertTrue(sold_out_link)
		sold_out_link.click()
		sold_out_link = self.driver.find_element_by_css_selector(
				'a.soldOut'
			)
		self.assertTrue(sold_out_link)

	@unittest.skip("passed")
	def test_bad_login(self):
		"""
		: #home-login-text is still there
		: after bad login
		"""
		self.driver.get(LOCAL_URL + "/login")
		email_input = self.driver.find_element_by_css_selector(
			'input[name="login_email"]',
		)
		email_input.send_keys(EMAIL)
		password_input = self.driver.find_element_by_css_selector(
			'input[name="login_password"]',
		)
		password_input.send_keys(BAD_PASSWORD)
		login_buton = self.driver.find_element_by_css_selector(
				"#reqSubmit"
			)
		login_buton.click()
		time.sleep(2)
		
		login_alert =  self.driver.find_element_by_css_selector( 
			'#login_fading_text_alert'
		)
		self.assertTrue(login_alert)
		login_link = self.driver.find_element_by_css_selector('a[id="home-login-text"]')
		self.assertTrue(login_link)

	@unittest.skip("passed")
	def test_search(self):
		"""
		: gives bogus string "adfjdsfakdfa" and ensures hits are 0
		: gives a known string, "product" and ensures hits are > 0
		""" 
		self.driver.get(LOCAL_URL)
		search_bar = self.driver.find_element_by_css_selector(
			'#edgar_search_bar'
		)
		search_bar.send_keys(MATCH_SEARCH_STRING)
		search_button = self.driver.find_element_by_css_selector(
			'span[name="search_button"]'
		)
		search_button.click()
		results_header = self.driver.find_element_by_css_selector(
			"#some_results"
		)
		self.assertTrue(results_header)

		search_bar = self.driver.find_element_by_css_selector(
			'#edgar_search_bar'
		)
		search_bar.send_keys(NO_MATCH_SEARCH_STRING)
		search_bar.send_keys(Keys.RETURN)
		results_header = self.driver.find_element_by_css_selector(
			"#no_results"
		)
		self.assertTrue(results_header)

		search_bar = self.driver.find_element_by_css_selector(
			'#edgar_search_bar'
		)
		search_bar.send_keys(EMPTY_SEARCH_STRING)
		search_bar.send_keys(Keys.RETURN)
		results_header = self.driver.find_element_by_css_selector(
			"#no_results"
		)
		self.assertTrue(results_header)
		




if __name__ == '__main__':

	# suite = unittest.TestSuite()
	# suite.addTest(WebTests("test_confirmed_required_areas"))
	# runner = unittest.TextTestRunner(verbosity = 0)
	# runner.run(suite)

	# Use this to run all tests
	suite = unittest.TestLoader().loadTestsFromTestCase(WebTests)
	unittest.TextTestRunner(verbosity=2).run(suite)


