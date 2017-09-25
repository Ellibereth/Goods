var React = require('react')
var ReactDOM = require('react-dom')
import AppStore from '../../../../stores/AppStore.js'
import AppActions from '../../../../actions/AppActions.js'
import UpdateBillingForm from './UpdateBillingForm'
import PageContainer from '../../../Misc/PageContainer'
var browserHistory = require('react-router').browserHistory

export default class UpdateBillingPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			first_load_done : false,
			is_loading : true,
			user : {
				addresses: []
			}
		}
	}

	refreshSettings(){
		this.setState({
			is_loading : true,
			cards : [],
			addresses : [],
		})
		var form_data = JSON.stringify({
			'jwt' : localStorage.jwt
		})
		$.ajax({
			type: 'POST',
			url: '/refreshCheckoutInfo',
			data: form_data,
			success: function(data) {
				if (data.success) {
					AppActions.updateCurrentUser(data.user)
					this.setState({
						user:  data.user,
						is_loading : false,
						first_load_done : true
					})
				}
				else {
					this.setState({is_loading : false})
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

	setLoading(is_loading){
		this.setState({is_loading : is_loading})
	}

	componentDidMount(){
		this.refreshSettings.bind(this)()
	}

	render() {
		return (
			<PageContainer is_loading = {this.state.is_loading}>
				<div className = "container">
					 <div className = "row">
					 	{this.state.first_load_done ? 
					 		<UpdateBillingForm user = {this.state.user}
							setLoading = {this.setLoading.bind(this)}/>
					 		:
					 		<div/>
					 	}
						
					</div>
				</div>
			</PageContainer>
		)
	}
}

