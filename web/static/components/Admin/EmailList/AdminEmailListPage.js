var React = require('react');
var ReactDOM = require('react-dom');
import PageContainer from '../../Misc/PageContainer.js'


export default class AdminProductPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email_list : {},
			subscribed_users : []
		}
	}

	getEmailListInformation(){
		var form_data = JSON.stringify({
			"email_list_id" : this.props.params.email_list_id,
			"jwt" : localStorage.jwt
		})
		$.ajax({
		  type: "POST",
		  url: "/getEmailListInfo",
		  data: form_data,
		  success: function(data) {
			if (!data.success){
				this.setState({invalid_product : true})
			}
			else {
				this.setState({
					email_list : data.email_list,
					subscribed_users : data.email_list.subscribed_users
				})
			}
			
		  }.bind(this),
		  error : function(){

		  },
		  dataType: "json",
		  contentType : "application/json; charset=utf-8"
		});
	}

	unsubscribeUser(unsubscribe_id) {
		var form_data = JSON.stringify({
			unsubscribe_id : unsubscribe_id
		})
		$.ajax({
		  type: "POST",
		  url: "/unsubscribeUserFromEmailList",
		  data: form_data,
		  success: function(data) {
			if (!data.success){
				this.setState({invalid_product : true})
			}
			else {
				this.setState({
					email_list : data.email_list,
					subscribed_users : data.email_list.subscribed_users
				})
			}
			
		  }.bind(this),
		  error : function(){

		  },
		  dataType: "json",
		  contentType : "application/json; charset=utf-8"
		});
	}

	componentDidMount() {
		this.getEmailListInformation.bind(this)()
	}

	render() {
		var email_list = this.state.email_list
		var user_list_display = this.state.subscribed_users.map((subscriber, index) => 
				<tr>
					<td> {subscriber.email} </td>
					<td> 
						<div className = "clickable-text" 
							onClick = {this.unsubscribeUser.bind(this, subscriber.unsubscribe_id)}>
								Unsubscribe
						</div>
					</td>
				</tr>
			)
		return (
			<PageContainer component = 

			{
				<div>
					<div className = "container">
						<table className="table table-bordered">
							<thead>
								<tr>
									<th>
										{email_list.email_list_name}
									</th>
								</tr>
							</thead>
							<tbody>
								{user_list_display}
							</tbody>
						</table>



					</div>

				</div>
			}/>
		);
	}
}