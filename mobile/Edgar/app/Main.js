import React from 'react';
import {Button, StyleSheet, Text, View, AsyncStorage } from 'react-native';
import {Actions, Stack, Scene, Router} from 'react-native-router-flux';
import {connect} from 'react-redux'
import { ActionCreators } from  './actions'
import {bindActionCreators} from 'redux'
import Icon from 'react-native-vector-icons/FontAwesome'

import HomeScreen from './components/Home/HomeScreen'
import LoginScreen from './components/Account/Login/LoginScreen'
import ProductScreen from './components/Product/ProductScreen'
import SalesScreen from './components/Listings/SalesScreen'
import Navbar from './components/Navigation/Navbar'
import AccountScreen from './components/Account/Settings/AccountScreen'
import ContactScreen from './components/Edgar/ContactScreen'
import AboutScreen from './components/Edgar/AboutScreen'
import SignInScreen from './components/Account/SignInScreen'
import RegisterScreen from './components/Account/Login/RegisterScreen'

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
	return {
		user : state.user,
		initial_fetch_done : state.initial_fetch_done
	}
}

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	loadUser(jwt) {
		this.props.loadUserInfo(jwt)
	}

	componentDidMount(){
		AsyncStorage.getItem('jwt')
		.then((jwt) => {
			this.props.loadUserInfo(jwt)
		})
	}

	getTabIcon(name) {
		return (
			<Icon name = {name}
			size = {24}
			/>
		)
	}





	render() { 
		if (!this.props.initial_fetch_done) return <View/>
		return (
			<Router>
				<Scene key="root" 
				// navBar = {Navbar} 
				tabs = {true} >

					<Scene title = "Home" key = "home" initial = {true} 
					icon = {()=> this.getTabIcon("home")}>
						<Scene {...this.props} 
					  	key="home" component={HomeScreen} title = "Home" />
					  	<Scene {...this.props} 
						key="product" component={ProductScreen} title="Product" />
					</Scene>

					
					<Scene title = "Sales" key = "sales"
					icon = {()=> this.getTabIcon("dollar")}>
						<Scene {...this.props}  title="Sales" 
						key="sales" component={SalesScreen} initial = {true}/>
					</Scene>

					
					

					<Scene key = "account" title = "Account"
					icon = {()=> this.getTabIcon("user")}>
						<Scene {...this.props} 
						key="account" component={AccountScreen} title="Account"
						/>
						<Scene {...this.props} 
						key="contact" component={ContactScreen} title="Contact" hideTabBar = {true} />
						<Scene {...this.props} 
						key="about" component={AboutScreen} title="About"  hideTabBar = {true} />

						
						<Scene {...this.props} 
						key="signin" component={SignInScreen} title="Sign In"  hideTabBar = {true} />

						<Scene {...this.props} 
						loadUser = {this.loadUser.bind(this)}
						key="login" component={LoginScreen} title="Login"  hideTabBar = {true} />
						
						<Scene {...this.props} 
						key="register" component={RegisterScreen} title="Register"  hideTabBar = {true} />
					</Scene>
				</Scene>
			</Router>
				
			
		);
	}
}



export default connect(mapStateToProps, mapDispatchToProps)(Main);

