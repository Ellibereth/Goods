var React = require('react')
var ReactDOM = require('react-dom')
import ProductTemplate2 from './Template2/ProductTemplate2'
import PageContainer from '../Misc/PageContainer'

export default class ProductPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			product : [],
			invalid_product : true,
			is_loading : true,
			spinner_loading : false,
			countdown_time : null
		}
		this.countdown_interval = setInterval(this.updateCountdown.bind(this), 1000)	
	}

	updateCountdown() {
		if (this.state.product){
			if (this.state.product.sale_end_date){

				// Get todays date and time
				var now = new Date()

				// Find the distance between now an the count down date
				var string = this.state.product.sale_end_date
				var sale_end_date = new Date(string)
			  	var distance = sale_end_date - now
			  	// Time calculations for days, hours, minutes and seconds
			  	var days = Math.floor(distance / (1000 * 60 * 60 * 24))
			  	var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
			  	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
			  	var seconds = Math.floor((distance % (1000 * 60)) / 1000)
			  	if (days == 0){
			  		// Display the result in the element with id="demo"
				  	var countdown_time = hours + 'h '
				  		+ minutes + 'm ' + seconds + 's '
				  	this.setState({countdown_time : countdown_time})
					// If the count down is finished, write some text 
					if (distance < 0) {
				    	clearInterval(this.countdown_interval)
				    	this.setState({countdown_time : 'EXPIRED'})
				  	}
			  	}
			  	
			}
		}
	}

	getProductInformation(){

		var form_data = JSON.stringify({
			'product_id' : this.props.params.product_id,
		})
		$.ajax({
		  type: 'POST',
		  url: '/getMarketProductInfo',
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
					else {
						this.setState({
							invalid_product : true,
							is_loading : false
						})
					}
				}
			}.bind(this),
			error : function(){
				ga('send', 'event', {
					eventCategory: ' server-error',
					eventAction: 'getMarketProductInfo',
				})
			},
			dataType: 'json',
			contentType : 'application/json; charset=utf-8'
		})
	}


	componentDidMount(){

		this.getProductInformation.bind(this)()
		
	}

	setLoading(spinner_loading){ 
		this.setState({spinner_loading : spinner_loading})
	}


	recordProductLoadEvent(product) {
		ga('ec:addProduct', {
			'id': product.product_id ? product.product_id.toString() : '',
			'name': product.name,
			'manufacturer' : product.manufacturer_obj.name,
			'price' : product.price ? product.price.toString() : '',
		})
		ga('ec:setAction', 'detail')	
		ga('send', 'pageview')
	}


	render() {
		if (this.state.is_loading) {
			var component = <div/>
		}
		else if (this.state.invalid_product) {
			var component = (
				<div style = {{'paddingTop' : '12px'}} className = "container-fluid">
					<h3>
						You've reached a bad product page! Click <a href = "/"> here </a> to return home.
					</h3>
				</div>
			)
		}	

		else {
			var component = <ProductTemplate2 
				setLoading = {this.setLoading.bind(this)}
				getProductInformation = {this.getProductInformation.bind(this)}
				product = {this.state.product}
				countdown_time = {this.state.countdown_time}/>
		}

		return (

			<PageContainer is_loading = {this.state.spinner_loading} no_add_buffer = {true}>
				{component}
				{/* this.state.product.product_template == 1 &&
					<ProductTemplate1 product = {this.state.product}/>
				}
				{this.state.product.product_template == 2 && 
					<ProductTemplate2 product = {this.state.product}/>
				}*/}
			</PageContainer>
		)
	}
}
