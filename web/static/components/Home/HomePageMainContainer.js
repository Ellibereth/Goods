var React = require('react');
var ReactDOM = require('react-dom');
import {Grid, Row, Col, Button} from 'react-bootstrap';
import ProductPreview from './ProductPreview'

export default class HomePageMainContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}
	
	render() {
		
		var product_ids = [1,2,3,4,5,6,7,8]

		var items_per_row = 3

		var products = product_ids.map((product_id, index) =>
				<ProductPreview col_size = {12 / items_per_row} product_id = {product_id}/>
			)

		var product_rows = []

		var num_rows = Math.floor((products.length - 1) / items_per_row + 1)
		// console.log(num_rows)
		for (var i = 0; i < num_rows; i++){
			var this_row = []
			for (var j = i * items_per_row; j < items_per_row * (i+1); j++){
				if (j < products.length){
					this_row.push(products[j])
				}
				else {
					console.log("did not add item " + j)		
				}
			}
			product_rows.push(
				<div className = "row row-eq-height product-preview-row">
					{this_row}
				</div>
			)
		}

		

		return (
			<div className = "container home-container">
				<div className="row show-grid">
					<div className = "col-xs-12 col-md-12 col-sm-12 col-lg-12">
						<div>
							<center>
								<div id = "text-part">	
									<h1>
										<b>
											Weekly Deals on American Made Products
										</b>
									</h1>
									
								</div>
								<br/>
							      
							</center>
						</div>
					</div>
				</div>
				<hr/>

				{product_rows}
				
			</div>
			);
	}
}