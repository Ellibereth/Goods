import React from 'react';
import {Component} from 'react'
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

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

	openDetailView(){
		this.props.openDetailView(this.props.submission)
	}

	render(){
		var submission = this.props.submission
		return (
				<View style = {styles.item_container}>
					<TouchableOpacity onPress = {this.openDetailView.bind(this)}>
						<Text>
							Time Stamp : {submission.time_stamp}
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
