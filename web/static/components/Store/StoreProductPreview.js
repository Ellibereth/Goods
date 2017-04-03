var React = require('react');
var ReactDOM = require('react-dom');

import {Grid, Col, Row} from 'react-bootstrap';
import Countdown from 'react-cntdwn';
var Config = require('Config')
var url = Config.serverUrl


export default class StorePage extends React.Component {
  	constructor(props) {
		super(props);
		this.state = {
			product : {}
		}
  	}

  	componentDidMount(){
	  	var form_data = JSON.stringify({
				"product_id" : this.props.product_id
			})
		$.ajax({
		  type: "POST",
		  url: url + "/getMarketProductInfo",
		  data: form_data,
		  success: function(data) {
			if (!data){
				this.setState({invalid_product : true})

			}
			this.setState({product: data})
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
  		var date = new Date("April 13, 2017 12:00:00")

		return (
			<div 
			onMouseOver = {this.onMouseOver.bind(this)}
			onMouseOut = {this.onMouseOut.bind(this)}
			id = {this.state.product.product_id} className = "product-preview-container">
				<Grid>
					<Col xs = {2} s = {2} md = {2} lg= {2}>
						<img 
						src = {"https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/" + this.state.product.product_id + "_0"}
						className = "img-responsive img-rounded"/>
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