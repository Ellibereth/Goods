import React from 'react';
import {Button, StyleSheet, Text, View, AsyncStorage } from 'react-native';
import {Actions, Stack, Scene, Router} from 'react-native-router-flux';
import {connect} from 'react-redux'
import { ActionCreators } from  './actions'
import {bindActionCreators} from 'redux'

import ScreenContainer from './components/Misc/ScreenContainer'
import HomeScreen from './components/Home/HomeScreen'
import LoginScreen from './components/Account/Login/LoginScreen'
import ProductScreen from './components/Product/ProductScreen'
import SalesScreen from './components/Listings/SalesScreen'
import Navbar from './components/Navigation/Navbar'
import SettingsScreen from './components/Account/Settings/SettingsScreen'
import ContactScreen from './components/Edgar/ContactScreen'
import AboutScreen from './components/Edgar/AboutScreen'

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
	return {
		user : state.user,
		home_products : state.home_products
	}
}

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show_tab_bar : true,
		}
	}

	loadUser(jwt) {
		this.props.loadUserInfo(jwt)
	}

	componentDidMount(){
		var jwt = AsyncStorage.getItem('jwt')
		.then((jwt) => {
			this.props.loadUserInfo(jwt)
		})
	}





	render() { 
		return (
			<ScreenContainer show_tab_bar = {this.state.show_tab_bar}>
				<Router navBar = {Navbar}>
					<Scene key="root">
						<Scene {...this.props} 
						  key="home" component={HomeScreen} title = "Home" />
				    	<Scene {...this.props} 
				    	loadUser = {this.loadUser.bind(this)}
				    	key="login" component={LoginScreen} title="Login" />
				    	<Scene {...this.props} 
				    	key="sales" component={SalesScreen} title="Sales" />
				    	<Scene {...this.props} 
				    	key="product" component={ProductScreen} title="Product" />
				    	<Scene {...this.props} 
				    	key="settings" component={SettingsScreen} title="Account" initial = {true} />
				    	<Scene {...this.props} 
				    	key="contact" component={ContactScreen} title="Contact" />
				    	<Scene {...this.props} 
				    	key="about" component={AboutScreen} title="About" />
				    </Scene>
				</Router>
			</ScreenContainer>
				
			
		);
	}
}



export default connect(mapStateToProps, mapDispatchToProps)(Main);

