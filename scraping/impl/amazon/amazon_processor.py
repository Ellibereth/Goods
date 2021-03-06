import csv
import time
import os
import random
import xlrd
import sys
import queue
from threading import Thread
import threading
sys.stdout = open('./scraping/impl/amazon/logs/log.log', 'w')

from scraping.utility.html_scraper import HtmlScraper
from scraping.impl.amazon.amazon_parser import AmazonParser
from scraping.impl.amazon.amazon_writer import AmazonWriter
from scraping.impl.amazon.amazon_crawler import AmazonCrawler
from scraping.utility.product import Product 
from scraping.utility.labels import Labels
from scraping.impl.amazon.url import Url

START = "START"
END = "END"
"""
Dependendies ../scraper.py, ./amazon_parser.py, ./amazon_crawler.py, ./ amazon_writer.py

will use all of the above files and 
"""

class AmazonProcessor():
	def __init__(self, numThreads = 1):
		self.crawler = AmazonCrawler()
		self.scraper = HtmlScraper()
		self.parser = AmazonParser()
		self.queue = queue.LifoQueue()
		# we don't have a writer here because multiple sql connections
		# give malloc errors, so we define a new one each time
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
			return None
		# for now if the asin is already in the table, just skip...
		# in the future we may add the related asins to the queue still 
		has_asin = writer.tableHasAsin(asin)
		if has_asin:
			print("table has asin : " + asin)
			return None
		product_details = self.getProductDetailsFromUrl(url, writer)
		if product_details == None:
			return
		time_2 = time.time()
		writer.addProductEntryToDataTableFast(product_details)
		time_3 = time.time()
		print("time to write to db for asin \"" + str(asin) + "\" : " + str(time_3 - time_2))
		# print("from thread : " + str(threading.get_ident()))
		# # print("completed asin : " + asin)
		# print("----------------------------") 
		# print("\n")

	def getProductDetailsFromUrl(self, url, writer):
		asin = self.getAsinFromUrl(url)
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
		return product_details

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

	def getDataFromCategoryUrl(self, url, pagination_start = 1, pagination_end = 20):
		url_split = self.splitUrlByPage(url)
		print(url_split)
		for page_number in range(pagination_start, pagination_end):
			time_0 = time.time()
			url = url_split[START] + str(page_number) + url_split[END]
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
		print("Queue Size : " + str(self.queue.qsize()))
		self.processAllUrlFromQueue()
		self.joinProcesses()

	def writeTableToCsv(self):
		writer = AmazonWriter()
		writer.writeTableToCsv()
		writer.closeConnection()

	# should methods like this be moved to another file?
	def splitUrlByPage(self, url):
		index = url.find('page=')
		if index == -1:
			output = {}
			output[START] = url + "&page="
			output[END] = ""
			return output
		url_start = url[0: index + 5]
		url_end = ""
		i = index + 6
		page_ended = False
		while i < len(url):
			if not page_ended:
				if not url[i].isdigit() or url[i] == "&":
					url_end = url_end + url[i]
					page_ended = True
			else:
				url_end = url_end + url[i]
			i = i + 1
		output = {}
		output[START] = url_start
		output[END] = url_end
		return output

	# add a function to just process one url
	def main(self):
		url = "https://www.amazon.com/s/ref=lp_330405011_pg_2?rh=n%3A172282%2Cn%3A%21493964%2Cn%3A502394%2Cn%3A281052%2Cn%3A330405011&page=2&ie=UTF8&qid=1490285654"
		self.getDataFromCategoryUrl(url, pagination_start = 1, pagination_end = 240)
		self.writeTableToCsv()
		

	def one_test(self):
		asin = "B00O257IJA"
		url = "https://www.amazon.com/dp/" + asin
		self.oneTimeProcessProductUrl(url)
		self.writeTableToCsv()





