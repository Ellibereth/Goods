var React = require('react')

import HomeProductPreview from '../Home/HomeProductPreview'

export default class SearchPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			products : [],
			num_results:  0,
			is_loading : true
		}
	}
	componentDidMount(){
		this.loadProducts.bind(this)(this.props.params.search_input)
	}

	componentWilReceiveProps(nextProps){
		this.loadProducts.bind(this)(nextProps.search_input)
	}

	loadProducts(search_input){
		var form_data = JSON.stringify({
			'search_input' : search_input
		})
		$.ajax({
			type: 'POST',
			data: form_data,
			url: '/searchProducts',
			success: function(data) {
				if (data.success) {
					this.setState({
						products: data.products,
						num_results : data.products.length,
						is_loading : false
					})
				}
			}.bind(this),
			dataType: 'json',
			contentType : 'application/json; charset=utf-8'
		})
	}

	render() {
		var products = this.state.products
		if (!products) return <PageContainer component = {<div/>}/>
		var products_display = products.map((product, index)=>
			<HomeProductPreview product = {product} index = {index}/>
		)
		

		return (
			<PageContainer>
				<div id = "search-container" className = "container-fluid">
					<div className = "container">
						{this.state.is_loading 
							? 
							<div></div>
							:
							<div>
								<div className = "row search-result-amount-text">
										Showing {this.state.num_results} {this.state.num_results == 1 ? 'result' : 'results'} for <b> {this.props.params.search_input}</b>
								</div>
								<div className = "row">
									{products_display}
								</div>
							</div>
						}
							
					</div>
				</div>
			</PageContainer>
		)
	}
}