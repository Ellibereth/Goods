import React from 'react';
import {Component} from 'react'
import {StyleSheet, View, Text, TouchableOpacity, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'

const url = "https://whereisitmade.herokuapp.com"
const test_url = "http://0.0.0.0:5000"

export default class SubmissionList extends React.Component {
	constructor(props){
		super(props)
		this.state = {
		}
	}
	componentDidMount(){
		// this.getSubmissionList.bind(this)()
	}

	returnToListView(){
		this.props.navigator.pop()
	}

	render(){
		var submission = this.props.submission
		return (

				<View style = {styles.container}>
					<TouchableOpacity onPress = {this.returnToListView.bind(this)} style = {{flex : 1}}>
						<Icon name = "chevron-left" size = {20} />
					</TouchableOpacity>
					<View style = {{flex: 1}}/>
					<View style = {{flex : 20}}>
						<Text> Time Stamp : {submission.time_stamp} </Text>
						<Text> Origin : {submission.origin} </Text>
						<Text> Manufacturer : {submission.manufacturer_name} </Text>
						<Text> Product Name : {submission.product_name} </Text>
						<Text> Additional Information: {submission.additional_info} </Text>
						<Text> Contact Information : {submission.contact_information} </Text>
						<Text> Product Name : {submission.product_name} </Text>
						<Text> Image ... coming soon! </Text>
					</View>
				</View>
			)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor : "#F5FCFF",
		paddingTop: 20,
		flexDirection: "column",
		flex: 1
	},
});

