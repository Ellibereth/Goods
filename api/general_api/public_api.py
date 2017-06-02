from flask import Blueprint, jsonify, request
from api.utility.json_util import JsonUtil
from api.models.home_image import HomeImage

public_api = Blueprint('public_api', __name__)






@public_api.route('/getPublicHomeImages', methods = ['POST'])
def getPublicHomeImages():
	home_images = HomeImage.query.filter_by(live = True).all()
	return JsonUtil.successWithOutput({
			"images" : [home_image.toPublicDict() for home_image in home_images]
	})

