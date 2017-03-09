import React from 'react';
import {Component} from 'react'
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
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

				<View style = {styles.item_container}>
					<TouchableOpacity onPress = {this.returnToListView.bind(this)}>
						<Icon name = "arrow" />
					</TouchableOpacity>
					<TouchableOpacity>
						<Text>
							Time Stamp : {submission.time_stamp}
						</Text>
						<Text>
							Origin : {submission.origin}
						</Text>
					</TouchableOpacity>
				</View>
			)
	}
}

const styles = StyleSheet.create({
	item_container: {
		height : 40,
		backgroundColor : "#F5FCFF",
		flexDirection : "row",
	},
});

