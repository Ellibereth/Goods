from bs4 import BeautifulSoup
import requests
import zipcode
import csv
import time
from selenium import webdriver
import os
import urllib
import bottlenose
from selenium.webdriver import DesiredCapabilities
import random
import xlrd
import sys



class AmazonHtmlParser:
	def LoadUserAgents(self, uafile):
	    """
	    uafile : string
	        path to text file of user agents, one per line
	    """
	    uas = []
	    with open(uafile, 'r') as uaf:
	        for ua in uaf.readlines():
	            if ua:
	                uas.append(ua.strip()[1:-1-1])
	    random.shuffle(uas)
	    return uas

			
	def getRandomProxy(self,proxy_file):
		with open(proxy_file, 'r') as f:
			reader = csv.reader(f)
			proxy_list = list()
			for row in reader:
				proxy_list.append(row[0])
			random.shuffle(proxy_list)
			return proxy_list[0]


	def getHtml(self, url):
		desired_capabilities = DesiredCapabilities.PHANTOMJS.copy()
		# load the user agents, in random order
		user_agent = self.LoadUserAgents(uafile="user_agents.txt")
		random_user_agent = random.choice(user_agent)
		desired_capabilities['phantomjs.page.customHeaders.User-Agent'] = random_user_agent
		random_proxy = self.getRandomProxy(proxy_file = "proxies.csv")
		full_random_proxy = '--proxy=' + random_proxy
		print(full_random_proxy)
		service_args = [full_random_proxy,'--proxy-type=http']
		# driver = webdriver.PhantomJS(service_args=service_args, desired_capabilities=desired_capabilities)
		driver = webdriver.PhantomJS(desired_capabilities=desired_capabilities)	
		# try:
		time_start = time.time()
		print("getting html")
		print(url)
		driver.get(url)
		print("url getting done")
		html = driver.page_source
		driver.quit()
		time_1 = time.time()
		total_time = time_1 - time_start
		print("done getting html in : " + str(total_time) + " seconds")
		# except:
		# 	print("bad proxy at : " + random_proxy)
		# 	with open("bad_proxies.csv", "a") as f:
		# 		writer = csv.writer(f)
		# 		writer.writerow([random_proxy])
		# 	return self.getHtml(url)

		# driver = webdriver.PhantomJS(desired_capabilities=desired_capabilities)	
		
		time_1 = time.time()
		print(str(time_1 - time_0))
		return html
		

	def checkAmazonPage(self, html):
		soup = BeautifulSoup(html,"html.parser")
		# nnarrow down to prod details
		product_details = soup.find("div", {'id': 'prodDetails'})
		details_table = product_details.find("table", {"id" : 'productDetails_detailBullets_sections1'})
		row_list = details_table.find_all("tr", {})
		row_country = "BLANK"
		for row in row_list:
			row_header = row.find("th", {})	
			header_text = row_header.text.replace(" ", "@").lower()
			if header_text.find("origin") != -1:
				row_country = row.find("td", {}).text.replace(" ", "").replace("\n", "")


	def recursiveGetAsinListFromUrl(self, url, page_number, num_errors = None):
		if (num_errors != None):
			if num_errors > 100:
				print(str("broke at time : " + time.time() - time_0))

		html = self.getHtml(url)
		soup = BeautifulSoup(html, "html.parser")
		directory = "data/test_html"
		if os.path.exists(directory):
			next_page_number = len(os.listdir(directory)) + 1
			with open("data/test_html/" + str(next_page_number) + ".html", "w") as f:
				f.write(html)

		product_list = soup.find("ul", {'id' : 's-results-list-atf'})
		if (product_list == None):
			print("bad url : " + url)	
			print(product_list)
			if num_errors == None:
				num_errors = 0
			num_errors = num_errors + 1
			self.recursiveGetAsinListFromUrl(url, page_number, num_errors)
		asin_list = list()
		if product_list == None:
			return 
		for product in product_list.find_all("li"):
			if product.get("data-asin") != None:
				if len(product['data-asin']) == 10:
					asin_list.append(product['data-asin'])

		# /gp/search/ref=sr_pg_3?rh=i%3Aaps%2Ck%3Afurniture&page=3&keywords=furniture&ie=UTF8&qid=1488212748&spIA=B01NBE3QE4,B014142SOQ,B01LB2TXIA,B00464AJ7U,B01M9JENJD,B00T40L0SS
		next_page_link = soup.find("a", {'id' : 'pagnNextLink'})
		base_url = "https://www.amazon.com"
		if next_page_link.get('href') != None:
			next_page_url = next_page_link['href']
			next_url_to_load = base_url + next_page_url

			# here we grab more asin numbers
			index_of_asin = next_page_url.find("spIA") + 5
			if (index_of_asin != -1):
				asin_from_link = next_page_url[index_of_asin: len(next_page_url)].split(",")
				for asin in asin_from_link:
					if len(asin) == 10:
						asin_list.append(asin)

			# append asin list to a csv 
			existing_list = list()
			with open('data/asin_list.csv', 'r') as f:
				reader = csv.reader(f)
				your_list = list(reader)
				for item in your_list:
					existing_list.append(item[0])


			with open('data/asin_list.csv', 'a') as f:
				writer = csv.writer(f)
				for asin in asin_list:
					if asin not in existing_list:
						writer.writerow([asin])
					else:
						print("Found duplicate ASIN : " + asin)

		print(len(existing_list))
		page_number = page_number + 1
		print(url)
		print("page_number : " + str(page_number))
		if page_number < 19:
			self.recursiveGetAsinListFromUrl(next_url_to_load, page_number)

	def getAsinListFromUrl(self, url):
		self.recursiveGetAsinListFromUrl(url, 1)

	def getProductDescriptionFromBrowseNodeXml(self, filename, category):
		with open(filename, "r") as f:
			xml_text = f.read()
			# soup = BeautifulSoup(response, "xml")
		xml_soup = BeautifulSoup(xml_text, "xml")
		print(filename)
		if self.xmlHasChildren(xml_soup):
			print("had children, moving on")
			return
		else:
			if xml_soup.find("Name") == None:
				return
			this_item_name = xml_soup.find("Name").text
			root_ancestor = self.getRootAncestor(xml_soup)
			if root_ancestor != None:

				this_item_name = root_ancestor + " " + this_item_name
				print(len(this_item_name))
				base_url = "https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=" 
				url = base_url + this_item_name
				self.getAsinListFromUrl(url)

	def getRootAncestor(self, xml_soup):
		ancestor_xml = xml_soup.find("Ancestors")
		if ancestor_xml == None:
			return None
		else:
			return ancestor_xml.find("Name").text

	def xmlHasChildren(self, xml_soup):
		children = xml_soup.find("Children")
		if children == None:
			return False
		else:
			return True

	def getCategories(self):
		workbook = xlrd.open_workbook('AmazonNodeId.xlsx')
		categories = list()
		for sheet in workbook.sheets():
			number_of_rows = sheet.nrows
			number_of_columns = sheet.ncols
			for i in range(0,number_of_rows):
				name = sheet.cell(i,0).value
				NodeId = sheet.cell(i,3).value 
				category_dict = {}
				category_dict['name'] = name
				category_dict['NodeId'] = NodeId
				categories.append(category_dict)
		return categories

	def main(self):
		categories = self.getCategories()
		random.shuffle(categories)
		directory = "./data/xml/nodes/"
		for category_dict in categories:
			this_directory = directory + category_dict['name'] + "/"
			if os.path.exists(this_directory):
				directory_items = os.listdir(this_directory)
				random.shuffle(directory_items)
				for filename in directory_items:
					self.getProductDescriptionFromBrowseNodeXml(this_directory + filename, category_dict['name'])

		

parser = AmazonHtmlParser()
time_0 = time.time()
parser.main()

# parser.getHtml("https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=      Cooking Wine          Red")

# url = "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=furniture"
# page_number = 0
# parser.getAsinListFromUrl(url, page_number)

# test_url = "https://www.amazon.com/dp/B01N6C6UHA/"
# test(test_url)

# test_list = {"name" : "darek", "origin" : "usa"}
# writeProductToCsv(test_list)


# getAmazonInfoFromAsin("B007OZNUCE")

	




