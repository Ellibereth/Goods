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

	openDetailView(){
		this.props.openDetailView(this.props.submission)
	}

	getFormattedTimeStamp(unix_timestamp){
		  var a = new Date(unix_timestamp * 1000);
		  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		  var year = a.getFullYear();
		  var month = months[a.getMonth()];
		  var date = a.getDate();
		  var hour = a.getHours();
		  var min = a.getMinutes();
		  var sec = a.getSeconds();
		  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
		  return time;
	}

	render(){
		var submission = this.props.submission
		var time_stamp = this.getFormattedTimeStamp(submission.time_stamp)
		var is_verified_icon = submission.verified ? <Icon name = "check" size = {20}/> : <Icon name = "close" size = {20}/>
		return (
				<View style = {styles.item_container}>
					<View style = {{flex : 5}}>
						<TouchableOpacity onPress = {this.openDetailView.bind(this)}>
							<View style = {{flexDirection: "column"}}>
								<Text>
									Time Stamp : {time_stamp}
								</Text>
								<Text>
									Product Name : {submission.product_name}
								</Text>
								<Text>
									Image coming soon....
								</Text>
							</View>
						</TouchableOpacity>
					</View>
					<View style = {{flex : 1, alignItems: "flex-end"}}>
						{is_verified_icon}
					</View>
				</View>
			)
	}
}

const styles = StyleSheet.create({
	item_container: {
		height : 80,
		backgroundColor : "#F5FCFF",
		flexDirection : "row",
		justifyContent : "center",
		borderColor : "black",
		borderWidth : 1,
		borderRadius : 5,
		padding: 12
	},
});

