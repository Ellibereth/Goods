from bs4 import BeautifulSoup
import requests
import zipcode
import csv
import time
from selenium import webdriver
import os
import bottlenose
from selenium.webdriver import DesiredCapabilities
import random
import xlrd
import sys
# from multiprocessing import Queue
import queue
from threading import Thread



class HtmlScraper():
	def __init__(self):
		self.proxy_list = []
		self.user_agent_list = []
		self.initializeScraper()
		self.queue = queue.LifoQueue()
		self.output_html = list()
		self.proxy_username = "darekjohnson28"
		self.proxy_password = "hB9CUZqI"


	def addUrlToQueue(self,url):
		self.queue.put(url)

	def processNextUrlFromQueue(self):
		while not self.queue.empty():
			url = self.queue.get()
			self.getAsinListFromUrl(url)
			# html = self.getJavascriptRenderedHtml(url)
			# html = self.getHtml(url)
			self.queue.task_done()

	def processAllUrlFromQueue(self):
		# 20 is the number of threads
		for i in range(1,40):
			thread = Thread(target = self.processNextUrlFromQueue)
			thread.start()

	# function that will pull the raw html with response and the option to use proxies
	# input: website url 
	# output: string with the urls html without javascript rendering
	def getHtml(self, url):
		proxy = self.getRandomProxy()
		proxies = {"http": proxy,
					"https": proxy}
		user_agent = self.getRandomUserAgent()
		headers = {'User-agent': user_agent, "content-type" : "text"}
		response = requests.get(url, proxies=proxies, headers = headers)	
		return response.text

	

	def getJavascriptRenderedHtml(self, url):
		proxy = self.getRandomProxy()
		user_agent = self.getRandomUserAgent()
		desired_capabilities = DesiredCapabilities.PHANTOMJS.copy()
		desired_capabilities['phantomjs.page.customHeaders.User-Agent'] = user_agent
		full_random_proxy = '--proxy=' + proxy
		proxy_authentication = '--proxy-auth=' + self.proxy_username + ':' + self.proxy_password
		service_args = [full_random_proxy,'--proxy-type=https', proxy_authentication, '--ignore-ssl-errors=true', '--ssl-protocol=any']
		driver = webdriver.PhantomJS(service_args=service_args, desired_capabilities=desired_capabilities)
		# driver = webdriver.PhantomJS(desired_capabilities=desired_capabilities)	
		time_start = time.time()
		driver.get(url)
		html = driver.page_source
		driver.quit()
		# print(proxy)
		# time_1 = time.time()
		# total_time = time_1 - time_start
		# print("done getting html in : " + str(total_time) + " seconds")
		return html


	# this function will initialize the proxy list
	# this will eventually be changed to pull from a file or databse that has all our proxies
	# right now it's hardcoded
	def initializeProxyList(self):
		proxy_list = list()
		with open ("scraping_tools/proxylist.csv") as f:
			csv_reader = csv.reader(f, delimiter=',', quotechar='|')
			for row in csv_reader:
				proxy = row[0] + ":" + row[1]
				proxy_list.append(proxy)

		self.proxy_list = proxy_list


		# self.proxy_list = ["62.151.183.58:80",
		# 					"104.198.5.198:80",
		# 					"210.101.131.231:8080",
		# 					"200.29.191.149:3128"
		# 					]

	# this methods pulls a random proxy from the proxy list
	def getRandomProxy(self):
		return random.choice(self.proxy_list)


	# this function will initialize the proxy list
	# this will eventually be changed to pull from a file or databse that has all our user_agents (see user_agents.txt)
	# right now it's hardcoded
	def initializeUserAgentList(self):
		user_agent_list = list()
		with open ("scraping_tools/user_agents.txt") as f:
			for line in f:
				this_agent = line.replace("\n", "").replace("\"", "")
				user_agent_list.append(this_agent)

		# self.user_agent_list = user_agent_list
				

		self.user_agent_list = ["Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)",
								"Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)",
								"Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/5.0)",
								"Mozilla/4.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/5.0)",
								"Mozilla/1.22 (compatible; MSIE 10.0; Windows 3.1)",
								"Mozilla/5.0 (Windows; U; MSIE 9.0; WIndows NT 9.0; en-US))",
								"Mozilla/5.0 (Windows; U; MSIE 9.0; Windows NT 9.0; en-US)",
								"Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; Zune 4.0; InfoPath.3; MS-RTC LM 8; .NET4.0C; .NET4.0E)"]
	

	def getRandomUserAgent(self):
		return random.choice(self.user_agent_list)

	def initializeScraper(self):
		self.initializeProxyList()
		self.initializeUserAgentList()



	## below this is testing form parse.py just to see how multithreading will work 
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

		try:	
			html = self.getJavascriptRenderedHtml(url)
		except:
			return

		soup = BeautifulSoup(html, "html.parser")
		directory = "data/test_html"
		if os.path.exists(directory):
			next_page_number = len(os.listdir(directory)) + 1
			with open("data/test_html/" + str(next_page_number) + ".html", "w") as f:
				f.write(html)

		product_list = soup.find("ul", {'id' : 's-results-list-atf'})
		if product_list == None:
			# print("bad url : " + url)	
			# print(product_list)
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
		if next_page_link == None:
			with open('data/asin_list.csv', 'a') as f:
				writer = csv.writer(f)
				for asin in asin_list:
					writer.writerow([asin])
			return
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

			# # append asin list to a csv 
			# existing_list = list()
			# with open('data/asin_list.csv', 'r') as f:
			# 	reader = csv.reader(f)
			# 	your_list = list(reader)
			# 	for item in your_list:
			# 		existing_list.append(item[0])


		with open('data/asin_list.csv', 'a') as f:
			writer = csv.writer(f)
			for asin in asin_list:
				writer.writerow([asin])		
		if page_number < 19:
			wait_time = random.uniform(0,1)
			time.sleep(wait_time)
			try:
				self.recursiveGetAsinListFromUrl(next_url_to_load, page_number)
			except:
				print("bad url")
				return

	def getAsinListFromUrl(self, url):
		self.recursiveGetAsinListFromUrl(url, 1)

	def getProductDescriptionFromBrowseNodeXml(self, filename, category):
		with open(filename, "rb") as f:
			xml_text = f.read()
			# soup = BeautifulSoup(response, "xml")
		xml_soup = BeautifulSoup(xml_text, "xml")
		if self.xmlHasChildren(xml_soup):
			return
		else:
			if xml_soup.find("Name") == None:
				return
			this_item_name = xml_soup.find("Name").text
			root_ancestor = self.getRootAncestor(xml_soup)
			if root_ancestor != None:
				this_item_name = root_ancestor + " " + this_item_name
				# base_url = "https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=" 
				# url = base_url + this_item_name
				# self.addUrlToQueue(url)
				with open("data/scraping/keywords.csv", 'a') as f:
					writer = csv.writer(f)
					writer.writerow([this_item_name])


	def getRootAncestor(self, xml_soup):
		ancestor_xml = xml_soup.find("Ancestors")
		if ancestor_xml == None:
			return xml_soup.find("Name").text
		else:
			return self.getRootAncestor(ancestor_xml)

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
		count = 0
		with open ('./data/scraping/keywords.csv') as f:
			csv_reader = csv.reader(f)
			for row in csv_reader:
				count = count + 1
				print(count)
				keyword = row[0]
				base_url = "https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=" 
				url = base_url + keyword
				with open ('./data/scraping/completed_keywords.csv', 'a') as f:
					csv_writer = csv.writer(f)
					csv_writer.writerow([keyword])
				self.addUrlToQueue(url)
				if count % 1000 == 0:
					self.processAllUrlFromQueue()
					self.queue.join()

		self.processAllUrlFromQueue()
		self.queue.join()

	## end of stuff ripped from parse.py

	def test(self):
		# url = "http://www.lagado.com/proxy-test"
		url = "http://www.findmyip.org/"
		for i in range(1,50):
			self.addUrlToQueue(url)

		time_0 = time.time()
		self.processAllUrlFromQueue()
		self.queue.join()
		for i in range(0,len(self.output_html)):
			f = open("logs/" + str(i) + ".html", "w")
			f.write(self.output_html[i])
			f.close()

		time_1 = time.time()
		total_time = time_1 - time_0
		print("multithreaded time : " + str(total_time))
		
		


html_scraper = HtmlScraper()
html_scraper.main()

