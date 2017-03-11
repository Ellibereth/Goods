var React = require('react');
var ReactDOM = require('react-dom');

export default class AdminTools extends React.Component {
  constructor(props) {
    super(props);
  }


  componentDidMount(){
	  		var submission_items = [
							'unique_id', 
							'image_id',
							'timeStamp',
							'manufacturer_name',
							'url_link',
							'contact_information',
							'product_name',
							'origin',
							'barcode_upc',
							'barcode_type',
							'additional_info',
							'verified'
						 ]
			var submission_table = document.getElementById("submission_table")
			var header_row = document.createElement("tr")
			var thead = document.createElement("thead")
			thead.class = "thread-inverse"
			for (var i = 0; i < submission_items.length; i++) {
				var header_cell = document.createElement("th")
				if (submission_items[i] == 'image_id') {
					header_cell.innerHTML = "Image"
				}
				else {
					header_cell.innerHTML = submission_items[i]
				}
				thead.appendChild(header_cell)
			}
			var verify_this = document.createElement("th")
			verify_this.innerHTML = "Verify this?"
			thead.append(verify_this)
			submission_table.appendChild(thead)
			var tbody = document.createElement("tbody")
			submission_table.appendChild(tbody)

			var real_url = "https://whereisitmade.herokuapp.com"
			var test_url = "https://127.0.0.1:5000"

		
		  	$.ajax({
			  type: "POST",
			  url: real_url + "/getProductSubmissions",
			  success: function(data) {
			  		var submission_list = data;
					for (var i = 0; i < submission_list.length; i++){
						var row = document.createElement("tr") 
						for (var j = 0; j < submission_items.length; j++) {
							var item = submission_items[j]
							if (item == "unique_id"){
								var cell = document.createElement("th")
								cell.innerHTML = submission_list[i][item]
								cell.scope = "row"
							}

							else if (item == "image_id") {
								var cell = document.createElement("td")
								if (!submission_list[i][item]){
									cell.innerHTML = "No Image"
								}
								else {
									var image = document.createElement("img")
									image.src = "../static/images/product_submissions/" + submission_list[i][item] + ".png"
									image.height = "40"
									image.width = "40"
									cell.appendChild(image)
								}	
							}

							else {
								var cell = document.createElement("td")
								cell.innerHTML = submission_list[i][item]
							}
							row.appendChild(cell)
					}


					// here we need to add the verify column
					var cell = document.createElement("td")
					cell.setAttribute("data-unique-id",  submission_list[i]['unique_id'])
					cell.onclick = function () {
							var unique_id = this.getAttribute("data-unique-id")
							var formData = JSON.stringify({
											"unique_id" : unique_id
										})
							$.ajax({
								  type: "POST",
								  url: real_url + "/verifyProductSubmission",
								  data: formData,
								  success: function(data) {
								  	// window.location.reload();
								  	console.log(unique_id)
								  },
								  error: function(){
								  	console.log("error")
								  },
								  dataType: "json",
			  					contentType : "application/json; charset=utf-8"
							})
						}
					cell.innerHTML = "Verify this?"
					row.appendChild(cell)

					submission_table.appendChild(row)
				}
			  },
			  error : function(){
			  	console.log("error")
			  },
			  dataType: "json",
			  contentType : "application/json; charset=utf-8"
			});
		  }

	

  render() {
    return (
        <div id = "submission_table_container">
        	<table id = "submission_table">
			</table>
        </div>
    );
  }
}

