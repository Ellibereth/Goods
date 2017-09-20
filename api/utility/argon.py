"""
: wrapper module for Argon2
"""

from passlib.hash import argon2

class Argon:
	"""
	: wrapper class for argon2 hashing
	"""
	def argonHash(pre_hash):
		"""
		: returns the hash of pre_hash using argon2
		"""
		return argon2.using(rounds=4).hash(pre_hash)

	def argonCheck(pre_hash, post_hash):
		"""
		: checks if pre_hash matches post_hash 
		: returns result of this test
		"""
		return argon2.verify(pre_hash, post_hash)