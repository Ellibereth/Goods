var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import AdminProductPreview from './AdminProductPreview.js'
import AdminEditProduct from './AdminEditProduct'
import PageContainer from '../../../Misc/PageContainer.js'
import AdminActivateProduct from './AdminActivateProduct'




export default class AdminProductPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product : {},
			invalid_product : true,
			is_loading : true
		}
	}

	getProductInformation(){
		var form_data = JSON.stringify({
			"product_id" : this.props.params.product_id,
			"jwt" : localStorage.jwt
		})
		$.ajax({
		  type: "POST",
		  url: "/getAdminMarketProductInfo",
		  data: form_data,
		  success: function(data) {
			if (!data.success){
				this.setState({invalid_product : true})
			}
			else {
				this.setState({
					invalid_product : false,
					product: data.product,
					is_loading : false
	 			})
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




	render() {
		return (
			<PageContainer component = 

			{
				<div>
					<div className = "container">
						<div className = "row">
							<AdminActivateProduct product = {this.state.product}/>
						</div>
						<div className = "row">
							<div className = "text-center">
								<h2> This is how your product will appear on the market </h2>
							</div>
						</div>
						<hr/>
					</div>
					<AdminProductPreview   
					 product = {this.state.product} 
					 invalid_product = {this.state.invalid_product}
					 is_loading = {this.state.is_loading}
					 />

					 <hr/>

					 <AdminEditProduct
					 getProductInformation = {this.getProductInformation.bind(this)}
					  product = {this.state.product}/>
				</div>
			}/>
		);
	}
}