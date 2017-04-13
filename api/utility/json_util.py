from flask import jsonify

class JsonUtil:
	@staticmethod
	def failure(error_message):
		return jsonify({"success" : False, "error" : error_message})

	@staticmethod
	def success(key, data):
		return jsonify({"success" : True, key : data})