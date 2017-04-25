var React = require('react');
var ReactDOM = require('react-dom');

import {Grid, Col, Row} from 'react-bootstrap';
import Countdown from 'react-cntdwn';
var browserHistory = require('react-router').browserHistory;


export default class StorePage extends React.Component {
  	constructor(props) {
		super(props);
		this.state = {
			product : {},
			invalid_product : true

		}
  	}

  	goToProduct(){
  		browserHistory.push('https://edgarusa-testserver.herokuapp.com/eg/' + this.props.product_id)
  	}

  	componentDidMount(){
	  	var form_data = JSON.stringify({
				"product_id" : this.props.product_id
			})
		$.ajax({
		  type: "POST",
		  url: "/getMarketProductInfo",
		  data: form_data,
		  success: function(data) {
			if (!data.success){
				this.setState({invalid_product : true})
			}
			else {
				this.setState({product: data.product, invalid_product : false})
				
			}
			
		  }.bind(this),
		  error : function(){
			console.log("error")
		  },
		  dataType: "json",
		  contentType : "application/json; charset=utf-8"
		})
	}

	handleFinish(){
	  	alert("Time's up!")
	}

  	onMouseOver(event){
  		$("#" + this.state.product.product_id).toggleClass("black-border-shown")
  		// event.target.classList.toggle("black-border-shown")
  	}
  	onMouseOut(event){
  		$("#" + this.state.product.product_id).toggleClass("black-border-shown")
  		// event.target.classList.toggle("black-border-shown")
  	}

  	render() {
  		// hard coded for now
  		console.log(this.state.product)
  		var date = this.state.product.sale_end_date
  		if (this.state.invalid_product) return <div/>
		return (
			<div 
			onMouseOver = {this.onMouseOver.bind(this)}
			onMouseOut = {this.onMouseOut.bind(this)}
			id = {this.state.product.product_id} className = "product-preview-container"
			onClick = {this.goToProduct.bind(this)}
			>
				<Grid>
					<Col xs = {2} s = {2} md = {2} lg= {2}>
					{this.state.product.images.length == 0 ? 
						<div> No Image For This Product </div>

							:
						<img 
						src = {"https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/" 
						+ this.state.product.images[0].image_id}
						className = "img-responsive img-rounded"/>
					}
					</Col>

					<Col xs = {4} s = {4} md = {4}lg = {4}>
						<span className = "row-fluid"> Name : {this.state.product.name} </span> <br/>
						<span className = "row-fluid"> Price : {this.state.product.price} </span> <br/>
						<span className = "row-fluid"> Manufacturer : {this.state.product.manufacturer} </span> <br/>
						<Countdown
							targetDate={date}
				        	startDelay={2000}
							interval={1000}
				        	timeSeparator={<br/>}
				        	leadingZero
				        	onFinished={this.handleFinish.bind(this)} />
					</Col>
				</Grid>
			</div>
		);
	}
}