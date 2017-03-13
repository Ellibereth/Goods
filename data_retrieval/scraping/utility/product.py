
import time
import string
import random
import os
import sys
import time
from utility.labels import Labels

"""" 
this class will represent a product 
depends on Labels class for it's labels
instance variables are private (figure out how to set this later)
"""

class Product:
	def __init__(self):
		self.details = {}

	# if the attribute already exists we overwrite the original one
	def addAttribute(self, label, data):
		if not Labels.hasLabel(label):
			print("doesn't have label")
			return 
		self.details[label] = data

	def removeAttribute(self, label):
		if not Labels.hasLabel(label):
			print("doesn't have label")
			return
		self.details.pop(label)

	def getDetails(self):
		return self.details

	def getAttribute(self, label):
		return self.getDetails().get(label)

	# this will get the detail search targets form 
	def getAmazonDetailSearchTargets(self):
		return Labels.AmazonDetailSearchTargets


	def test(self):
		print("this is a product")

