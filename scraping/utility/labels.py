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
	AmazonOrigin = 'amazon_origin'
	AllLabels.append(AmazonOrigin)
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
	AllLabels.append(Upc)
	Brand = 'brand'
	AllLabels.append(Brand)

	BrandNodeId = 'brand_node_id'
	AllLabels.append(BrandNodeId)

	FinalOrigin = 'final_origin'
	AllLabels.append(FinalOrigin)

	AmazonDetailSearchTargets = [AmazonOrigin, Manufacturer, Model, Asin, Upc]
	def getAmazonDetailSearchTargets():
		return AmazonDetailSearchTargets

	def getLabels():
		return Labels.AllLabels

	def hasLabel(label):
		return label in Labels.AllLabels

	def main():
		print("this is a label!")


