var React = require('react');
var ReactDOM = require('react-dom');

const src_base = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"


export default class ProductMiddleRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	generateMoreDetails(product){
		if (!product || !product.more_details) return <div/>
		return (
			<ul>
				{product.more_details.split("\n").map((row) => 
					<li><span style={{"line-height" : "1.231"}}>{row}</span></li>
					)
				}
			</ul>
		)
		
	}

	render() {
		var product = this.props.product
		var product_more_details = this.generateMoreDetails(product)
		return (
				<div className="extra-info-wrap edgar-col-xs-offset-0 edgar-col-sm-offset-1 edgar-col-md-offset-2 edgar-col-lg-offset-6 edgar-col-xl-offset-6 edgar-col-xs-60 edgar-col-sm-58 edgar-col-md-56 edgar-col-lg-48">
					<div className="edgar-row" id="productExtraInfo">
						<div className="hidden-xs edgar-col-sm-60">
							<div className="edgar-row">
								<div className="edgar-col-xs-60 edgar-col-sm-29" style = {{"paddingLeft" : "0px"}}
									dangerouslySetInnerHTML={{__html: product.quadrant1}}>
								</div>
								<div className="edgar-col-xs-60 edgar-col-sm-29 edgar-col-sm-offset-2"
									dangerouslySetInnerHTML = {{__html : product.quadrant2}}>
								</div>

								<div className="edgar-row"><div className="edgar-col-xs-60"><hr/></div></div>

								<div className="edgar-row">
									<div className="edgar-col-xs-60 edgar-col-sm-29"
									dangerouslySetInnerHTML = {{__html : product.quadrant3}}>
									</div>

									<div className="edgar-col-xs-60 edgar-col-sm-29 edgar-col-sm-offset-2"
									dangerouslySetInnerHTML = {{__html : product.quadrant4}}>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
		);
	}
}
