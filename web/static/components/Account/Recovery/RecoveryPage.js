var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../stores/AppStore'
import PageContainer from '../../Misc/PageContainer'
import RecoveryForm from './RecoveryForm'

export default class RecoveryPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			is_loading : false,
		}
	}

	componentDidMount(){
		
	}

	setLoading(is_loading) {
		this.setState({is_loading : is_loading})
	}

	render() {
		return (
			<PageContainer is_loading = {this.state.is_loading} no_add_buffer = {true}>
				<div className="edgar-container-fluid" className = "responsive-site">
					<div className="edgar-fixed-container">
						<div className="edgar-row">
							<div className="inviteWrapper edgar-col-xs-60">
								<div className="edgar-row">
									<div className="edgar-col-xs-20 edgar-col-xs-offset-20 ">
										<div className="newLoginProcess edgar-row">
											
											<RecoveryForm
											setLoading = {this.setLoading.bind(this)} />

											<div className="clear">
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

