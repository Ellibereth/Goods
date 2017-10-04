
import React from 'react';
import {
	Platform, 
	StyleSheet,
	Text,
	View,
	Image,
	TouchableHighlight
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome'
import {Actions} from 'react-native-router-flux'


export default class Navbar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	
	componentDidMount() {

	}

	render() {
		const logo_src = 'https://s3-us-west-2.amazonaws.com/edgarusahomepage/linda5.png'
			return (
				<View>
					<View style = {styles.status_bar}/>
					<View style = {styles.container}>	
						<View style = {styles.left_section}>
							<TouchableHighlight onPress = {()=> Actions.pop()}>
								<Icon 
								size = {20}
								style = {styles.icon} name = "chevron-left"/>
							</TouchableHighlight>
							<View style = {{padding : 8}}/>
							<Icon 
							size = {20}
							style = {styles.icon} name = "search"/>
						</View>
						<View style = {styles.middle_section}>
							<TouchableHighlight onPress = {()=> Actions.home()}>
									<Text style = {styles.title}> Edgar USA </Text>
							</TouchableHighlight>
						</View>
						<View style = {styles.right_section}>
							<Icon size = {20}
							style = {styles.icon} name = "shopping-cart"/>
						</View>
					</View>

				</View>
			)
	}
}


const colors = {
    defaultTextAndIconColor: '#FFFFFF',
};

const styles = StyleSheet.create({
    container: {
        // height: (Platform.OS === 'ios') ? 30 : 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
        backgroundColor: 'grey'
    },
    left_section : { 
    	flex: 0.333333333334,
    	alignItems:  "flex-start",
    	paddingLeft : 10,
    	flexDirection : 'row'
    },
    middle_section : { 
    	flex: 0.333333333334,
    	alignItems:  "center",

    },
    right_section : {
    	flex: 0.333333333333,	
    	alignItems:  "flex-end",
    	paddingRight: 10
    },
    status_bar : {
    	height: 20,
    	backgroundColor: 'grey'
    },
    icon : {
    	color : 'white',
    },
    title : {
    	color : 'white',
    	fontSize : 16,
    	fontWeight : 'bold'
    	// textAlign : 'center'
    }
});

