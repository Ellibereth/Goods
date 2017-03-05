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
# from multiprocessing import Queue
import queue
from threading import Thread

sys.path.append('../')
sys.stdout = open('logs/log.log', 'w')

from html_scraper import HtmlScraper
from amazon_parser import AmazonParser
from amazon_writer import AmazonWriter
from amazon_crawler import AmazonCrawler

"""
Dependendies ../scraper.py, ./amazon_parser.py, ./amazon_crawler.py, ./ amazon_writer.py

will use all of the above files and 
"""

class AmazonProcessor():
	def __init__(self):
		self.crawler = AmazonCrawler()
		self.scraper = HtmlScraper()
		# self.writer = AmazonWriter()
		self.parser = AmazonParser()
		self.queue = queue.LifoQueue()
		self.MAX = 5000
		self.counter = 0


	def addUrlToQueue(self,url):
		if self.counter < self.MAX:
			self.queue.put(url)
			self.counter = self.counter + 1

	# def closeConnection(self):
	# 	self.writer.closeConnection()

	def addAsinToQueue(self, asin):
		if self.counter < self.MAX:
			url = "https://www.amazon.com/dp/" + asin
			self.queue.put(url)
			self.counter = self.counter + 1

	def processNextUrlFromQueue(self):
		while not self.queue.empty():
			url = self.queue.get()
			self.processProductUrl(url)
			self.queue.task_done()

	def processAllUrlFromQueue(self):
		# 20 is the number of threads
		for i in range(1,18):
			thread = Thread(target = self.processNextUrlFromQueue)
			thread.start()


	def processProductUrl(self, url):
		time_0 = time.time()
		asin = self.getAsinFromUrl(url)
		if asin == None:
			return
		print("processing asin : " + asin)
		# for now if the asin is already in the table, just skip...
		# in the future we will add the related asins to the queue still 
		writer = AmazonWriter()
		if writer.tableHasAsin(asin):
			writer.closeConnection()
			return
		html = self.scraper.getHtml(url)
		time_1 = time.time()
		# asin_list = self.crawler.getAsinFromHtml(html)
		# for asin in asin_list:
		# 	self.addAsinToQueue(asin)
		try:
			product = self.parser.getProductAttributes(html)
		except:
			product = None
		time_2 = time.time()
		writer.addProductEntryToDataTable(product)
		writer.closeConnection()
		time_3 = time.time()
		print("time to render html : " + str(time_1 - time_0))
		print("time to parse html : " + str(time_2 - time_1))
		print("time to write to database : " + str(time_3 - time_2))
		print(product)

	# given something like 
	# "https://www.amazon.com/s/ref=lp_3733821_pg_2?rh=n%3A1055398%2Cn%3A%211063498%2Cn%3A1063306%2Cn%3A3733781%2Cn%3A3733821&page=2&ie=UTF8&qid=1488683343&spIA=B01N7MG70Z,B00YHXESPE,B00YHXF394&lo=garden"
	# we can change it so the page=2 changes to page=3  (or in general increments it)
	def getNextPageUrl(self, url):
		page_index = url.find("page=")
		url_after_page = url[page_index + 5:]
		current_page_number = int(url_after_page.split("&")[0])

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

	def main(self):
		# asin = "B00LNMVPPI"
		# url = "https://www.amazon.com/dp/" + asin
		url = "https://www.amazon.com/b/ref=lp_3733781_ln_5?node=16187580011&ie=UTF8&qid=1488683705"
		url_start = "https://www.amazon.com/s/ref=lp_3733821_pg_2?rh=n%3A1055398%2Cn%3A%211063498%2Cn%3A1063306%2Cn%3A3733781%2Cn%3A3733821&page="
		url_end = "&ie=UTF8&qid=1488683343&spIA=B01N7MG70Z,B00YHXESPE,B00YHXF394&lo=garden"
		for page_number in range(1, 50):
			time_0 = time.time()
			url = url_start + str(page_number) + url_end
			print("processing html")
			html = self.scraper.getHtml(url)
			print("html processed " + str(page_number))
			asin_list = self.crawler.getAsinFromHtml(html)
			for asin in asin_list:
				self.addAsinToQueue(asin)
			self.processAllUrlFromQueue()
			self.queue.join()	
			time_1 = time.time()
			print("time to add asins from search to queue : " + str(time_1 - time_0))

		print("beginning to process URLS")
		self.processAllUrlFromQueue()
		self.queue.join()




writer = AmazonWriter()
writer.writeTableToCsv()
writer.closeConnection()
# AmazonProcessor = AmazonProcessor()
# AmazonProcessor.main()