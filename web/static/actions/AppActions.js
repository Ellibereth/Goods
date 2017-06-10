var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var AppConstants = require('../constants/AppConstants.js');

var AppActions = {
    addCurrentUser: function(data, jwt){
        AppDispatcher.handleViewAction({
          actionType: AppConstants.ADD_CURRENTUSER,
          data: data,
          jwt: jwt
        })
    },
    removeCurrentUser: function(){
        AppDispatcher.handleViewAction({
          actionType: AppConstants.REMOVE_CURRENTUSER
        })
    },
    updateCurrentUser : function(data) {
      AppDispatcher.handleViewAction({
          actionType: AppConstants.UPDATE_CURRENTUSER,
          data: data,
        })
    },
    addIp: function(data) {
        AppDispatcher.handleViewAction({
          actionType: AppConstants.ADD_IP,
          data: data
        })
    }
};

module.exports = AppActions;