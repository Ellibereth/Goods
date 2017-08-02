var React = require('react');
var ReactDOM = require('react-dom');
import ProductTopRow from './ProductTopRow'
import ProductMiddleRow from './ProductMiddleRow'
import MobileProductDisplay from './MobileProductDisplay'

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
						product = {this.props.product} />
						<div className="horizontal-line-wrap edgar-col-xs-60 no-padding"><hr className="bottom-margin-xs"/></div>
						<ProductMiddleRow product = {this.props.product} />
					</div>
				</div>	
				<div className = "hidden-sm hidden-md hidden-lg">
					<MobileProductDisplay 
						setLoading = {this.props.setLoading}
						getProductInformation = {this.props.getProductInformation}
						product = {this.props.product}
					/>
				</div>
			</div>							
		);
	}
}
