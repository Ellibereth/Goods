from flask import Blueprint, jsonify, request
import time
import base64

from ..utility.stripe_api import StripeManager
from ..utility.table_names import ProdTables

from api.models.shared_models import db

from api.models.user import User
from api.models.market_product import MarketProduct
from api.utility.json_util import JsonUtil
from api.utility.labels import PaymentLabels as Labels
from api.utility.jwt_util import JwtUtil
from api.general_api import decorators




payment_api = Blueprint('payment_api', __name__)



	

