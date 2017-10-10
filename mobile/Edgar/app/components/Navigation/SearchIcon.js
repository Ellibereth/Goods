import React from 'react';
import {Component} from 'react'
import {
	View,
	Text,
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import IconBadge from 'react-native-icon-badge'
import SearchModal from './SearchModal'

function mapStateToProps(state) {
	return {
		user : state.user
	}
}

class SearchIcon extends Component {

	constructor(props) {
		super(props)
		this.state = {
			search_modal_visible : false,
		}
	}

	setSearchModal(visible){
		this.setState({search_modal_visible : visible})
	}


	render() {

		return (
			<View>
				<Icon 
					onPress = {() => this.setSearchModal(true)}
					name = "search"
					size = {20}
					style = {{
						paddingLeft : 12,
						padding : 12
					}}
				/>
				
				<SearchModal 
				visible = {this.state.search_modal_visible}
				setSearchModal = {this.setSearchModal.bind(this)}
				/>
			</View>
		)
				
	}
}


export default connect(mapStateToProps)(SearchIcon);
