import csv
from scraping.impl.amazon.amazon_writer import AmazonWriter
from scraping.impl.amazon.amazon_processor import AmazonProcessor


class AmazonUpdater():
	# default constructor
	def __init__(self):
		self.name = "Amazon Updater"


	# gets the us companies froma csv
	def getUsaCompaniesFromCsv(self):
		usa_company_list = list()
		with open ("./scraping_tools/usa_companies.csv", encoding = "utf-8", errors='ignore') as f:
			csv_reader = csv.reader(f)
			for row in csv_reader:
				this_dict = {}
				this_dict['name'] = row[0]
				this_dict['node_id'] = row[1]
				if this_dict['node_id'] != "":
					usa_company_list.append(this_dict)
		return usa_company_list

	def getUsaCompanyBrandNodeIdList(self):
		usa_companies = self.getUsaCompaniesFromCsv()
		usa_brand_node_list = list()
		for row in usa_companies:
			usa_brand_node_list.append(row['node_id'])
		return usa_brand_node_list

	def getUrlsFromKeyWord(self, keyword):
		url = "https://www.amazon.com/s/keywords=" + keyword
		return url

	def getUrlFromBrandNodeId(self, brand_node_id):
		url = "https://www.amazon.com/b/?node=" + brand_node_id + "&page="
		return url

	def updateAmazonTableForUsaCompanies(self):
		usa_brand_node_list = self.getUsaCompanyBrandNodeIdList()
		writer = AmazonWriter()
		target_column = "brand_node_id"
		column_name = "final_origin"
		data = "USA"
		for brand_node_id in usa_brand_node_list:
			target_property = brand_node_id
			writer.updateEntriesWithProperty(target_column, target_property, column_name, data)
		writer.closeConnection()

	def updateAmazonProductByAsin(self, asin):
		url = "https://www.amazon.com/dp/" + asin
		writer = AmazonWriter()
		processor = AmazonProcessor()
		product = processor.getProductDetailsFromUrl(url, writer)
		print(product)
		writer.updateRowByKey('asin', asin, product)
		writer.closeConnection()

