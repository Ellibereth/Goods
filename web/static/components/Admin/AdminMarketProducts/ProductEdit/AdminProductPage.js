var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import ProductMainContainer from '../../../Product/ProductMainContainer'
import AdminEditProductInfo from './AdminEditProductInfo'
import PageContainer from '../../../Misc/PageContainer.js'
import AdminEditVariants from './AdminEditVariants'
import AdminEditImages from './AdminEditImages'

const PREVIEW_VIEW = 0
const INFO_VIEW = 1
const IMAGES_VIEW = 2
const VARIANT_VIEW = 3


export default class AdminProductPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product : {},
			invalid_product : true,
			is_loading : true,
			selected_tab : PREVIEW_VIEW
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
		var form_data = JSON.stringify({"jwt" : localStorage.jwt})
		$.ajax({
			type: "POST",
			url: "/checkAdminJwt",
			data: form_data,
			success: function(data) {
				if (!data.success){
					browserHistory.push('/')	
				}
				else {
					this.getProductInformation.bind(this)()
				}
			}.bind(this),
			error : function(){
				replace('/')
		  	},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
		
	}

	navivgateTab(index){
		this.setState({selected_tab : index})
	}




	render() {
		return (
			<PageContainer component = 

			{
				<div>
					<div className = "container">
						<div className = "row">
							{!this.state.is_loading && <h1> {this.state.product.name + " by " + this.state.product.manufacturer}</h1>}
						</div>

						<div className = "top-buffer"/>
						<div className = "row">
							<ul className="nav nav-pills">
								<li onClick = {this.navivgateTab.bind(this, PREVIEW_VIEW)}
									className = {this.state.selected_tab == PREVIEW_VIEW && "active"}><a href = "#preview">Preview </a>
								</li>
								<li onClick = {this.navivgateTab.bind(this, INFO_VIEW)}
								className = {this.state.selected_tab == INFO_VIEW && "active"}>
									<a href="#info"> Edit Info</a>
								</li>
								<li onClick = {this.navivgateTab.bind(this, IMAGES_VIEW)}
								className = {this.state.selected_tab == IMAGES_VIEW && "active"}>
									<a href="#info"> Images </a>
								</li>
								{
									this.state.product.has_variants &&
									<li onClick = {this.navivgateTab.bind(this, VARIANT_VIEW)}
									className = {this.state.selected_tab == VARIANT_VIEW && "active"}>
										<a href="#info">  Variants </a>
									</li>
								}
							</ul>
						</div>

						<div className = "top-buffer"/>

						<hr/>

						<div className = {this.state.selected_tab == PREVIEW_VIEW ? "row" : "none" }>
							<ProductMainContainer admin_view = {true} product_id = {this.props.params.product_id}/>
						</div>

						<div className = {this.state.selected_tab == INFO_VIEW ? "row" : "none"}>
							<AdminEditProductInfo
							getProductInformation = {this.getProductInformation.bind(this)}
							product = {this.state.product}/>
						</div>

						<div className = {this.state.selected_tab == VARIANT_VIEW ? "row" : "none"}>
							<AdminEditVariants 
							getProductInformation = {this.getProductInformation.bind(this)}
							product = {this.state.product}/>
						</div>

						<div className = {this.state.selected_tab == IMAGES_VIEW ? "row" : "none"}>
							<AdminEditImages 
							getProductInformation = {this.getProductInformation.bind(this)}
							product = {this.state.product}/>
						</div>


					</div>
				</div>
			}/>
		);
	}
}