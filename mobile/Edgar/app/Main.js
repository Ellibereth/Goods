import React from 'react';
import {Button, StyleSheet, Text, View, AsyncStorage } from 'react-native';
import {Actions, Stack, Scene, Router} from 'react-native-router-flux';
import {connect} from 'react-redux'
import { ActionCreators } from    './actions'
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
import CartScreen from './components/Cart/CartScreen'
import CheckoutScreen from './components/Cart/CheckoutScreen'
import CartIcon from './components/Navigation/CartIcon'
import OrderConfirmedScreen from './components/Cart/OrderConfirmedScreen'
import OrdersScreen from './components/Account/Orders/OrdersScreen'

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
	return {
		initial_fetch_done : state.initial_fetch_done
	}
}

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
		this.getProductScene = this.getProductScene.bind(this);
		this.getCheckoutScene = this.getCheckoutScene.bind(this);
		this.getCartScene = this.getCartScene.bind(this);
		this.getOrderConfirmedScene = this.getOrderConfirmedScene.bind(this)
	}

	

	componentDidMount(){
		AsyncStorage.getItem('jwt').then((jwt) => {
			this.props.loadUser(jwt)
		})
	}

	getTabIcon(name) {
		return (
			<Icon name = {name}
			size = {24}
			/>
		)
	}

	getProductScene(){
		return (
			<Scene {...this.props} 
			hideTabBar = {true}
			key="product" component={ProductScreen} 
			title="Product" />
		)
	}

	getCartScene(){
		return (
					<Scene {...this.props} 
					hideTabBar = {true} key="cart"

					component={CartScreen}title = "Cart"/>

		)
	}

	getOrderConfirmedScene(){
		return (
				<Scene {...this.props}
				hideTabBar = {true}
				key = "order_confirmed"
				component = {OrderConfirmedScreen}
				title = {"Order Confirmed"}/>
			)
	}

	getCheckoutScene(){
		return (
				<Scene {...this.props}
					// remove this later
					// put for testing checkout
					// initial = {true}


					hideTabBar = {true}
					key = "checkout" 
					component = {CheckoutScreen} title = "Checkout"/>
			)
	}



	
	render() { 

		var product_scene = this.getProductScene()
		var cart_scene = this.getCartScene()
		var checkout_scene = this.getCheckoutScene()
		var order_confirmed_scene = this.getOrderConfirmedScene()

		if (!this.props.initial_fetch_done) return <View/>
		return (
			<Router>
				<Scene key="root" 
				// navBar = {Navbar} 
				tabs = {true}
				renderRightButton = {() => (<CartIcon/>)}
				>


					<Scene title = "Home" key = "home" initial = {true} 
					icon = {()=> this.getTabIcon("home")} >
						<Scene {...this.props} 
						key="home" component={HomeScreen} title = "Home" />
						{product_scene}
						{cart_scene}
						{checkout_scene}
						{order_confirmed_scene}
					</Scene>

					
					<Scene title = "Sales" key = "sales"
					icon = {()=> this.getTabIcon("dollar")}>
						<Scene {...this.props}    title="Sales" 
						key="sales" component={SalesScreen} />
						{product_scene}
						{cart_scene}
						{checkout_scene}
						{order_confirmed_scene}
					</Scene>

					<Scene key = "account" title = "Account"
					icon = {()=> this.getTabIcon("user")}>
						

						<Scene {...this.props} initial = {true}
						key="account" component={AccountScreen} title="Account"
						/>

						<Scene {...this.props}
							hideTabBar = {true}
							key = "orders" component = {OrdersScreen} title = "Orders"/>


						<Scene {...this.props} 
						key="contact" component={ContactScreen} title="Contact" hideTabBar = {true} />
						<Scene {...this.props} 
						key="about" component={AboutScreen} title="About"    hideTabBar = {true} />

						
						<Scene {...this.props} 
						key="signin" component={SignInScreen} title="Sign In"    hideTabBar = {true} />

						<Scene {...this.props} 
						key="login" component={LoginScreen} title="Login"    hideTabBar = {true} />
						
						<Scene {...this.props} 
						key="register" component={RegisterScreen} title="Register"    hideTabBar = {true} />
						{cart_scene}
						{checkout_scene}
					</Scene>

					

				</Scene>
			</Router>
				
			
		);
	}
}



export default connect(mapStateToProps, mapDispatchToProps)(Main);

