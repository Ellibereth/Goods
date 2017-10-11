import React from 'react';
import {Component} from 'react'
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native'
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view'


export default class ProductDescription extends Component {

	constructor(props) {
		super(props)
		this.state = {	

		}
	}


	

	render() {
		return (
			<View style = {styles.description_container}>
					{this.props.product.description.split("\n").map((line, index) => {
						if (line) {
							return (
									<View style = {styles.bullet_container}  key = {index}>
										<Text style = {styles.description_bullet}>{'\u2022'}</Text>
										<Text style = {styles.description_text}> 
											{line}
										</Text>		
									</View>
								)
							}
						}
					)}
				
			</View>
		
		);
  	}
}


const styles = StyleSheet.create({
	description_container : {
		marginTop : 6,
		marginBottom: 6,
		paddingHorizontal : 8

	},
	description_title : {
		margin : 12,
		fontSize : 24,
		textAlign : 'center'
	},
	description_text : {
		textAlign : 'left',
		fontSize : 16,
		color : 'black',
		paddingRight: 8
	},
	description_bullet : {
		paddingLeft : 6,
		paddingRight : 12,
		fontSize : 16
	},
	bullet_container : {
		paddingVertical : 12,
		paddingHorizontal : 16,
		flexDirection : 'row',
	}
});
			






