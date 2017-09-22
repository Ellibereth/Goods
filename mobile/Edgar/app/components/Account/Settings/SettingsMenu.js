import React from 'react';
import {Component} from 'react'
import {TouchableHighlight, Text, View, Button, AsyncStorage, StyleSheet} from 'react-native';
import SettingsList from 'react-native-settings-list'
import {Actions} from 'react-native-router-flux'

export default class SettingsMenu extends Component {
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
			
				<View style={{backgroundColor:'#EFEFF4',flex:1}}>
					<View style={{flex:1, marginTop:20}}>
						<SettingsList
						borderColor='silver'
						>
							

							<SettingsList.Header headerStyle={{color:'grey'}}/>
							<SettingsList.Item  title='Signed In As'
							arrowIcon = {(
										<View style = {{"padding" : 8,
												flex:  1,
												flexDirection : "column",
												alignItems : "center",
												justifyContent : "center"}}>
											<Text numberOfLines = {1}
											style = {{"color" : "red"}}>
												{this.props.user.email}
											</Text>
										</View>
									)}/>

							<SettingsList.Header headerStyle={{color:'grey'}}/>


							<SettingsList.Item title='Personal' onPress = {()=>Actions.update_personal()} />
							<SettingsList.Item title='Password' onPress = {()=>Actions.update_password()} />

						
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



