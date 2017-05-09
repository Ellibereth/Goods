
import csv


output_file = "request_speed_output.csv"
AVERAGE = "average"
REQUEST = "request name"
# for now this file just checks how long post requests take
def parseLogs():
	all_data = {}
	with open("request_speed.csv", "r") as f:
		spamreader = csv.reader(f, delimiter=',', quotechar='|')
		for row in spamreader:
			if row[0] == "POST":
				# add to the total and increment the size
				if all_data.get(row[1]):
					all_data[row[1]] = [all_data[row[1]][0] + 1, float(all_data[row[1]][1]) + float(row[2])]
				else:
					all_data[row[1]] = [1, float(row[2])]

	averages = []
	for request in all_data.keys():
		averages.append({
			AVERAGE : all_data[request][1] / all_data[request][0],
			REQUEST : request
		})

	sorted_list = sorted(averages, key=lambda k: k[AVERAGE], reverse = True)

	with open(output_file, "w") as f:
		writer = csv.writer(f)
		for row in sorted_list:
			writer.writerow([row[REQUEST], row[AVERAGE]])


if __name__ == '__main__':
	parseLogs()


