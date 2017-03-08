import React from 'react';
import { Platform, Keyboard, AppState, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
        TouchableWithoutFeedback, Alert, Image, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconBadge from 'react-native-icon-badge';
const HIGHLIGHTED = '#90D7ED';
const DEFAULT = 'silver';


export default class BottomTabBar extends React.Component {
	constructor() {
		super();
		this.state = { selected : 'SubmissionForm'};
	}
	submissionFormPress() {
		var currentRoute = this.props.navigator.getCurrentRoutes().pop().href;
		if (this.state.selected != 'SubmissionForm')
			this.navigate.bind(this)("SubmissionForm");

		this.setState({ selected : 'SubmissionForm' });
	}
	submissionListPress() {
		if (this.state.selected != 'SubmissionList') {
			this.navigate.bind(this)("SubmissionList");
		}
		this.setState({ selected : 'SubmissionList' });
	}
	navigate(href) {
		this.props.navigator.replace({
	        href: href
	    })
	}
	// componentWillReceiveProps(nextProps){}
	// componentDidMount() {	}
	// componentWillMount() {}
	// componentWillUnmount() {}
	render() {
		var selected = this.state.selected;
		var submission_form = selected == 'SubmissionForm' ? HIGHLIGHTED : DEFAULT;
		var submission_list = selected == 'SubmissionList' ? HIGHLIGHTED : DEFAULT;
			return (
				<View style = {styles.container}>
					<TouchableWithoutFeedback style={styles.tab} onPress={this.submissionFormPress.bind(this)}>
						<View style={styles.tab_content}>
							<Icon name = "md-home" size={25} color={submission_form}/>
							<Text style={[{color: submission_form}, styles.tab_text]}>Form</Text>
						</View>
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback style={styles.tab} onPress={this.submissionListPress.bind(this)}>
						<View style={styles.tab_content}>
							<Icon name = "md-settings" size={25} color={submission_list}/>
							<Text style={[{color: submission_list}, styles.tab_text]}>List</Text>
						</View>
					</TouchableWithoutFeedback>
				</View>
				)
	}
}
const styles = StyleSheet.create({
	container : {
		flex : 0.1,
		flexDirection:'row',
		borderTopWidth : 1,
		borderTopColor : 'silver',
		backgroundColor : 'white',
		justifyContent: "space-around",
		alignItems : 'center'
	},
	tab : {
		flex: 1,
		alignItems : 'center',
		justifyContent : 'center'
	},
	tab_content : {
		flex: 1,
		alignItems : 'center',
		justifyContent : 'center'
	},
	tab_text : {
		fontSize : 12,
		fontWeight: 'bold'
	},
})
