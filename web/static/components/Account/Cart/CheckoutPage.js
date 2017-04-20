var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl
import AppStore from '../../../stores/AppStore.js';
import TopNavBar from '../../Misc/TopNavBar'
import CartItemDisplay from './CartItemDisplay'
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link

export default class ViewCartPage extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			items : [],
			price : null
		}
	}

	componentDidMount(){
			var form_data = JSON.stringify({
				"account_id" : AppStore.getCurrentUser().account_id,
				"jwt" : localStorage.jwt
			})
			$.ajax({
				type: "POST",
				url: url  + "/getUserCart",
				data: form_data,
				success: function(data) {
					console.log(data)
					if (data.cart) {
						this.setState({items: data.cart.items, price : data.cart.price})
					}
					else {
						console.log("an error")
					}
				}.bind(this),
				error : function(){
					console.log("a server error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
	}

	render() {
		console.log(this.state.items)
		var item_display = this.state.items.map((item, index) =>
				<CartItemDisplay item = {item} />
			)


		return (
			<div>

				<TopNavBar />

				<div className = "container">
					<h2> 
						Your Cart! Click <Link to = "/checkout"> here </Link> to checkout
					</h2>
					{item_display.length == 0 && 
						<div>
							<h2> There are no items in your cart! Check out our store 
							 <Link to = "/store"> here </Link> </h2>
						</div>
					}
					{item_display}
				</div>
				
				
			</div>	
		)
	}
}

