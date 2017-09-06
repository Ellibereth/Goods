import createReducer from '../lib/createReducer'
import * as types from '../actions/types'


export const user = createReducer({}, {
	[types.SET_USER_INFO](state,action){
		if (action.user) {
			return action.user;	
		}
		else {
			return {}
		}
		
	}
})


