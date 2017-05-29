var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import ProductTemplates from './ProductTemplates/ProductTemplates'
import StoryTemplates from './StoryTemplates/StoryTemplates'

import PageContainer from '../Misc/PageContainer'
import Spinner from '../Misc/Spinner'



export default class ProductPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product : [],
			invalid_product : true,
			is_loading : true,
			spinner_loading : false
		}
		this.generateMainComponent = this.generateMainComponent.bind(this)
	}

	getProductInformation(){

		var form_data = JSON.stringify({
			"product_id" : this.props.params.product_id,
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
			}
		  }.bind(this),
		  error : function(){
			console.log("error")
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
			<div class = "container-fluid">
				{this.state.spinner_loading && <Spinner />}
				<div className = "small-buffer"/>
				<ProductTemplates 
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



		return (
				<PageContainer component ={component}/>
		);
	}
}
