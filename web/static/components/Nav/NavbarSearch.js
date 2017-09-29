var React = require('react')
var ReactDOM = require('react-dom')
import AppStore from '../../stores/AppStore'


export default class NavbarSearch extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			search_text : '',
		}
		this.search = this.search.bind(this)
	}

	onKeyPress(event) {
		if (event.key == 'Enter'){
			this.search(event)
		}
	}

	onSearchChange(event) {
		this.setState({search_text : event.target.value})
	}

	search(event) {
		if (this.state.search_text){
			window.location.href = '/search/' + this.state.search_text
		}
	}

	componentDidMount(){
		const url = window.location.href
		var splits = url.split("/")
		var last_arg = splits.pop()
		var second_last_arg = splits.pop()
		if (second_last_arg == "search") {
			this.setState({search_text : last_arg.split('%20').join(" ")})	
		}	
	}

	render() {
		return (
			<div className="input-group input-group-lg">
				<span onClick = {this.search} name = "search_button"
				className="input-group-addon search-button" id="basic-addon1">
					<span className = "glyphicon glyphicon-search" />
				</span>
				<input 
					value = {this.state.search_text}
					id = "edgar_search_bar"
					type="text" className="form-control" 
					placeholder="Search"
					aria-describedby="basic-addon1"
					onChange = {this.onSearchChange.bind(this)}
					onKeyPress = {this.onKeyPress.bind(this)}
				/>		
			</div>
		)
	}
}