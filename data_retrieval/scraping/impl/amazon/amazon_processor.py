from bs4 import BeautifulSoup
import requests
import csv
import time
from selenium import webdriver
import os
import bottlenose
from selenium.webdriver import DesiredCapabilities
import random
import xlrd
import sys
import queue
from threading import Thread
sys.stdout = open('./impl/amazon/logs/log.log', 'w')

from utility.html_scraper import HtmlScraper
from impl.amazon.amazon_parser import AmazonParser
from impl.amazon.amazon_writer import AmazonWriter
from impl.amazon.amazon_crawler import AmazonCrawler
from utility.product import Product 
from utility.labels import Labels
from impl.amazon.url import Url

"""
Dependendies ../scraper.py, ./amazon_parser.py, ./amazon_crawler.py, ./ amazon_writer.py

will use all of the above files and 
"""

class AmazonProcessor():
	def __init__(self, numThreads = None):
		self.crawler = AmazonCrawler()
		self.scraper = HtmlScraper()
		self.parser = AmazonParser()
		self.queue = queue.LifoQueue()
		# we don't have a writer here because multiple sql connections
		# give malloc errors, so we define a new one each time
		
		self.numThreads = 1
		if numThreads != None:
			self.numThreads = numThreads

	# function to handle any other tasks we want completed before joining the threads
	def joinProcesses(self):
		self.queue.join()

	# adds a url to the queue to be processed
	def addUrlToQueue(self,url):
		self.queue.put(url)

	# adds a url to the queue based on the asin provided
	def addAsinToQueue(self, asin):
		if asin == None:
			return
		if len(asin) != 10:
			return
		url = "https://www.amazon.com/dp/" + asin
		self.queue.put(url)

	## this needs to be updated so that we can multithread and keep the same conncetion open instead 
	## of opening and closing for each write to server
	def processNextUrlFromQueue(self):
		writer = AmazonWriter()
		while not self.queue.empty():

			url = self.queue.get()
			# try:
			self.processProductUrl(url, writer)
			# except:
			# print("processed url : " + url)
			# 	writer = AmazonWriter()
			sys.stdout.flush()
			self.queue.task_done()
		writer.closeConnection()

	# starts processing the URLs in the queue via multithreading
	def processAllUrlFromQueue(self):
		# 20 is the number of threads
		for i in range(0,self.numThreads):
			print("this is a thread!")
			thread = Thread(target = self.processNextUrlFromQueue)
			thread.start()
			
	# use this method when not multithreading
	# used primarily for testing
	def oneTimeProcessProductUrl(self, url):
		writer = AmazonWriter()
		self.processProductUrl(url, writer)
		writer.closeConnection()


	# assumes a connection is open already and keeps it open
	# use this one for multithreading
	def processProductUrl(self, url, writer):
		time_0 = time.time()
		asin = self.getAsinFromUrl(url)
		if asin == None:
			print("asin from the url is none : " + url)
			return
		# for now if the asin is already in the table, just skip...
		# in the future we will add the related asins to the queue still 
		has_asin = writer.tableHasAsin(asin)
		if has_asin:
			print("table has asin : " + asin)
			return

		html = self.scraper.getHtml(url)
		time_1 = time.time()
		# asin_list = self.crawler.getAsinFromHtml(html)
		# for asin in asin_list:
		# 	self.addAsinToQueue(asin)
		# try:
		product = self.parser.getProductAttributes(html)
		product.addAttribute(Labels.Asin, asin)
		# except:
		# 	with open('./impl/amazon/logs/bad_url_list.log', 'a') as f:
		# 		f.write(url + "\n")
		# 	product = None

		product_details = product.getDetails()
		time_2 = time.time()
		writer.addProductEntryToDataTable(product_details)
		time_3 = time.time()
		print("completed asin : " + asin)

	# if url = "amazon.com/dp/[asin]"
	# will return [asin]
	# if no /dp exists then will return None
	def getAsinFromUrl(self, url):
		if url == None:
			return None
		index_of_asin = url.find("/dp/") + 4
		if index_of_asin == -1:
			return None

		asin = url[index_of_asin: index_of_asin + 10]
		if asin.find('/') != -1:
			return None
		return asin

	def getDataFromCategoryUrl(self, url_start, url_end = "", pagination_start = 1, pagination_end = 20):
		for page_number in range(pagination_start, pagination_end):
			time_0 = time.time()
			url = url_start + str(page_number) + url_end
			print("processing html")
			html = self.scraper.getHtml(url)
			print("html processed " + str(page_number))
			asin_list = self.crawler.getAsinFromHtml(html)
			sys.stdout.flush()
			for asin in asin_list:
				self.addAsinToQueue(asin)
			# self.processAllUrlFromQueue()
			# self.queue.join()	
			time_1 = time.time()
			# print("time to add asins from search to queue : " + str(time_1 - time_0))
		print("starting to multithread")
		self.processAllUrlFromQueue()
		self.joinProcesses()

	def writeTableToCsv(self):
		writer = AmazonWriter()
		writer.writeTableToCsv()
		writer.closeConnection()

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


	def getUrlsFromKeyWord(self, keyword):
		url = "https://www.amazon.com/s/keywords=" + keyword
		return url

	def getUrlFromBrandNodeId(self, brand_node_id):
		url = "https://www.amazon.com/b/?node=" + brand_node_id + "&page="
		return url

	def main(self):
		usa_companies = self.getUsaCompaniesFromCsv()
		count = 0
		for company in usa_companies:
			if count > 6:
				url = self.getUrlFromBrandNodeId(company['node_id'])
				# self.getDataFromCategoryUrl(url)
				print("URL is  : " + url)
				for i in range(1,20):
					html = self.scraper.getHtml(url + str(i))
					self.crawler.getAsinFromHtml(html)
					asin_list = self.crawler.getAsinFromHtml(html)
					for asin in asin_list:
						self.addAsinToQueue(asin)
				
				print("Queue size for company \"" + str(company['name'])  + "\" is  : " + str(self.queue.qsize()))
				self.processAllUrlFromQueue()
				self.joinProcesses()
				print("completed company : " + company['name'])
			count = count + 1


	def one_test(self):
		asin = "B00KLFYGCC"
		url = "https://www.amazon.com/dp/" + asin
		self.oneTimeProcessProductUrl(url)
		self.writeTableToCsv()





