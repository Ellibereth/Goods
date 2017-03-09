import React from 'react';
import {Component} from 'react'
import {StyleSheet, View, Text, ListView} from 'react-native';
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

	getSubmissionList() {
		console.log("fetching")
		fetch(test_url + "/getProductSubmissions", {method: "POST",
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

	openDetailView(submission){
		this.props.navigator.push({
			href: "SubmissionDetailView",
			submission : submission
		})
	}
	render(){
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		var dataSource = ds.cloneWithRows(this.state.submissions)
		return (
				<View style = {styles.container}>
					<ListView
						dataSource={dataSource}
          				renderRow={(submission) => <SubmissionListItem submission = {submission} openDetailView = {this.openDetailView.bind(this)}/>}
          				enableEmptySections = {true}
					/>
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

