
from bs4 import BeautifulSoup
import requests
import zipcode
import csv
import time
from selenium import webdriver
import os
import urllib
import bottlenose
from selenium.webdriver import DesiredCapabilities
import random
import xlrd



class AmazonManager:
	def __init__(self):
		self.AWS_ACCESS_KEY_ID = "AKIAJEGXYAPQ5DFQWHMA";
		self.AWS_SECRET_ACCESS_KEY = "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";
		self.AWS_ASSOCIATE_TAG = "remaura-20"
		self.amazon = bottlenose.Amazon(self.AWS_ACCESS_KEY_ID, self.AWS_SECRET_ACCESS_KEY, self.AWS_ASSOCIATE_TAG)

	def getAmazonInfoFromAsin(self, asin):
		response = self.amazon.ItemLookup(ItemId = asin)
		with open("data/xml/" + asin + ".xml", "wb") as f:
			f.write(response)

	def browseNodes(self, NodeId, category):
		self.recursiveBrowseNodes(NodeId, 1, category)

	# given a NodeId, returns all the children of the NodeId
	# takes the response xml as input
	def getNodeChildren(self, response):
		soup = BeautifulSoup(response, "xml")
		children = soup.find("Children")
		node_id_list = list()
		if children != None:
			children_list = children.find_all("BrowseNode")
			for child in children_list:
				node_id = child.find("BrowseNodeId").text
				node_id_list.append(node_id)
		return node_id_list

	def recursiveBrowseNodes(self, NodeId, depth, category):
		print(" depth level is : " + str(depth))
		
		directory = "data/xml/nodes/" + category
		print(" directory : " + directory)
		if not os.path.exists(directory):
			os.makedirs(directory)


		
		end_extension = "/" + NodeId + ".xml"
		end_extension = end_extension.replace("\n", "")
		end_extension = end_extension.replace(" " , "")

		file_directory = directory + end_extension

		print("file_directory : "  + file_directory)

		if os.path.isfile(file_directory):
			print("found existing xml file")
			with open(file_directory, 'r') as f:
				response = f.read()
			# print(horse)

		else:
			response = self.amazon.BrowseNodeLookup(BrowseNodeId = NodeId)
			
			with open(file_directory, "w") as f:
				soup = BeautifulSoup(response, "xml")
				f.write(soup.prettify())
			sleep_time = random.uniform(0,1) + 0.25
			time.sleep(sleep_time)

		print(NodeId)
		print(category)
		print(time.time())
		print("-----------------------------------")
		children_nodes = self.getNodeChildren(response)
		if depth > 10:
			return
		for child_node in children_nodes:
			self.recursiveBrowseNodes(child_node, depth + 1, category)
			
			


	# need functions to interpret the xml
def main():
	amazon_manager = AmazonManager()
	workbook = xlrd.open_workbook('AmazonNodeId.xlsx')
	categories = list()
	for sheet in workbook.sheets():
		number_of_rows = sheet.nrows
		number_of_columns = sheet.ncols
		for i in range(0,number_of_rows):
			# print(sheet.cell(i,0).value)
			name = sheet.cell(i,0).value
			NodeId = sheet.cell(i,3).value 
			category_dict = {}
			category_dict['name'] = name
			category_dict['NodeId'] = NodeId
			categories.append(category_dict)

	check = False
	for category in categories:
		directory = "data/xml/nodes/" + category['name']
		if not os.path.exists(directory):
			os.makedirs(directory)
		if category['NodeId'] == "16310161":
			check = True
		if check:
			amazon_manager.browseNodes(category['NodeId'], category['name'])

main()




