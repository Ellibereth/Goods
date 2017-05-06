var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js';
import PageContainer from '../../../Misc/PageContainer'
import ManageCardDisplay from './ManageCardDisplay.js'
var browserHistory = require('react-router').browserHistory;

export default class UpdateBillingPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cards : [],
			is_loading : true
		}
	}

	componentDidMount() {
		this.loadCards.bind(this)()

	}

	loadCards(){
		this.setState({is_loading : true})
		$('#settings_cards_container').addClass("faded");
		// first check the password
		var form_data = JSON.stringify({
			"account_id" : AppStore.getCurrentUser().account_id,
			"jwt" : localStorage.jwt
		})
		$.ajax({
				type: "POST",
				url: "/getUserCards",
				data: form_data,
				success: function(data) {
					this.setState({cards : data.cards})
					console.log(data)
					this.setState({is_loading : false})
					$('#settings_cards_container').removeClass("faded");
				}.bind(this),
				error : function(){
					console.log("error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
	}

	render() {
		var cards_display = this.state.cards.map((card, index) => 
					<ManageCardDisplay card = {card}/>
				)


		return (
			<PageContainer component = {
				<div id = "settings_cards_container" className = "container faded">
					<div className = "row">
						<div className = "col-md-12 col-lg-12">
							<div className = "row">
								<div className = "col-md-6 col-lg-6">
									<span className = "settings-title"> These are your cards! </span>
								</div>
								<div className = "top-buffer"/>
							</div>
							{cards_display}
						</div>
					</div>
				</div>
			}/>
		)
	}
}

