var React = require('react')
var ReactDOM = require('react-dom')
import Slider from 'react-slick'
import HomeProductPreview from '../../Home/HomeProductPreview'

export default class RelatedProducts extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			products : [],
			is_loading : true
		}
	}

	render() {
		if (!this.props.product) {
			return <div/>
		}
		var products = this.props.product.related_products.map((product, index) =>
			<div><HomeProductPreview product = {product}/></div>
		)
		var slidesToShow = Math.min(5, products.length)


		return (
			<div className = "col-sm-12 col-md-12 col-lg-12">
				<div className = "top-buffer"/>
				<div className = "row home-product-group-header-row">
					<span className = "home-product-group-header">
							You might also like
					</span>
				</div>
				<div className = "small-buffer"/>
				<div className = "row">
					{products.length > 5 ? 
						<Slider arrows = {true} infinite = {true}
							speed = {500} slidesToShow = {slidesToShow}
							slidesToScroll = {1}
							className = 'react-slick-slides'
						>
							{products}
						</Slider> 
						:
						<div>{products}</div>
					}
				</div>
			</div>
		)
	}
}
