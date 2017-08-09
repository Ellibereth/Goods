var React = require('react');
var ReactDOM = require('react-dom');
import ProductTopRow from './ProductTopRow'
import ProductMiddleRow from './ProductMiddleRow'
import MobileProductDisplay from './MobileProductDisplay'
import RelatedProducts from './RelatedProducts'

export default class ProductTemplate2 extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	render() {
		return (
			<div>
				<div className="edgarBlock newProductpgDesign hidden-xs">
					<div className="edgar-row">
						<ProductTopRow
						setLoading = {this.props.setLoading}
						getProductInformation = {this.props.getProductInformation}
						product = {this.props.product}
						countdown_time = {this.props.countdown_time} />
						<div className="horizontal-line-wrap edgar-col-xs-60 no-padding"><hr className="bottom-margin-xs"/></div>
						<ProductMiddleRow product = {this.props.product} />
						<RelatedProducts product = {this.props.product} />
					</div>
				</div>	
				<div className = "hidden-sm hidden-md hidden-lg">
					<MobileProductDisplay 
						setLoading = {this.props.setLoading}
						getProductInformation = {this.props.getProductInformation}
						product = {this.props.product}
						countdown_time = {this.props.countdown_time}
					/>
				</div>
			</div>							
		);
	}
}
