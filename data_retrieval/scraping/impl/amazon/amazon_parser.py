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
import re
sys.path.append('../../utility')
from product import Product

"""
This file has 2 main goals
1. Find ways to get more Amazon Product URLs (either by ASIN or crawling)
2. Given Amazon product html like www.amazon.com/dp/[ASIN], return a product object with characteristics on the product

this file has no dependencies and just takes html as inputs 
"""



class AmazonParser():
	def __init__(self):
		self.name = "Amazon Processor"

	# to start we'll just get the following information 
	# price + company + country of origin + name of product + classification of product
	# Given an Amazon product html as input
	# we return Product object that has the product informaiton
	def getProductAttributes(self, product_html):
		product = Product()

		detail_search_targets = product.getAmazonDetailSearchTargets()
		soup = BeautifulSoup(product_html, "html.parser")
		# here we get the product name 
		product_name_tag = soup.find("h1", id = "title")
		if product_name_tag != None:
			product.addAttribute(product.labels.ProductName, product_name_tag.text)

		# here we get the price
		price_tag = soup.find("span", id = "priceblock_ourprice")
		if price_tag != None:
			price = price_tag.text
			product.addAttribute(product.labels.Price, price)

		# here we get the category 
		category_tags = soup.findAll("a" , {"class" : "a-link-normal a-color-tertiary"})
		if category_tags != None:
			if len(category_tags) > 0:
				last_tag = category_tags[len(category_tags)-1]
				category_link = last_tag['href']
				node_index = category_link.find("node=") + 5
				product.addAttribute(product.labels.CategoryNodeId, category_link[node_index:])
				product.addAttribute(product.labels.Category, last_tag.text)

		# here we check if the product details are in table form 
		description_tables = soup.findAll('table', id=re.compile("^productDe.*"))
		for table in description_tables:
			rows = table.findAll("tr")
			for row in rows:
				for target in detail_search_targets:
					if row.find("th").text.lower().find(target) != -1:
						product.addAttribute(target, row.find("td").text)

		# now we check if the product details are in list form 
		description_list = soup.find('div', id = re.compile("^detailBullet.*"))
		if description_list != None:
			for list_item in description_list.findAll("span", {"class" : "a-list-item"}):
				spans = list_item.findAll("span")
				if (len(spans) > 0):
					for target in detail_search_targets:
						if spans[0].text.lower().find(target) != -1:
							product.addAttribute(target, spans[1].text)


		# here we remove a lot of spaces and new line characters
		# and clean other data
		for key in product.getDetails():
			trimmed_info = product.getAttribute(key).replace("\n", "")
			trimmed_info = re.sub('  +','',trimmed_info)
			if key == "asin":
				trimmed_info = trimmed_info.replace(" ", "")
			if key == "price":
				trimmed_info = trimmed_info.replace("$", "")
			product.addAttribute(key, trimmed_info)

		return product

	def main():
		print("this is an amazon parser file ")
