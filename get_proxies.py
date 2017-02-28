
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



def addNewProxies():
	url = "https://www.us-proxy.org/"
	# html = requests.get(url, proxies=urllib.getproxies())
	html = requests.get(url)
	soup = BeautifulSoup(html.text, "html.parser")
	proxy_table = soup.find("table" , {"id" : "proxylisttable"})
	table_rows = soup.find_all("tr")
	proxy_list = list()
	for row in table_rows:
		this_proxy = row.find_all("td")
		if len(this_proxy) > 0:
			proxy_info = this_proxy[0].text + ":" + this_proxy[1].text
			proxy_list.append(proxy_info)

	with open('proxies.csv', 'a') as f:
		writer = csv.writer(f)
		for proxy in proxy_list:
			writer.writerow([proxy])
			
def getRandomProxy(proxy_file):
	with open(proxy_file, 'r') as f:
		reader = csv.reader(f)
		proxy_list = list()
		for row in reader:
			proxy_list.append(row[0])

		random.shuffle(proxy_list)
		return proxy_list[0]


# addNewProxies()
for i in range(1,20):
	print(getRandomProxy("proxies.csv"))

