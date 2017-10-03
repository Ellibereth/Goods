import React from 'react';
import {Component} from 'react'
import {TouchableHighlight, Text, View, Button, AsyncStorage, StyleSheet} from 'react-native';
import SettingsList from 'react-native-settings-list'
import {Actions, ActionConst} from 'react-native-router-flux'

export default class AccountMenu extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
		this.onLogout = this.onLogout.bind(this);
	}
	onLogout() {
		this.props.logoutUser()
		Actions.home({type : ActionConst.RESET})
	}

	render() {
		return (
			
				<View style={{backgroundColor:'#EFEFF4',flex:1}}>
					<View style={{flex:1, marginTop:20}}>
						<SettingsList
						borderColor='silver'
						>
							{!this.props.user &&
								<SettingsList.Item
								style = {styles.list_item}
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
												padding: 6,
											}}
											onPress = {()=> Actions.signin()}>
												<Text
												style = {{"color" : "white"}}
												> Sign In </Text>
											</TouchableHighlight>
										</View>
									)}
								/>
							}
							

							{this.props.user && 
								<SettingsList.Header headerStyle={{color:'grey'}}/>
							}

							{this.props.user && 
								<SettingsList.Item title='Account Settings' onPress = {()=>Actions.settings()} />
							}

							<SettingsList.Header headerStyle={{color:'grey'}}/>
							<SettingsList.Item title='About Edgar USA' onPress = {()=>Actions.about()} />
							<SettingsList.Item title='Contact Us' onPress = {()=>Actions.contact()} />

							{this.props.user &&
								<SettingsList.Item title='Past Orders' onPress = {()=>Actions.orders()} />
							}

							
							{this.props.user &&
								<SettingsList.Header headerText='' headerStyle={{color:'grey'}}/>
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


const styles = StyleSheet.create({
	list_item : {
			borderColor : '#c8c7cc'
		}
})



