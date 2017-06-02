""" 
This will have the table names for production and testing
"""

TEST_PREFIX = "TEST_"

class ProdTables:
	UserInfoTable = "USER_INFO_TABLE"
	AmazonScrapingTable = "AMAZON_SCRAPING_TABLE"
	UserSubmissionTable = "USER_SUBMISSION_TABLE"
	UserRequestTable = "USER_REQUEST_TABLE"
	FeedbackTable = "FEEDBACK_TABLE"
	CustomerServiceTicketTable = "CUSTOMER_SERVICE_TICKET_TABLE"
	CustomerServiceResponseTable = "CUSTOMER_SERVICE_RESPONSE_TABLE"
	MarketProductTable = "MARKET_PRODUCT_TABLE"
	OrderTable = "ORDER_TABLE"
	OrderItemTable = "ORDER_ITEM_TABLE"
	ImageTable = "IMAGE_TABLE"
	ProductTagTable = "PRODUCT_TAG_TABLE"
	ShoppingCartTable = "SHOPPING_CART_TABLE"
	UserAddressTable = "USER_ADDRESS_TABLE"
	StoryImageTable = "STORY_IMAGE_TABLE"
	ProductVariantTable = "PRODUCT_VARIANT_TABLE"
	LoginAttemptTable = "LOGIN_ATTEMPT_TABLE"
	AdminUserTable = "ADMIN_USER_TABLE"
	HomeImageTable = "HOME_IMAGE_TABLE"
	AdminActionTable = "ADMIN_ACTION_TABLE"


""" 
this file has a list of the allowed tags on products 
All the instance variables will be private
"""

class TestTables:
	UserInfoTable = TEST_PREFIX + ProdTables.UserInfoTable
	AmazonScrapingTable = TEST_PREFIX + ProdTables.AmazonScrapingTable
	UserSubmissionTable = TEST_PREFIX + ProdTables.UserSubmissionTable
	UserRequestTable = TEST_PREFIX + ProdTables.UserRequestTable
	FeedbackTable = TEST_PREFIX + ProdTables.FeedbackTable
	CustomerServiceTicketTable = TEST_PREFIX + ProdTables.CustomerServiceTicketTable
	CustomerServiceResponseTable = TEST_PREFIX + ProdTables.CustomerServiceResponseTable
	MarketProductTable = TEST_PREFIX + ProdTables.MarketProductTable
	OrderTable = TEST_PREFIX + ProdTables.OrderTable
	ImageTable = TEST_PREFIX + ProdTables.ImageTable
	ProductTagTable = TEST_PREFIX + ProdTables.ProductTagTable
	ShoppingCartTable = TEST_PREFIX + ProdTables.ShoppingCartTable
	UserAddressTable = TEST_PREFIX + ProdTables.UserAddressTable
	StoryImageTable = TEST_PREFIX + ProdTables.StoryImageTable
	ProductVariantTable = TEST_PREFIX + ProdTables.ProductVariantTable
	OrderItemTable = TEST_PREFIX + ProdTables.OrderItemTable
	LoginAttemptTable = TEST_PREFIX + ProdTables.LoginAttemptTable
	AdminUserTable = TEST_PREFIX + ProdTables.AdminUserTable
	HomeImageTable = TEST_PREFIX + ProdTables.HomeImageTable
	AdminActionTable = TEST_PREFIX + ProdTables.AdminActionTable
	SqlTestTable = "TEST_SQL"

	