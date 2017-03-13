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

sys.path.append('../../utility')
sys.stdout = open('logs/log.log', 'w')

from html_scraper import HtmlScraper
from amazon_parser import AmazonParser
from amazon_writer import AmazonWriter
from amazon_crawler import AmazonCrawler
from product import Product 
from labels import Labels
from url import Url

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
			# 	writer = AmazonWriter()
			print("done with url : " + url)
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
		return True

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
		try:
			product = self.parser.getProductAttributes(html)
			product.addAttribute(Labels.Asin, asin)
		except:
			with open('./logs/bad_url_list.log', 'a') as f:
				f.write(url + "\n")
			product = None

		product_details = product.getDetails()
		time_2 = time.time()
		writer.addProductEntryToDataTable(product_details)
		time_3 = time.time()
		return True

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

	def getDataFromCategoryUrl(self, url_start, url_end):
		for page_number in range(41, 42):
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

	def main(self):
		# asin = "B00WB14DTA"
		# url = "https://www.amazon.com/dp/" + asin
		# self.oneTimeProcessProductUrl(url)
		self.getDataFromCategoryUrl(Url.ChairStart, Url.ChairEnd)
		self.getDataFromCategoryUrl(Url.MachineStart, Url.MachineEnd)
		self.getDataFromCategoryUrl(Url.MensClothingStart, Url.MensClothingEnd)
		self.getDataFromCategoryUrl(Url.ToysStart , Url.ToysEnd)
		self.getDataFromCategoryUrl(Url.SportsStart, Url.SportsEnd)
		self.getDataFromCategoryUrl(Url.FurnitureStart, Url.FurnitureEnd)
		self.getDataFromCategoryUrl(Url.BeautyStart,  Url.BeautyEnd)
	
	def test(self):
		print("test_starting")
		asin = "B00WB14DTA"
		url = "https://www.amazon.com/dp/" + asin
		test_result = self.oneTimeProcessProductUrl(url)
		return test_result


if __name__ == "__main__":
	print("Bro")
	processor = AmazonProcessor(10)
	processor.main()



