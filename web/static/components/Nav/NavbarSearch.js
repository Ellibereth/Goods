var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../stores/AppStore'


export default class NavbarSearch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			search_text : "",
		}
		this.search = this.search.bind(this)
	}

	onSearchChange(event) {
		this.setState({search_text : event.target.value})
	}

	search(event) {
		event.preventDefault()
		window.location.href = '/search/' + this.state.search_text
	}

	onKeyPress(event) {
		if (event.key == "Enter"){
			this.search(event)
		}
	}



	render() {
		return (
				<input type="text" className="form-control" 
				placeholder="Search"
				aria-describedby="basic-addon1"
				onChange = {this.onSearchChange.bind(this)}
				onKeyPress = {this.onKeyPress.bind(this)}
				/>		
		);
	}
}