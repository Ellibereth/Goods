var React = require('react');
var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var AppConstants = require('../constants/AppConstants.js');
var assign = require('object-assign');
var ee = require('event-emitter');

var _currentUser = (localStorage.CurrentUser) ? JSON.parse(localStorage.CurrentUser) : "";
var _ip = ""


function _loadCurrentUser(data, jwt) {
  	_currentUser = data;
  	localStorage.CurrentUser = JSON.stringify(_currentUser);
  	localStorage.jwt = jwt;
}	
function _removeCurrentUser() {
  	_currentUser = "";
  	localStorage.CurrentUser = JSON.stringify(_currentUser);
  	localStorage.jwt = "";
}
function _addIp(data) {
	_ip = data;
	if (_ip != null)
		localStorage.Ip = JSON.stringify(_ip);
}

var emitter = ee({}), listener;

class AppStore extends React.Component {
	constructor() {
		super();
		AppDispatcher.register(this.dispatcherCallback.bind(this));
	}
	getCurrentUser() {
		return _currentUser;
	}
	getIp() {
		return _ip;
	}
	emitUserChange() {
	  	emitter.emit('userchange');
	}
	addUserChangeListener(callback) {
	  	emitter.on('userchange', listener = callback);
	}
	removeUserChangeListener(callback) {
	  	emitter.off('userchange', callback);
	}
	dispatcherCallback(payload) {
		var action = payload.action;
		switch(action.actionType) {
		    case AppConstants.ADD_CURRENTUSER:
			    _loadCurrentUser(action.data, action.jwt);
			    this.emitUserChange.bind(this)();
			    break;
		    case AppConstants.REMOVE_CURRENTUSER:
		    	_removeCurrentUser();
		    	this.emitUserChange.bind(this)();
		    	break;
		    case AppConstants.ADD_IP:
		    	_addIp();
		    	break;
		    default:
		      	return true;
		}
		return true;
	}
}

export default new AppStore();


