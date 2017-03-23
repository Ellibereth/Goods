from bs4 import BeautifulSoup

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


