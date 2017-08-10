var React = require('react');
var ReactDOM = require('react-dom');

const src_base = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"


export default class ProductMiddleRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}


	render() {
		var product = this.props.product
		return (
				<div className="extra-info-wrap edgar-col-xs-offset-0 edgar-col-sm-offset-0 edgar-col-md-offset-0 edgar-col-lg-offset-0 edgar-col-xl-offset-0 edgar-col-xs-60 edgar-col-sm-60 edgar-col-md-60 edgar-col-lg-60">
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
