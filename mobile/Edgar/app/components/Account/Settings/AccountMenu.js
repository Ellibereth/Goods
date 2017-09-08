
import React from 'react';
import {Component} from 'react'
import {TouchableHighlight, Text, View, Button, AsyncStorage} from 'react-native';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import SettingsList from 'react-native-settings-list'
import {Actions} from 'react-native-router-flux'



export default class AccountMenu extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
		this.onLogout = this.onLogout.bind(this);
	}
	onLogout() {
		this.props.logoutUser()
	}

	

	render() {
		return (
			
				<View style={{backgroundColor:'white',flex:1}}>
					<View style={{flex:1, marginTop:20}}>
						<SettingsList>
							<SettingsList.Item
								title='Not Signed In'
								arrowIcon = {(
										<View style = {{"padding" : 8}}>
											<TouchableHighlight style ={{
												flex:  1,
												flexDirection : "column",
												alignItems : "center",
												justifyContent : "center",
												backgroundColor : "black",
												borderRadius : 6,
												padding: 6
											}}
											onPress = {()=> Actions.signin()}>
												<Text
												style = {{"color" : "white"}}
												> Sign In </Text>
											</TouchableHighlight>
										</View>
									)}
								/>
							<SettingsList.Header headerText='Different Grouping' headerStyle={{color:'white'}}/>
							<SettingsList.Item title='About Edgar USA' onPress = {()=>Actions.about()} />
							<SettingsList.Item title='Contact Us' onPress = {()=>Actions.contact()} />

							
							{this.props.user &&
								<SettingsList.Header headerText='Different Grouping' headerStyle={{color:'white'}}/>
							}
							{this.props.user &&
								<SettingsList.Item title = "Logout"
								hasNavArrow = {false}
								onPress = {this.onLogout}
	            				titleStyle={{color:'red', textAlign : "center"}}/>
            				}

						</SettingsList>
					</View>
				</View>

		)
	}
}





