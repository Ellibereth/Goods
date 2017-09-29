var React = require('react')
var ReactDOM = require('react-dom')

var browserHistory = require('react-router').browserHistory
import PageContainer from '../Misc/PageContainer'
import AppStore from '../../stores/AppStore'


const PRODUCT_RECOMMENDATION = "Product Recommendation"
const categories = [PRODUCT_RECOMMENDATION]
import {AlertMessages} from '../Misc/AlertMessages'

export default class SuggestProductPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			feedback_content: '',
			email : '',
			name: '',
			category: categories[0],
			order_id : ''
		}
		this.onChange = this.onChange.bind(this)
		this.sendFeedback = this.sendFeedback.bind(this)
	}

	componentDidMount(){	
		var current_user = AppStore.getCurrentUser()
		if (current_user){
			this.setState({
				name : current_user.name,
				email : current_user.email
			})
		}
	}


	onChange(event){
		var obj = this.state
		obj[event.target.name] = event.target.value
		this.setState(obj)
	}

	sendFeedback(event){
		event.preventDefault()
		var form_data = JSON.stringify({
			feedback_content : this.state.feedback_content,
			email : this.state.email,
			name : this.state.name,
			category : this.state.category,
			order_id : this.state.order_id
		})
		$.ajax({
			type: 'POST',
			data: form_data,
			url: '/addFeedback',
			success: function(data) {
				if (data.success) {
					swal(AlertMessages.SUCCESFUL_FEEDBACK_COMPLETION,
						function (isConfirm) {
							if (isConfirm) {
								window.location = '/'
							}
						})
				}
				else {
					swal({
						title : data.error.title, 
						text : data.error.text,
						type:  data.error.type,
						confirmButtonColor: '#DD6B55',
						confirmButtonText: 'Ok',
						closeOnConfirm: true
					})
				}
			}.bind(this),
			dataType: 'json',
			contentType : 'application/json; charset=utf-8'
		})
	}




	render() {

		

		return (
			<PageContainer>
				<div className = "container">
					<div className = "row">
						<div className = "col-sm-6 col-md-6 col-lg-6 col-md-offset-3 col-lg-offset-3 col-sm-offset-3">
							<div className = "panel panel-default ">
								<div className = "panel-body support-panel-body" >
									<div className = "top-buffer"/>

									<div className = "row">
									Describe the product you would like to see on Edgar USA. Include links if you like
									</div>

									<div className = "small-buffer"/>

									<div className = "row">
										<div className = "form-group">
											<textarea className="form-control textarea-resize-vertical"
										 rows="8" onChange = {this.onChange} name = "feedback_content"/> 
										</div>
									</div>

									{!AppStore.getCurrentUser()&&
									<div className = "row">
										<form onSubmit = {(event) =>  event.preventDefault()} className="form-inline">
											<div className = "form-group" style = {{'padding-right' : '6px'}}>
												<p className = "form-control-static"> {'Email: '} </p>
											</div>
											<div className = "form-group">
												<input
													style = {{'width' : '300px'}}
													 type="text" className = "form-control" 
													 onChange = {this.onChange} name = "email" value = {this.state.email} />
											</div>
										</form>
									</div>
									}
									<div className = "top-buffer"/>

									{!AppStore.getCurrentUser() && 
									<div className = "row">
										<form className="form-inline">
											<div className = "form-group" style = {{'padding-right' : '6px'}}>
												<p className = "form-control-static"> {'Name: '} </p>
											</div>
											<div className = "form-group">
												<input
													style = {{'width' : '300px'}}
													 type="text" className = "form-control" 
													 onChange = {this.onChange} name = "name" value = {this.state.name} />
											</div>
										</form>
									</div>
									}
								
									<div className = "top-buffer"/>

									<div className = "row">
										<button onClick = {this.sendFeedback} type = "button" className = "btn send-feedback-button">
										Send
										</button>
									</div>
									<div className = "small-buffer"/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</PageContainer>
		)
	}
}