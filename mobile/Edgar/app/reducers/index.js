import {combineReducers} from 'redux'
import * as usersReducer from './users'
import * as productsReducer from './products'


export default combineReducers(Object.assign({},
	usersReducer,
	productsReducer,
));