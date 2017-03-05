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

"""
The point of this file is given various types of Amazon HTML files to return a list Amazon product URLs 

"""

class AmazonCrawler:
	def __init__(self):
		self.name = "AmazonCrawler"

	# given html page, returns all the ASIN found on that page
	def getAsinFromHtml(self, html):
		soup = BeautifulSoup(html, "html.parser")
		tags = soup.find_all(lambda tag: 'data-asin' in tag.attrs)
		asin_list = list()
		for tag in tags:
			asin_list.append(tag['data-asin'])
		return asin_list


