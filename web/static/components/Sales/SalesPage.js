var React = require('react');
var ReactDOM = require('react-dom');


import PageContainer from '../Misc/PageContainer'
import Spinner from '../Misc/Spinner'
import HomeProductPreview from '../Home/HomeProductPreview'


export default class SalesPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			products : []
		}
	}

	fetchProductInformation(){
		$.ajax({
		  type: "POST",
		  url: "/getOnSaleProducts",
		  success: function(data) {
			if (data.success){
				this.setState({products : data.products})
			}
		  }.bind(this),
		  error : function(){
			ga('send', 'event', {
						eventCategory: ' server-error',
						eventAction: 'getHomePageProducts',
						eventLabel: AppStore.getCurrentUser().email
					});
		  },
		  dataType: "json",
		  contentType : "application/json; charset=utf-8"
		})
	}

	componentDidMount(){
		this.fetchProductInformation.bind(this)()
	}

	render() {
		var products = this.state.products.map((product, index) =>
				<HomeProductPreview product = {product}/>
			)



		return (
				<PageContainer>
					<div>
						<div className = "container">
							<div className="row show-grid">
								<div className = "col-xs-12 col-md-12 col-sm-12 col-lg-12">
									<h1>
										These products are on sale!
									</h1>
								</div>
							</div>
						</div>
						<div className = "home-large-buffer"/>

							
						<div className = "container-fluid home-product-preview-container">
							<div className = "container">
								<div className = "row product-preview-row">
									{products}
								</div>
							</div>
						</div>
								
					</div>
				</PageContainer>
		);
	}
}
