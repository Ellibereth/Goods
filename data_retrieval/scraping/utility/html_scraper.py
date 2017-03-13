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
import openpyxl
import xlrd
import sys
import queue
from utility import credential


class HtmlScraper():
	def __init__(self):
		self.proxy_list = []
		self.user_agent_list = []
		self.initializeScraper()
		self.output_html = list()
		proxy_credentials = credential.getProxyCredentials()
		self.proxy_username = proxy_credentials['username']
		self.proxy_password = proxy_credentials['password']


	# function that will pull the raw html with response and the option to use proxies
	# input: website url 
	# output: string with the urls html without javascript rendering
	def getHtml(self, url):
		proxy = self.getRandomProxy()
		full_proxy_with_auth = "http://" + self.proxy_username + ":" + self.proxy_password + "@" + proxy
		proxies = {"http": full_proxy_with_auth,
					"https": full_proxy_with_auth}
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
		with open ("./scraping_tools/proxylist.csv") as f:
			csv_reader = csv.reader(f, delimiter=',', quotechar='|')
			for row in csv_reader:
				proxy = row[0] + ":" + row[1]
				proxy_list.append(proxy)

		self.proxy_list = proxy_list

	# this methods pulls a random proxy from the proxy list
	def getRandomProxy(self):
		return random.choice(self.proxy_list)

	# this function will initialize the proxy list
	# this will eventually be changed to pull from a file or databse that has all our user_agents (see user_agents.txt)
	# right now it's hardcoded
	def initializeUserAgentList(self):
		user_agent_list = list()
		with open ("./scraping_tools/user_agents.txt") as f:
			for line in f:
				this_agent = line.replace("\n", "").replace("\"", "")
				user_agent_list.append(this_agent)

		self.user_agent_list = user_agent_list

	def getRandomUserAgent(self):
		return random.choice(self.user_agent_list)

	def initializeScraper(self):
		self.initializeProxyList()
		self.initializeUserAgentList()

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
		
		


# html_scraper = HtmlScraper()
# html_scraper.test()

