import sys
from scraping.impl.amazon.amazon_processor import AmazonProcessor


if __name__ == "__main__":
	# reads the number of processors from command line
	try:
		num_processors = int(sys.argv[1])
	except:
		num_processors = 10
	processor = AmazonProcessor(num_processors)
	processor.main()
	