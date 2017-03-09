
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
	AllLabels = list()
	CategoryNodeId = 'category_node_id'
	AllLabels.append(CategoryNodeId)
	Category = 'category'
	AllLabels.append(Category)
	Origin = 'origin'
	AllLabels.append(Origin)
	Manufacturer = 'manufacturer'
	AllLabels.append(Manufacturer)
	Asin = 'asin'
	AllLabels.append(Asin)
	Price = 'price'
	AllLabels.append(Price)
	Model = 'model'
	AllLabels.append(Model)
	ProductName = 'product_name'
	AllLabels.append(ProductName)
	Upc = 'upc'

	AmazonDetailSearchTargets = [Origin, Manufacturer, Model, Asin, Upc]

	def getAmazonDetailSearchTargets():
		return AmazonDetailSearchTargets

	def getLabels():
		return Labels.AllLabels

	def hasLabel(label):
		return label in Labels.AllLabels

	def main():
		print("this is a label!")


