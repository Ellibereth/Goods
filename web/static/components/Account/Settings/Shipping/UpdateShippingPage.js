var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js';
import UpdateShippingForm from './UpdateShippingForm'
import PageContainer from '../../../Misc/PageContainer'
var browserHistory = require('react-router').browserHistory;

export default class UpdateShippingPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			is_loading : false
		}
	}

	setLoading(is_loading){
		this.setState({is_loading : is_loading})
	}


	render() {
		return (
			<PageContainer is_loading = {this.state.is_loading}>
				
				<div className = "container">
					{this.state.is_loading && <Spinner/>}	 
					 <div className = "row">
					 	<UpdateShippingForm
					 	setLoading = {this.setLoading.bind(this)} />
					 </div>
				</div>
			</PageContainer>
		)
	}
}

