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
from utility.product import Product
from utility.labels import Labels

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
		detail_search_targets = Labels.AmazonDetailSearchTargets
		soup = BeautifulSoup(product_html, "html.parser")
		# here we get the product name 
		product_name_tag = soup.find("h1", id = "title")
		if product_name_tag != None:
			product.addAttribute(Labels.ProductName, product_name_tag.text)

		# here we get the price
		price_tag = soup.find("span", id = "priceblock_ourprice")
		if price_tag != None:
			price = price_tag.text
			product.addAttribute(Labels.Price, price)

		# get the brand name and the brand tag
		brand_tag = soup.find("a", id = "brand")
		if brand_tag != None:
			brand = brand_tag.text
			product.addAttribute(Labels.Brand, brand)
			brand_href = brand_tag['href']
			target = "&node="
			href_end = ""
			for i in range(0,len(brand_href)):
				if brand_href[i: i + len(target)] == target:
					href_end = brand_href[i + len(target):]
			brand_node_id = href_end.split('&')[0]
			product.addAttribute(Labels.BrandNodeId, brand_node_id)
			
		# here we get the category 
		category_tags = soup.findAll("a" , {"class" : "a-link-normal a-color-tertiary"})
		if category_tags != None:
			if len(category_tags) > 0:
				last_tag = category_tags[len(category_tags)-1]
				category_link = last_tag['href']
				node_index = category_link.find("node=") + 5
				product.addAttribute(Labels.CategoryNodeId, category_link[node_index:])
				product.addAttribute(Labels.Category, last_tag.text)

		# here we check if the product details are in table form 
		description_tables = soup.findAll('table', id=re.compile("^productDe.*"))
		for table in description_tables:
			rows = table.findAll("tr")
			for row in rows:
				for target in detail_search_targets:
					if row.find("th") != None:
						if row.find("th").text.lower().find(target) != -1:
							product.addAttribute(target, row.find("td").text)

		# now we check if the product details are in list form 
		# This code is written so that if by some (very rare) chance that
		# produc details are in table and list form
		# we would overwrite the table data if a list form exists
		# this was intentional
		description_list = soup.find('div', id = re.compile("^detailBullet.*"))
		if description_list != None:
			for list_item in description_list.findAll("span", {"class" : "a-list-item"}):
				spans = list_item.findAll("span")
				if (len(spans) > 0):
					for target in detail_search_targets:
						if len(spans) > 0:
							if spans[0].text.lower().find(target) != -1:
								product.addAttribute(target, spans[1].text)


		# here we remove a lot of spaces and new line characters
		# and clean other data
		for key in product.getDetails():
			trimmed_info = product.getAttribute(key).replace("\n", "")
			trimmed_info = re.sub('  +','',trimmed_info)
			if key == Labels.Asin:
				trimmed_info = trimmed_info.replace(" ", "")
			if key == Labels.Price:
				trimmed_info = trimmed_info.replace("$", "")
			product.addAttribute(key, trimmed_info)

		return product

