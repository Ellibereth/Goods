
import React from 'react';
import { } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation'
import {Actions} from 'react-native-router-flux'



const HOME_TAB = 0
const SALE_TAB = 1
const ACCOUNT_TAB = 2

export default class BottomTabBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		};
		this.onTabChange = this.onTabChange.bind(this)
	}
	

	
	componentDidMount() {

	}

	

	onTabChange(newTabIndex) {
		if (newTabIndex == HOME_TAB){
			Actions.home()	

		}
		
		else if (newTabIndex == SALE_TAB) {
			Actions.sales()
		}

		else if (newTabIndex == ACCOUNT_TAB){
			Actions.settings()
		}
		
		
	}

	render() {
			return (
				 <BottomNavigation
				 	activeTab = {ACCOUNT_TAB}
					labelColor="white"
					rippleColor="white"
					style={{ height: 56, elevation: 8, position: 'absolute', left: 0, bottom: 0, right: 0 }}
					onTabChange={this.onTabChange}
					>
					<Tab
						barBackgroundColor="#37474F"
						label="Home"
						icon={<Icon size={24} color="white" name="home" />}
					/>
					<Tab
						barBackgroundColor="#37474F"
						label="Sales"
						icon={<Icon size={24} color="white" name="alarm" />}
					/>
					<Tab
						barBackgroundColor="#37474F"
						label="Account"
						icon={<Icon size={24} color="white" name="account-box" />}
					/>
				</BottomNavigation>
			)
	}
}

