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
	TransactionTable = "TRANSACTION_TABLE"

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
	TransactionTable = TEST_PREFIX + ProdTables.TransactionTable
	SqlTestTable = "TEST_SQL"