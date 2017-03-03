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
		self.initializeProxyList()
		self.initializeUserAgentList()
		self.queue = queue.LifoQueue()
		self.output_html = list()


	def addUrlToQueue(self,url):
		self.queue.put(url)

	def processNextUrlFromQueue(self):
		while not self.queue.empty():
			url = self.queue.get()
			html = self.getJavascriptRenderedHtml(url)
			# html = self.getHtml(url)
			self.output_html.append(html)
			self.queue.task_done()

	def processAllUrlFromQueue(self):
		# 20 is the number of threads
		for i in range(1,20):
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
		print ("Trying HTTP proxy %s" % proxy)
		response = requests.get(url, proxies=proxies, headers = headers)	
		print ("Got URL using proxy %s" % proxy)
		return response.text
		# except:
		# 	print ("Trying next proxy in 2 seconds")
		# 	time.sleep(2)
		# 	self.getHtml(url)

	

	def getJavascriptRenderedHtml(self, url):
		proxy = self.getRandomProxy()
		user_agent = self.getRandomUserAgent()
		desired_capabilities = DesiredCapabilities.PHANTOMJS.copy()
		desired_capabilities['phantomjs.page.customHeaders.User-Agent'] = user_agent
		full_random_proxy = '--proxy=' + proxy
		service_args = [full_random_proxy,'--proxy-type=http']
		driver = webdriver.PhantomJS(service_args=service_args, desired_capabilities=desired_capabilities)
		# driver = webdriver.PhantomJS(desired_capabilities=desired_capabilities)	
		time_start = time.time()
		print(url)
		print(proxy)
		driver.get(url)
		print("url getting done")
		html = driver.page_source
		driver.quit()
		time_1 = time.time()
		total_time = time_1 - time_start
		print("done getting html in : " + str(total_time) + " seconds")
		return html


	# this function will initialize the proxy list
	# this will eventually be changed to pull from a file or databse that has all our proxies
	# right now it's hardcoded
	def initializeProxyList(self):
		self.proxy_list = ["62.151.183.58:80",
							"104.198.5.198:80",
							"210.101.131.231:8080",
							"200.29.191.149:3128"
							]

	# this methods pulls a random proxy from the proxy list
	def getRandomProxy(self):
		return random.choice(self.proxy_list)


	# this function will initialize the proxy list
	# this will eventually be changed to pull from a file or databse that has all our user_agents (see user_agents.txt)
	# right now it's hardcoded
	def initializeUserAgentList(self):
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
# while True:
html_scraper.test()

