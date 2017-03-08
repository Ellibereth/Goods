import React from 'react';
import {Component} from 'react'
import {StyleSheet, View, Text} from 'react-native';

const url = "https://whereisitmade.herokuapp.com"
const test_url = "http://0.0.0.0:5000"

export default class SubmissionList extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			 submissions :[]
		}
	}

	getSubmissionList() {

		fetch(url + "/getProductSubmissions", {method: "POST",
		headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
		})
		.then((response) => response.json())
		.then((responseData) => {
			console.log(responseData)
			this.setState({submissions : responseData})
		})
		.done();
	}

	componentDidMount(){
		this.getSubmissionList.bind(this)()
	}

	render(){
		return (
			
				<View style = {styles.container}>
					<Text>
						This is the submission list
					</Text>
				</View>
			)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor : "#F5FCFF"
	},
});

