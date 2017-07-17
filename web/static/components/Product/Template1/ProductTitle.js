var React = require('react');
var ReactDOM = require('react-dom');
import Footer from '../../Nav/Footer'
import ProductBreadcrumbs from './ProductBreadcrumbs'

export default class ProductTitle extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}


	render() {
		



		return (

			<div id = "salesHeader" className = "floatingHeader newSaleShareHeader">
				
				<div className = "salefacebookbannerHeader prodPgBrumOptions">
				<ProductBreadcrumbs product = {this.props.product}/>
				<div className = "clear"/>
				
				<div id="prdShareWithTitle">
					<div className="float-left">
						<h1 id="productTitle">{this.props.product.name}</h1>
						<div>
							<span id="byText" className="byText">by&nbsp;</span>
							<h2 className="productCaption">
								<a className="color666">
									{this.props.product.manufacturer}
								</a>
							</h2>
						</div>
					</div>

					<div className="float-right prodShareMainWrap">
						<div id="prodShareBlock" className="float-left">
							<div id="prodShareIconDetails">
								<ul className="shareWidgetLinks">
									<li><a href="#"><i className="fa fa-facebook fa-2x" aria-hidden="true"/></a></li>
									<li><a href="#"><i className="fa fa-instagram fa-2x" aria-hidden="true"/></a></li>
									<li><a href="#"><i className="fa fa-twitter fa-2x" aria-hidden="true"/></a></li>
									<li><a href="#"><i className="fa fa-pinterest fa-2x" aria-hidden="true"/></a></li>
								</ul>
							</div>
							<span id="prodShareIcon" className="edgarShopSpriteNew dIB"></span>
						</div>
						<div className="singleSolidBorders"></div>
							<div className="prodNavFaveCt float-right">
								<div id="prodNavFaveDesc" className="prodNavFaveDesc dIB">
									<span className="likeThisProduct h5 float-left">Like this product?</span>
									<span className="addToFavorites h4 float-left">ADD TO YOUR LISTS</span>
								</div>

								<span data-tracker="fav_login" data-trackerevent-type="loginToFav" id="prodNavFaveImg" className="prodNavFaveImg edgarShopSpriteNew favProduct"></span>
								<i id = "addToFavoriteHeartIcon" className="fa fa-heart fa-2x" aria-hidden="true"></i>
								<span id="prodNavFaveNum" className="prodNavFaveNum">0</span>
							</div>
						</div>
				</div>
				</div>
				
			</div>
				
		);
	}
}
