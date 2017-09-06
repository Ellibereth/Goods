import React from 'react';
import {Provider} from 'react-redux'
import {createStore, applyMiddleware, combineReduxers, compose} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'
import reducer from './app/reducers'
import Main from './app/Main.js'

const loggerMiddleware = createLogger({predicate : (getState, action) => __DEV__});

function configureStore(initialState){
	const enhancer = compose(
		applyMiddleware(
			thunkMiddleware,
			// loggerMiddleware
		)
	)
	return createStore(reducer, initialState, enhancer);
} 


const store = configureStore({});



// this is the app that gets written to registry
export default class App extends React.Component {
	render () {
		return (
			<Provider store = {store}>
				<Main />
			</Provider>
		)
	}
}

