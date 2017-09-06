import createReducer from '../lib/createReducer'
import * as types from '../actions/types'

export const home_products = createReducer([], {
	[types.SET_HOME_PRODUCTS](state,action){
		return action.products;
	}
})