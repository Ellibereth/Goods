
var this_asin = window.location.href.split("/dp/")[1].substring(0,10)
api_url = "https://whereisitmade.herokuapp.com/"
// checks the database if we have the product already
// if not then we add the url to the database then check again
function checkDatabaseForProduct(){

	var form_data = JSON.stringify({
		"this_asin" : this_asin
	})
	$.ajax({
		  type: "POST",
		  url: api_url  + "/getAmazonProductInformationFromAsin",
		  data: form_data,
		  success: function() {
		  		window.location.reload();
		  },
		  error : function(data){
		  	console.log(data)
		  	return data.final_origin
		  },
		  dataType: "json",
		  contentType : "application/json; charset=utf-8"
		});
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
	first_col.innerText = "Made in " + final_origin

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
generateAddOnDiv(final_origin)
