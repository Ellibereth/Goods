var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../stores/AppStore'
import LoginForm from './LoginForm'
import PageContainer from '../../Misc/PageContainer'
import Spinner from '../../Misc/Spinner'


export default class LoginPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			is_loading : false
		}
	}

	componentDidMount(){
		if (AppStore.getCurrentUser()) {
			window.location = '/'
		}
	}

	setLoading(is_loading) {
		this.setState({is_loading : is_loading})
	}

	render() {

		return (
			<PageContainer component = {
				<div className = "container">
					{this.state.is_loading && <Spinner />}
					
					
							<div className = "container">
								<div className = "col-md-offset-3 col-lg-offset-3 col-md-6 col-lg-6">
									<LoginForm
									setLoading = {this.setLoading.bind(this)}/>
								</div>
					</div>
				</div>
			}/>
			
		)
	}
}

