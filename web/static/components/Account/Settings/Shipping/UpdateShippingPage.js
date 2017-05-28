var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js';
import UpdateShippingForm from './UpdateShippingForm'
import PageContainer from '../../../Misc/PageContainer'
var browserHistory = require('react-router').browserHistory;
import Spinner from '../../../Misc/Spinner'

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
			<PageContainer component = {
				
				<div className = "container">
					{this.state.is_loading && <Spinner/>}	 
					 <div className = "row">
					 	<UpdateShippingForm
					 	setLoading = {this.setLoading.bind(this)} />
					 </div>
				</div>
			}/>
		)
	}
}

