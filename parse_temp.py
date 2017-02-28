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

	def LoadProxies(self, proxy_fife):
	    """
	    uafile : string
	        path to text file of user agents, one per line
	    """
	    output = []
	    with open(proxy_fife, 'r') as f:
	        for proxy in f.readlines():
	            output.append(proxy.replace(" ", "").replace("\n", ""))
	    random.shuffle(output)
	    return output


	def getHtml(self, url):
		desired_capabilities = DesiredCapabilities.PHANTOMJS.copy()
		# load the user agents, in random order
		user_agent = self.LoadUserAgents(uafile="user_agents.txt")
		random_user_agent = random.choice(user_agent)
		desired_capabilities['phantomjs.page.customHeaders.User-Agent'] = random_user_agent
		proxy_list = self.LoadProxies(proxy_fife = "proxy.txt")
		random_proxy = '--proxy=' + random.choice(proxy_list).replace(" ", "").replace("\n", "")
		print(random_proxy)
		# print(random_proxy)
		# print(len(random_proxy))
		# print(random_proxy)
		service_args = [random_proxy,'--proxy-type=http']
		driver = webdriver.PhantomJS(service_args=service_args, desired_capabilities=desired_capabilities)	
		# driver = webdriver.PhantomJS(desired_capabilities=desired_capabilities)	
		driver.get(url)
		html = driver.page_source
		driver.quit()
		# soupFromJokesCC = BeautifulSoup(driver.page_source) #fetch HTML source code after rendering
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


	def recursiveGetAsinListFromUrl(self, url, page_number):
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
			self.recursiveGetAsinListFromUrl(url, page_number)
		asin_list = list()
		for product in product_list.find_all("li"):
			if product.get("data-asin") != None:
				asin_list.append(product['data-asin'])

		# /gp/search/ref=sr_pg_3?rh=i%3Aaps%2Ck%3Afurniture&page=3&keywords=furniture&ie=UTF8&qid=1488212748&spIA=B01NBE3QE4,B014142SOQ,B01LB2TXIA,B00464AJ7U,B01M9JENJD,B00T40L0SS
		next_page_link = soup.find("a", {'id' : 'pagnNextLink'})
		base_url = "https://www.amazon.com"
		next_page_url = next_page_link['href']
		next_url_to_load = base_url + next_page_url

		# here we grab more asin numbers
		index_of_asin = next_page_url.find("spIA") + 5
		if (index_of_asin != -1):
			asin_from_link = next_page_url[index_of_asin: len(next_page_url)].split(",")
			for asin in asin_from_link:
				asin_list.append(asin)

		# append asin list to a csv 
		with open('data/asin_list.csv', 'a') as f:
			writer = csv.writer(f)
			for asin in asin_list:
				writer.writerow([asin])

		page_number = page_number + 1
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
		if self.xmlHasChildren(xml_soup):
			return
		else:
			this_item_name = xml_soup.find("Name").text
			root_ancestor = self.getRootAncestor(xml_soup)
			if root_ancestor != None:
				this_item_name = root_ancestor + " " + this_item_name
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
		# categories = self.getCategories()
		# directory = "./data/xml/nodes/"
		# for category_dict in categories:
		# 	this_directory = directory + category_dict['name'] + "/"
		# 	if os.path.exists(this_directory):
		# 		for filename in os.listdir(this_directory):
		# 			self.getProductDescriptionFromBrowseNodeXml(this_directory + filename, category_dict['name'])

		

parser = AmazonHtmlParser()
# parser.main()
parser.getHtml("https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=Cooking Wine Red")

# url = "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=furniture"
# page_number = 0
# parser.getAsinListFromUrl(url, page_number)

# test_url = "https://www.amazon.com/dp/B01N6C6UHA/"
# test(test_url)

# test_list = {"name" : "darek", "origin" : "usa"}
# writeProductToCsv(test_list)


# getAmazonInfoFromAsin("B007OZNUCE")

	



