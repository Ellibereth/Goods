from flask import jsonify
from api.utility.jwt_util import JwtUtil

class JsonUtil:
	@staticmethod
	def failure(error_message = ""):
		return jsonify({"success" : False, "error" : error_message})

	@staticmethod
	def success(key = None, data = None):
		if key == None:
			return jsonify({"success" : True})
		else:	
			return jsonify({"success" : True, key : data})

	@staticmethod
	def successWithOutput(output_dict = None):
		if output_dict == None:
			return jsonify({"success" : True})
		json_output = {}
		json_output['success'] = True
		for key in output_dict.keys():
			if key != "success" and key != "jwt_dict":
				json_output[key] = output_dict[key]
		if json_output.get('jwt_dict'):
			json_output['jwt'] = JwtUtil.create_jwt(json_output.get('jwt_dict'))
		return jsonify(json_output)

	@staticmethod
	def jwt_failure():
		return jsonify({"sucess" : False, "error" : "Invalid Authentication"})

	@staticmethod
	def failureWithOutput(output_dict = None):
		if output_dict == None:
			return jsonify({"success" : False})
		json_output = {}
		json_output['success'] = False
		for key in output_dict.keys():
			if key != "success":
				json_output[key] = output_dict[key]
		return jsonify(json_output)
