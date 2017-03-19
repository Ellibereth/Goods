var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var AppConstants = require('../constants/AppConstants.js');

var AppActions = {
    addCurrentUser: function(data){
        AppDispatcher.handleViewAction({
          actionType: AppConstants.ADD_CURRENTUSER,
          data: data,
        })
    },
    removeCurrentUser: function(){
        AppDispatcher.handleViewAction({
          actionType: AppConstants.REMOVE_CURRENTUSER
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