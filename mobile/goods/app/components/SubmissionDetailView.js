import React from 'react';
import {Component} from 'react'
import {StyleSheet, View, Text, TouchableOpacity, Platform, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'

const url = "https://whereisitmade.herokuapp.com"
const test_url = "http://0.0.0.0:5000"

const image_url_base = "/static/images/product_submissions"

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
		var image_src = []
		for (var i = 0; i < submission.num_images; i++){
			image_src.push(url + image_url_base + "/" + submission.image_id + "_" + i + ".png")
		}

		var image_list = []
		for (var i = 0; i < image_src.length; i++){
			image_list.push(
					<View style = {{padding:10}} key ={i}>
						<Image source = {{uri : image_src[i]}}  style = {{height: 60, width: 60}}/>
					</View>
				)
			console.log(image_src[i])
		}


		return (

				<View style = {styles.container}>
					<TouchableOpacity onPress = {this.returnToListView.bind(this)} style = {{flex : 1}}>
						<Icon name = "chevron-left" size = {20} />
					</TouchableOpacity>
					<View style = {{flex: 1}}/>
					<View style = {{flex : 6}}>
						<Text> Time Stamp : {submission.time_stamp} </Text>
						<Text> Origin : {submission.origin} </Text>
						<Text> Manufacturer : {submission.manufacturer_name} </Text>
						<Text> Product Name : {submission.product_name} </Text>
						<Text> Additional Information: {submission.additional_info} </Text>
						<Text> Contact Information : {submission.contact_information} </Text>
						<Text> Product Name : {submission.product_name} </Text>
						<Text> Image ... coming soon! </Text>
					</View>
					<View style = {{flex : 14, padding: 20}}>
						{image_list}
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

