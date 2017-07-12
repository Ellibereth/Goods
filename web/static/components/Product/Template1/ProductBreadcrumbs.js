var React = require('react');
var ReactDOM = require('react-dom');

export default class ProductBreadcrumbs extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}



	render() {
		return (
				<div>
					<ul className="browsePageBC">
						<li id="firstBreadCrumb" className="float-left">
							<a className="taxonomyBCrumAchr" href="/">
								<span className="firstBreadCrumbContent">Edgar USA</span>
							</a>
							<i className="fa fa-chevron-right product-breadcrumb-divider" aria-hidden="true"></i>
						</li>
						<li className="float-left">
							<a className="taxonomyBCrumAchr" href= {"/eg" + this.props.product.product_id}>
								<span className="breadCrumbContent">Product</span>
							</a>
							<i className="fa fa-chevron-right product-breadcrumb-divider" aria-hidden="true"></i>
						</li>
						<li className="float-left">
							<a className="taxonomyBCrumAchr" href= "#">
								<span className="lastBreadCrumbContent breadCrumbContent">{this.props.product.name}</span>
							</a>
							<span className = "lastBreadCrumbContent"></span>
						</li>
					</ul>
				</div>
		);
	}
}
