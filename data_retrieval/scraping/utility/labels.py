
import time
import string
import random
import os
import sys
import time

""" 
this file has a list of the allowed tags on products 
All the instance variables will be private
"""

class Labels:
	def __init__(self):
		# self.AllTags = ['category_node_id', 'category', 'origin','manufacturer', 'asin', 'price' ,'model', 'product_name']
		self.AllLabels = list()
		self.CategoryNodeId = 'category_node_id'
		self.AllLabels.append(self.CategoryNodeId)
		self.Category = 'category'
		self.AllLabels.append(self.Category)
		self.Origin = 'origin'
		self.AllLabels.append(self.Origin)
		self.Manufacturer = 'manufacturer'
		self.AllLabels.append(self.Manufacturer)
		self.Asin = 'asin'
		self.AllLabels.append(self.Asin)
		self.Price = 'price'
		self.AllLabels.append(self.Price)
		self.Model = 'model'
		self.AllLabels.append(self.Model)
		self.ProductName = 'product_name'
		self.AllLabels.append(self.ProductName)
		self.Upc = 'upc'

		self.amazon_detail_search_targets = [self.Origin, self.Manufacturer, self.Model, self.Asin, self.Upc]

	def getAmazonDetailSearchTargets(self):
		return self.amazon_detail_search_targets

	def getLabels(self):
		return self.AllLabels

	def main(self):
		print("this is a label!")


