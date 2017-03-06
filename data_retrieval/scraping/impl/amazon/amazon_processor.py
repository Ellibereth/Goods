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
			self.processProductUrl(url, writer)
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
			return
		# for now if the asin is already in the table, just skip...
		# in the future we will add the related asins to the queue still 
		if writer.tableHasAsin(asin):
			return
		html = self.scraper.getHtml(url)
		time_1 = time.time()
		# asin_list = self.crawler.getAsinFromHtml(html)
		# for asin in asin_list:
		# 	self.addAsinToQueue(asin)
		try:
			product = self.parser.getProductAttributes(html)
			product.addAttribute(product.labels.Asin, asin)
		except:
			with open('./logs/bad_url_list.log', 'a') as f:
				f.write(url + "\n")
			product = None
			return

		product_details = product.getDetails()
		time_2 = time.time()
		writer.addProductEntryToDataTable(product_details)
		time_3 = time.time()
		print("time to render html : " + str(time_1 - time_0))
		print("time to parse html : " + str(time_2 - time_1))
		print("time to write to database : " + str(time_3 - time_2))

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

	# the url is the url for category Chair 
	# writes all the url from the chair to the database
	# in the future we want to multithread the adding of asin lists too
	def getChairData(self):
		url_start = "https://www.amazon.com/s/ref=lp_3733821_pg_2?rh=n%3A1055398%2Cn%3A%211063498%2Cn%3A1063306%2Cn%3A3733781%2Cn%3A3733821&page="
		url_end = "&ie=UTF8&qid=1488683343&spIA=B01N7MG70Z,B00YHXESPE,B00YHXF394&lo=garden"
		for page_number in range(55, 60):
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
		self.joinProcesses()

	def getMachineData(self):
		url_start = "https://www.amazon.com/s/?fst=as%3Aoff&rh=n%3A16310091%2Cn%3A3021479011%2Ck%3Amachine+parts&page="
		url_end = "&keywords=machine+parts&ie=UTF8&qid=1488777854&spIA=B00396J7V0,B002OU6ZSA"
		for page_number in range(1, 20):
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
		self.joinProcesses()


	def writeTableToCsv(self):
		writer = AmazonWriter()
		writer.writeTableToCsv()
		writer.closeConnection()

	def main(self):
		asin = "B00WB14DTA"
		url = "https://www.amazon.com/dp/" + asin
		self.oneTimeProcessProductUrl(url)
		# self.addUrlToQueue(url)
		# self.joinProcesses()



processor = AmazonProcessor(numThreads = 10)
processor.getMachineData()
processor.writeTableToCsv()
