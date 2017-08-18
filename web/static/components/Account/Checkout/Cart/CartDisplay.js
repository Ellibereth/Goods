var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js';
import CartItemDisplay from './CartItemDisplay'
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link

export default class CartDisplay extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			// this is only for the first loading
			has_loaded : false
		}
	}

	componentDidMount(){
		if (!this.props.is_loading){
			this.setState({has_loaded : true})
		}
	}
	
	componentWillReceiveProps(nextProps){
		if (!nextProps.is_loading){
			this.setState({has_loaded : true})
		}
	}

	render() {
		var item_display = this.props.items.map((item, index) =>
				<CartItemDisplay setLoading = {this.props.setLoading} refreshCheckoutInformation = {this.props.refreshCheckoutInformation} item = {item} />
			)

		if (!this.state.has_loaded){
			return <div/>
		}

		var user = AppStore.getCurrentUser()


		return (
			<div id = "cart_display">
				{item_display.length == 0 ? 
					<div>
						{(!user || user.is_guest) && 
							<h4> 
								If you already have an account, <a href = "/login/?target=myCart">Sign In</a> to see your Cart. 
							</h4>
						}
						<h4> There are no items in your cart! </h4>
						<h4> Check out some items  <a href = "/"> here </a> </h4>
					</div>
				:
					<div>

						<div className = "row">
							<div className = "col-xs-4 col-sm-4 col-md-4 col-lg-4">
								<span className = "cart-column-title"> Item Description </span>
							</div>

							<div className = "col-xs-2 col-sm-2 col-md-2 col-lg-2 hcenter">
								<span className = "cart-column-title"> Price </span>
							</div>

							<div className = "col-xs-2 col-sm-2 col-md-2 col-lg-2 hcenter">
								<span className = "cart-column-title"> Quantity </span>
							</div>
							<div className = "col-xs-2 col-sm-2 col-md-2 col-lg-2 hcenter">
								<span className = "cart-column-title"> Total  </span>
							</div>
							<div className = "col-xs-2 col-sm-2 col-md-2 col-lg-2 hcenter">
								<span className = "cart-column-title"> Remove </span>
							</div>
						</div>	

							{item_display}
						<hr/>
					</div>
				}
			</div>	
		)
	}
}

