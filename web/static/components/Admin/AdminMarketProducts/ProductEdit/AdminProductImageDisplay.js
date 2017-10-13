var React = require('react')
var ReactDOM = require('react-dom')

export default class AdminProductMainContainer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			selected_image : -1,
			product : {}

		}
	}

	componentDidMount(){
		this.setState({product : this.props.product})
		var product = this.state.product
		if (! ('images' in product)) return

		// update the selected image
		var images = product.images
		for (var i = 0; i < images.length; i++){
			if (images[i]['main_image']){
				this.setState({selected_image : i})
			}
		}
		if (this.state.selected_image == -1) {
			this.setState({selected_image : 0})
		}
	}

	componentWillReceiveProps(nextProps){
		this.setState({product : nextProps.product})
		var product = nextProps.product
		if (!('images' in product)) return

		// update the selected image
		var images = product.images
		for (var i = 0; i < images.length; i++){
			if (images[i]['main_image']){
				this.setState({selected_image : i})
			}
		}
		if (this.state.selected_image == -1) {
			this.setState({selected_image : 0})
		}
	}

	render() {

		var product = this.state.product
		if (product == null || product.product_id == null) return <div/>
		if (product.images.length == 0) return <h4> No images are listed for this product </h4>
		// something better needs to be done about bad pages, but I'll figure something out soon
		var src_base = 'https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/'
		var carousel_images = product.images.map((image, index) => {
			if (image.main_image){
				return (	
					<div className="item active">
						<img src= {src_base + image.image_id + "_200"} id = {index} className = "product-image"/>
					</div>
				)
			}
			else {
				return  (
					<div className="item">
						<img src= {src_base + image.image_id + "_200"} id = {index} className = "product-image"/>
					</div>
				)
			}
		})

		var carousel_indicator = product.images.map((image, index) => {
			if (image.main_image) return <li data-target="#myCarousel" data-slide-to= {index} className="active"/>
			else {
				return  <li data-target="#myCarousel" data-slide-to= {index}/>
			}
		})
		
		return (
			<div className = "product-image-carousel-container">
			  <div id="myCarousel" className="product-image-carousel carousel slide" data-ride="carousel">
					<ol className="carousel-indicators">
				  {carousel_indicator}
					</ol>

					{/* images  */}
					<div className="carousel-inner" role="listbox">
				  {carousel_images}
					</div>

					{/* Left and right buttons */}
					<a className="left carousel-control" href="#myCarousel" role="button" data-slide="prev">
				  <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
				  <span className="sr-only">Previous</span>
					</a>
					<a className="right carousel-control" href="#myCarousel" role="button" data-slide="next">
				  <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
				  <span className="sr-only">Next</span>
					</a>
			  </div>
			</div>
		)
	}
}