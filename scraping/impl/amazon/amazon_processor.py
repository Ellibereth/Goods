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

from html_scraper import HtmlScraper
from amazon_parser import AmazonParser
from amazon_writer import AmazonWriter

"""
Dependendies ../scraper.py, ./amazon_parser.py, ./amazon_crawler.py, ./ amazon_writer.py

will use all of the above files and 
"""

class AmazonProcessor():
	def __init__(self):
		self.name = "Amazon Processor"

	def main(self):
		asin = "B00LNMVPPI"
		url = "https://www.amazon.com/dp/" + asin
		scraper = HtmlScraper()
		parser = AmazonParser()
		writer = AmazonWriter()
		time_0 = time.time()
		html = scraper.getJavascriptRenderedHtml(url)
		time_1 = time.time()
		product = parser.getProductAttributes(html)
		time_2 = time.time()
		writer.addProductEntryToDataTable(product)
		time_3 = time.time()
		print("time to render html : " + str(time_1 - time_0))
		print("time to parse html : " + str(time_2 - time_1))
		print("time to write to database : " + str(time_3 - time_2))
		print(product)
		writer.closeConnection()

AmazonProcessor = AmazonProcessor()
AmazonProcessor.main()