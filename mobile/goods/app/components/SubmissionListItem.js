import React from 'react';
import {Component} from 'react'
import {StyleSheet, View, Text} from 'react-native';
import SubmissionListItem from './SubmissionListItem'

const url = "https://whereisitmade.herokuapp.com"
const test_url = "http://0.0.0.0:5000"

export default class SubmissionList extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			 submissions :[]
		}
	}


	componentDidMount(){
		// this.getSubmissionList.bind(this)()
	}

	render(){
		var submission = this.props.submission
		console.log("submission list item rendered")
		return (
				<Text>
					{submission.time_stamp}
				</Text>
			)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor : "#F5FCFF"
	},
});

