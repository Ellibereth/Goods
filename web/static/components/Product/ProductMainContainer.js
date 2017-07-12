var React = require('react');
var ReactDOM = require('react-dom');
import Spinner from '../Misc/Spinner'

import ProductTemplate1 from './Template1/ProductTemplate1'
import ProductTemplate2 from './Template2/ProductTemplate2'


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
					this.recordProductLoadEvent(data.product)
					this.setState({
						invalid_product : false,
						product: data.product,
						is_loading : false
					})
				}
				else if (this.props.admin_view) {
					this.recordProductLoadEvent(data.product)
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

	recordProductLoadEvent(product) {
		ga('ec:addProduct', {
				'id': product.product_id ? product.product_id.toString() : "",
				'name': product.name,
				'manufacturer' : product.manufacturer,
				'price' : product.price ? product.price.toString() : "" , 
			});
		ga('ec:setAction', 'detail');	
	}


	render() {


		if (this.state.is_loading) {
			var component = <div/>
		}
		else if (this.state.invalid_product) {
			var component = (
				<div className = "container-fluid">
					<h3>
						You've reached a bad product page! Click <a href = "/"> here </a> to return home.
					</h3>
				</div>
			)
		}
		// else {
		// 	var component = this.generateMainComponent()			
		// }		

		return (

			<div>
				<ProductTemplate2 product = {this.state.product}/>
				{/* this.state.product.product_template == 1 &&
					<ProductTemplate1 product = {this.state.product}/>
				}
				{this.state.product.product_template == 2 && 
					<ProductTemplate2 product = {this.state.product}/>
				}*/}
			</div>
		);
	}
}
