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
import sys


def removeDuplicateAsins():
	existing_list = list()
	with open('data/asin_list.csv', 'r') as f:
			reader = csv.reader(f)
			your_list = list(reader)
			for item in your_list:
				existing_list.append(item[0])

	existing_list.sort()
	length = len(existing_list)
	i = 0
	while i < len(existing_list) - 1:
		if existing_list[i] == existing_list[i+1]:
			existing_list.pop(i+1)
		elif len(existing_list[i+1]) != 10:
			existing_list.pop(i+1)
		else:
			i = i + 1

				
	with open('data/cleaned_asin_list.csv', 'w') as clean_list:
		writer = csv.writer(clean_list)
		for asin in existing_list:
			writer.writerow([asin])


		 
def main():
	removeDuplicateAsins()

main()

