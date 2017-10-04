import createReducer from '../lib/createReducer'
import * as types from '../actions/types'


export const user = createReducer("", {
	[types.SET_USER_INFO](state,action){
		if (action.user) {
			return action.user;	
		}
		else {
			return ""
		}
		
	}
})

export const initial_fetch_done = createReducer(false, {
	[types.SET_USER_INFO](state,action){
		return true;
	}
})

export const jwt = createReducer("", {
	[types.SET_JWT_INFO](state,action){
		if (action.jwt){
			return action.jwt
		}
		else {
			return ""
		}
	}
})


