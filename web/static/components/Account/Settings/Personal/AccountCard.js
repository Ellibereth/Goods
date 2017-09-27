var React = require('react')
var ReactDOM = require('react-dom')
var browserHistory = require('react-router').browserHistory
import AppStore from '../../../../stores/AppStore.js'
import AppActions from '../../../../actions/AppActions.js'
import UpdateInformationForm from './Information/UpdateInformationForm'
import DeleteAccountForm from './Delete/DeleteAccountForm'
import ChangePasswordForm from './Password/ChangePasswordForm'
import {AlertMessages} from '../../../Misc/AlertMessages'

const INFORMATION_INDEX = 0
const PASSWORD_INDEX = 1
const DELETE_INDEX = 2

const INDEX = [INFORMATION_INDEX, PASSWORD_INDEX, DELETE_INDEX]
const FB_INDEX = [INFORMATION_INDEX, DELETE_INDEX]
const DISPLAYS = ['Edit Information', 'Change Password', 'Delete Account']
const FB_DISPLAYS = ['Edit Information', 'Delete Account']
export default class AccountCard extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			editable_index: INFORMATION_INDEX
		}
		this.getPanelBody = this.getPanelBody.bind(this)
	}

	setEditableIndex(index) {
		if (index != null){
			this.setState({editable_index : index})
		}
	}

	getUserInfo(){
		var form_data =  JSON.stringify({
			jwt : localStorage.jwt
		})
		$.ajax({
			type: 'POST',
			url: '/getUserInfo',
			data: form_data,
			success: function(data) {
				if (data.success) {
					AppActions.updateCurrentUser(data.user)
				}
				else {
					AppActions.removeCurrentUser()
				}
			}.bind(this),
			error : function(){
				ga('send', 'event', {
					eventCategory: ' server-error',
					eventAction: 'getUserInfo',
					eventLabel: AppStore.getCurrentUser().email
				})
			},
			dataType: 'json',
			contentType : 'application/json; charset=utf-8'
		})
	}


	getPanelBody(index) {
		var current_user = AppStore.getCurrentUser()
		if (index == PASSWORD_INDEX){
			return (
				<div className = "panel-body">
					<div className = "container">
						<ChangePasswordForm 
							getUserInfo = {this.getUserInfo.bind(this)}/>
					</div>
				</div>
			)
		}
		else if (index == DELETE_INDEX){
			return (
				<div className = "panel-body">
					<div className = "container">
						<DeleteAccountForm  getUserInfo = {this.getUserInfo.bind(this)}/>
					</div>
				</div>
			)
		}
		else {
			return (
				<div className ="panel-body">
					<div className = "container">
						<UpdateInformationForm 
							getUserInfo = {this.getUserInfo.bind(this)}/>
					</div>
				</div>
			)
		} 
	}




	render() {
		
		var panel_body = this.getPanelBody(this.state.editable_index)
		var user = AppStore.getCurrentUser()
		if (user.fb_id) {
			var pills = FB_DISPLAYS
			var indices = FB_INDEX
		}
		else {
			var pills = DISPLAYS
			var indices = INDEX
		}
		return (
			<div className = "container-fluid">
				<div className = "panel panel-default">
					<div className = "panel-heading">
						<ul className="nav nav-pills">

							{pills.map((display, index) => 
								<li className= {this.state.editable_index == index && 'active'}
									onClick = {this.setEditableIndex.bind(this, indices[index])}> 
									<a href="#" id = {display + "_tab"}>{display}</a> 
								</li>
							)}
						</ul>
					</div>
					{panel_body}
				</div>
			</div>


				
		)
	}
}

