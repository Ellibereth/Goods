var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../../stores/AppStore.js';
import AppActions from '../../../../actions/AppActions.js';
import UpdateInformationForm from './Information/UpdateInformationForm'
import DeleteAccountForm from './Delete/DeleteAccountForm'
import ChangePasswordForm from './Password/ChangePasswordForm'
import {AlertMessages} from '../../../Misc/AlertMessages'

const DEFAULT_INDEX = 0
const INFORMATION_INDEX = 1
const PASSWORD_INDEX = 2
const DELETE_INDEX = 3

const DISPLAYS = ['View', 'Edit Information', 'Change Password', 'Delete Account']

export default class AccountCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editable_index: DEFAULT_INDEX
		}
		this.getPanelBody = this.getPanelBody.bind(this)
	}

	setEditableIndex(index) {
		if (index){
			this.setState({editable_index : index})
		}
		else {
			this.setState({editable_index : DEFAULT_INDEX})
		}
	}

	getUserInfo(){
		var form_data =  JSON.stringify({
			jwt : localStorage.jwt
		})
		$.ajax({
			type: "POST",
			url: "/getUserInfo",
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
				});
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}


	getPanelBody(index) {
		var current_user = AppStore.getCurrentUser()
		if (index == INFORMATION_INDEX){
			return (
				<div className ="panel-body">
					<div className = "container">
						<UpdateInformationForm 
						getUserInfo = {this.getUserInfo.bind(this)}
						setEditableIndex = {this.setEditableIndex.bind(this, DEFAULT_INDEX)}/>
					</div>
				</div>
			)
		} 
		else if (index == PASSWORD_INDEX){
			return (
				<div className = "panel-body">
					<div className = "container">
						<ChangePasswordForm 
						getUserInfo = {this.getUserInfo.bind(this)}
						setEditableIndex = {this.setEditableIndex.bind(this, DEFAULT_INDEX)}/>
					</div>
				</div>
			)
		}
		else if (index == DELETE_INDEX){
			return (
				<div className = "panel-body">
					<div className = "container">
						<DeleteAccountForm 
						setEditableIndex = {this.setEditableIndex.bind(this, DEFAULT_INDEX)}/>
					</div>
				</div>
			)
		}
		else {
			return (
				<div className ="panel-body">
					<span className = "account-page-text block-span">Name: {current_user.name}</span>
					<span className = "account-page-text block-span">Email: {current_user.email}</span>
					<span className = "account-page-text block-span">Password: &bull;&bull;&bull;&bull;&bull;&bull;</span>
					<span className = "block-span"> <div className = "small-buffer"/></span>
				</div>
			)
		}
	}




	render() {
		
		var panel_body = this.getPanelBody(this.state.editable_index)
		return (
				<div className = "container-fluid">
					<div className = "panel panel-default">
						<div className = "panel-heading">
							<ul className="nav nav-pills">
								{DISPLAYS.map((display, index) => 
										<li className= {this.state.editable_index == index && "active"}
										onClick = {this.setEditableIndex.bind(this, index)}> 
											<a href="#">{display}</a> 
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

