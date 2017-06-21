var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../stores/AppStore'


export default class SettingsInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}


	render() {
		var col_size = this.props.label_col_size ? this.props.label_col_size : "2"
		var col_class = "col-md-" + col_size

		return (
			<div className = "row">
				<div className="form-group">
					<label tabindex= {this.props.tabindex} className={col_class + " control-label text-left"} for="Name">
						{this.props.label}
					</label>    
					<div className="col-md-6">
						<input 
						className="form-control input-md" onKeyPress = {this.props.onKeyPress} 
						value = {this.props.value} field = {this.props.field} onChange = {this.props.onChange}
					 	 name= {this.props.field} type= {this.props.input_type} placeholder= {this.props.placeholder}/>
					</div>
				</div>
			</div>
		)
	}
}

