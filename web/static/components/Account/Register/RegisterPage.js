var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../stores/AppStore'
import RegisterAccountForm from './RegisterAccountForm'
import PageContainer from '../../Misc/PageContainer'
import Spinner from '../../Misc/Spinner'


export default class RegisterPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			is_loading : false
		}
	}

	componentDidMount(){
		var user  = AppStore.getCurrentUser()
		if (user) {
			if (!user.is_guest) {
				window.location = '/'	
			}
		}
	}

	setLoading(is_loading) {
		this.setState({is_loading : is_loading})
	}

	render() {

		return (
			<PageContainer component = {
				<div className = "container-fluid">
					{this.state.is_loading && <Spinner />}
					<div className = "col-xs-12 col-sm-offset-4 col-md-offset-4 col-lg-offset-4 col-md-4 col-lg-4 col-sm-4">
						<RegisterAccountForm
						setLoading = {this.setLoading.bind(this)}/>
					</div>
				</div>
			}/>
			
		)
	}
}

