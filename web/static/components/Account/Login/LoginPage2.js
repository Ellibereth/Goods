var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../stores/AppStore'
import PageContainer from '../../Misc/PageContainer'
import Spinner from '../../Misc/Spinner'
import LoginBox from './LoginBox'

export default class LoginPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			is_loading : false
		}
	}

	componentDidMount(){
		var user = AppStore.getCurrentUser()
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
			<PageContainer>
	<div className="fab-container-fluid">
		<div className="fab-fixed-container">
			<div className="fab-row log-out-wrapper">
				<div className="inviteWrapper fab-col-xs-60">
					<div className="fab-row">
						<div className="fab-col-xs-60">
							<div className="newLoginProcess fab-row">
								
								<LoginBox />

								


								<div className="clear">
								</div>


								<div className="mobInviteBlock fab-col-xs-60 visible-only-xs" id="mobResInviteMsg">
									<div className="" id="mobRequestInvite">
										Not a member yet? <span className=""><u>Sign Up Now!</u></span>
									</div>


									<div className="displayNone" id="mobAMWrap" style={{"display": "block"}}>
										<span className="lockIconWrap" style= {{"color" : "#000"}}>Already a member?</span> <span id="mobReLogin" style= {{"marginLeft": "5px","cursor": "pointer"}}><span className="lockIcon fabShopSprite"></span> <a href="javascript:void(0)" style= {{"color": "#333"}}><u>Login</u></a></span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
			</PageContainer>
			
		)
	}
}

