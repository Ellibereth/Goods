var React = require('react');
var ReactDOM = require('react-dom');
import ProductTemplates from './ProductTemplates/ProductTemplates'
import StoryTemplates from './StoryTemplates/StoryTemplates'
import PageContainer from '../Misc/PageContainer'
import Spinner from '../Misc/Spinner'



export default class ProductMainContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product : [],
			invalid_product : true,
			is_loading : true,
			spinner_loading : false
		}
	}

	getProductInformation(){

		var form_data = JSON.stringify({
			"product_id" : this.props.product_id,
			"jwt" : localStorage.jwt
		})
		$.ajax({
		  type: "POST",
		  url: "/getMarketProductInfo",
		  data: form_data,
		  success: function(data) {
			if (!data.success){
				this.setState({
					invalid_product : true,
					is_loading : false
				})
			}
			else {
				if (data.product.active){
					this.setState({
						invalid_product : false,
						product: data.product,
						is_loading : false
		 			})
				}
				else if (this.props.admin_view) {
					this.setState({
						invalid_product : false,
						product: data.product,
						is_loading : false
		 			})
				}
			}
		  }.bind(this),
		  error : function(){
			 ga('send', 'event', {
				eventCategory: ' server-error',
				eventAction: 'getMarketProductInfo'
			});
		  },
		  dataType: "json",
		  contentType : "application/json; charset=utf-8"
		});
	}


	componentDidMount(){
		this.getProductInformation.bind(this)()	
		
	}

	setLoading(spinner_loading){ 
		this.setState({spinner_loading : spinner_loading})
	}



	generateMainComponent (){

		return (
			<div>
				{this.state.spinner_loading && <Spinner />}
				<div className = "small-buffer"/>
				<ProductTemplates 
					getProductInformation = {this.getProductInformation.bind(this)}
					setLoading = {this.setLoading.bind(this)}
					product = {this.state.product}
					is_loading = {this.state.is_loading}

					/>
				<div className = "row">
					<div className = "top-buffer"/>
					<div className = "top-buffer"/>
				</div>
				<StoryTemplates 
					product = {this.state.product}
				 	/>
			</div>
		)
		
	}


	render() {


		if (this.state.is_loading) {
			var component = <div/>
		}
		else if (this.state.invalid_product) {
			var component = (
				<div className = "container">
					<h3>
						You've reached a bad product page! Click <a href = "/"> here </a> to return home.
					</h3>
				</div>
			)
		}
		else {
			var component = this.generateMainComponent()			
		}		



		return component;
	}
}
