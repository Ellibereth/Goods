
import React from 'react';
import {Component} from 'react'
import {View, Text, ScrollView, StyleSheet, Linking} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'


const HOME_TAG = "Home_Page"
const img_src = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"

function mapStateToProps(state) {
	return {
		user : state.user,
	}
}


const MORE_INFO_URL = "https://www.ftc.gov/tips-advice/business-center/guidance/complying-made-usa-standard"
class MadeInUsaScreen extends Component {
	

	constructor(props) {
		super(props)
		this.state = {
		
		}
		
	}




	render() {
		return (
			
				<View style = {{"flex" : 1}}>
					<Text style = {styles.text}> 
						This section will describe exactly what it means to be Made in USA. It will go into details on entire manufactured including parts, primarily manufacatured with imported parts, and completely imported. We guarantee that none of our products are imported by these strict guidelines. Click 
						<Text onPress={() => Linking.openURL(MORE_INFO_URL)}
						 style = {{color : 'skyblue'}}> here </Text>
						 to learn more.
					</Text>
				</View>
			

		)
	}
}

const styles = StyleSheet.create({
	text : {
		fontSize : 20,
		padding: 12,
	}
})


export default connect(mapStateToProps)(MadeInUsaScreen);

