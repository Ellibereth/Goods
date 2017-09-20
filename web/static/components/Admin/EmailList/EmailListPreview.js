var React = require('react')
var ReactDOM = require('react-dom')
var browserHistory = require('react-router').browserHistory
import AppActions from '../../../actions/AppActions'
import {Button} from 'react-bootstrap'

import {AlertMessages} from '../../Misc/AlertMessages'


const table_row_title = ['Email List Name', 'Number of Users']

export default class EmailListPreview extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			new_email_list_name : ''
		}
	}

	onNewEmailListChange(event) {
		this.setState({new_email_list_name : event.target.value})
	}

	addNewEmailList() {
		var form_data = JSON.stringify({
			new_email_list_name : this.state.new_email_list_name,
			jwt : localStorage.jwt
		})
		$.ajax({
			type: 'POST',
			url: '/addNewEmailList',
			data: form_data,
			success: function(data) {
				if (!data.success) {
					swal(data.error)
				}
				else {
					setTimeout(function() {swal(AlertMessages.CHANGE_WAS_SUCCESSFUL)},500)
					this.setState({new_email_list_name : ''})
				}
			}.bind(this),
			error : function(){
			},
			dataType: 'json',
			contentType : 'application/json; charset=utf-8'
		})
	}


	componentDidMount() {		
	}

	render() {

		var email_list_display = []
		this.props.email_list_data.map((email_list,index) => {
			email_list_display.push(
				<tr>
					<td> <a href = {'yevgeniypoker555/editEmailList/' + email_list.email_list_id}> {email_list.email_list_name} </a></td>
					<td>{email_list.num_subscribers}</td>
				</tr>
			)
		})

		return (
			<div className = "container"> 
				<div className = "row form-group">
					<label>New Email List Name</label>
					<input className = "form-control" type = "text" onChange = {this.onNewEmailListChange.bind(this)} />
					<button type = "button" className = "btn btn-default" onClick = {this.addNewEmailList.bind(this)}> 
						Add Email List
					</button>
				</div>

				<table className="table table-bordered">
					<thead>
						<tr>
							{table_row_title.map((title) => 
								<th>{title}</th>
							)}
						</tr>
					</thead>
					<tbody>
						{email_list_display}
					</tbody>
				</table>
			</div>
		)
	}
}