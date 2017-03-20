var script = document.createElement('script');
script.src = 'http://code.jquery.com/jquery-3.1.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

var this_asin = window.location.href.split("/dp/")[1].substring(0,10)
var url = "https://whereisitmade.herokuapp.com"
var test_url = "http://127.0.0.1:5000"
// checks the database if we have the product already
// if not then we add the url to the database then check again
function checkDatabaseForProduct(){

	var form_data = JSON.stringify({
		"asin" : this_asin
	})
	var final_origin = ""
	$.ajax({
		  type: "POST",
		  url: url  + "/getAmazonProductInformationFromAsin",
		  data: form_data,
		  success: function(data) {
		  		console.log(data)
		  		if (data != null) {
		  			if (data.final_origin == null){
		  				final_origin = data.amazon_origin  				
		  			}
		  			else {
		  				final_origin = data.final_origin
		  			}
		  		}
		  		else {
		  			final_origin = null
		  		}
		  		generateAddOnDiv(final_origin)
		  },
		  error : function(data){
		  	console.log(data)
		  },
		  dataType: "json",
		  contentType : "application/json; charset=utf-8"
		});
	return final_origin
}	

// adds the product to the database
// function addUrlToDatabase(){

// }


function generateAddOnDiv(final_origin){
	// if there is a center column 
	var center_col_div = document.getElementById("centerCol")
	var add_on_div = document.createElement("div")
	add_on_div.class = "feature"
	add_on_div.style.border = "solid black"
	
	// this says where it's made
	var first_col = document.createElement("div")
	var posted_origin = "unclear"
	if (final_origin != null) {
		posted_origin = final_origin
		first_col.innerText = "Made in " + final_origin
	}
	else {
		first_col.innerText = "Made in ?"
	}

	// this has a link to submission
	var second_col = document.createElement("div")
	var submit_link = document.createElement("a")
	submit_link.href = "https://whereisitmade.herokuapp.com/"
	submit_link.innerText = "Know where it's from? Click here to help us out!"
	second_col.append(submit_link)

	//
	var third_col = document.createElement("div")
	var alternatives_link = document.createElement("a")
	alternatives_link.href = "#"
	alternatives_link.innerText = "Find some alternatives here!"
	third_col.append(alternatives_link)

	add_on_div.append(first_col)
	add_on_div.append(second_col)
	add_on_div.append(third_col)

	center_col_div.insertBefore(add_on_div, center_col_div.firstChild)

}


// get list of divs to check
// ids = ["centerCol", "productDescription_feature_div"]
// firstCheckMadeInAmerica(ids)
var final_origin = checkDatabaseForProduct()
// uses a call back to get final_origin
// generateAddOnDiv(final_origin)
