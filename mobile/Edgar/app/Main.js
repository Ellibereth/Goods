import React from 'react';
import {View, AsyncStorage } from 'react-native';
import {Actions, ActionConst, Scene, Router} from 'react-native-router-flux';
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
import BackIcon from './components/Navigation/BackIcon'
import OrderConfirmedScreen from './components/Cart/OrderConfirmedScreen'
import OrdersScreen from './components/Account/Orders/OrdersScreen'
import SettingsScreen from './components/Account/Settings/SettingsScreen'
import UpdatePersonalScreen from './components/Account/Settings/Edit/UpdatePersonalScreen'
import UpdatePasswordScreen from './components/Account/Settings/Edit/UpdatePasswordScreen'

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
		this.state = {}
	}

	

	componentDidMount(){
		AsyncStorage.getItem('jwt').then((jwt) => {
			this.props.loadUser(jwt)
		})
	}

	getTabIcon(name) {
		return (
			<Icon name = {name} size = {24}/>
		)
	}
	
	render() { 


		if (!this.props.initial_fetch_done) return <View/>
			
		return (
			<Router>
				<Scene key="root"  
				hideNavBar = {true}
				>
					<Scene title = "Cart" 
					/* toggle these for testing */
					key = "cart"
					// key = "checkout"
					renderLeftButton = {() => (<BackIcon/>)}>

						<Scene {...this.props} 
						initial = {true}
						hideTabBar = {true} key="cart"
						component={CartScreen} title = "Cart"/>
						<Scene {...this.props}
							hideTabBar = {true} 
							key = "checkout" 
							component = {CheckoutScreen} title = "Checkout"/>
						
						<Scene {...this.props}
						hideTabBar = {true}
						key = "order_confirmed"
						component = {OrderConfirmedScreen}
						title = {"Order Confirmed"}/>
					</Scene>


					<Scene {...this.props}
					title = "Product" key = "product"
					renderLeftButton = {() => (<BackIcon />)} 
					renderRightButton = {() => (<CartIcon/>)}
					>	
						<Scene {...this.props}
						title = "Product" key = "product"
						component = {ProductScreen}
						hideTabBar = {true}/>	
					</Scene>	

					<Scene title = "Home" key = "home" 
					// this should be true if we're going LIVE
					initial = {true}
					tabs = {true} renderRightButton = {() => (<CartIcon/>)}>

						<Scene title = "Home" key = "home" 
						icon = {()=> this.getTabIcon("home")} 
						component = {HomeScreen}/>
						

					
						<Scene title = "Sales" key = "sales"
						icon = {()=> this.getTabIcon("dollar")}>
							<Scene {...this.props}    title="Sales" 
							key="sales" component={SalesScreen} />
							
						</Scene>

						<Scene key = "account"
						title = "Account" 
						icon = {()=> this.getTabIcon("user")} >

							<Scene {...this.props} initial = {true}
								key="account" component={AccountScreen} title="Account"
								/>
							<Scene {...this.props} 
							hideTabBar = {true}
							key="update_password" component={UpdatePasswordScreen} title="Password"
							/>
							<Scene {...this.props} 
							hideTabBar = {true}
							key="update_personal" component={UpdatePersonalScreen} title="Update Personal"
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
							
							<Scene {...this.props} loadUser = {this.props.loadUser}
							key="register" component={RegisterScreen} title="Register"    hideTabBar = {true} />

							<Scene {...this.props} loadUser = {this.props.loadUser}
							key="settings" component={SettingsScreen} title="Settings"    hideTabBar = {true} />
							
						</Scene>
					</Scene>
	
				</Scene>
			</Router>
				
			
		);
	}
}



export default connect(mapStateToProps, mapDispatchToProps)(Main);

