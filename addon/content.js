


// function foundMadeInUsa() {
// 	var x = document.getElementById("imgTagWrapperId");
// 	var img = generateImage();
// 	var modal_div = generateModalList();
// 	if (!x.firstChild.isEqualNode(img)) {
// 		x.insertBefore(img, x.firstChild);
// 		x.append(modal_div)
// 	}
// }

// function generateModalList(){
// 	var modal_div = document.createElement("div")
// 	modal_div.setAttribute("id" , "add_on_modal_div");
// 	modal_div.setAttribute("class", "modal");
// 	modal_div.style.visibility = "hidden"

// 	var modal_list = document.createElement("ul")
// 	modal_list.setAttribute("id", "modal_list")
// 	// popup_list.style.height = 20
// 	// popup_list.style.width = 20

// 	var list = ['AG1', '']
// 	for (var i = 0; i < 5; i++) {
// 		var list_item = document.createElement("li")
// 		list_item.innerText = "AG" + i;
// 		modal_list.append(list_item)
// 	}

// 	modal_div.append(modal_list)
// 	return modal_div
// }

// function generateImage() {
// 	var img = document.createElement("img");
// 	img.setAttribute("src", "http://icons.iconarchive.com/icons/custom-icon-design/flag-3/256/United-States-Flag-icon.png");
// 	img.setAttribute("id", "usa_good_img")
// 	function mouseOver() {
// 		console.log("mouseOver")
// 		document.getElementById('add_on_modal_div').style.visibility="visible";
// 		document.getElementById('add_on_modal_div').style.height = 40;
// 	}
// 	function mouseOut() {
// 		console.log("mouseout")
// 		document.getElementById('add_on_modal_div').style.visibility="hidden";
// 		document.getElementById('add_on_modal_div').style.height = 0;
// 	}
// 	img.onmouseover = mouseOver;
// 	img.onmouseout = mouseOut;
// 	return img
// }



// function checkTitle(word) {
// 	var x = document.getElementById("productTitle");
// 	var boolean_statement = x.innerHTML.search(word);
// 	if (boolean_statement > 0) {
// 		foundMadeInUsa()
// 	}
// }

// function checkMadeInAmerica(x) {
// 	var target_strings = ["made in", "usa"]
// 	if (x == null) {
// 		console.log("skipped for null")
// 		return;
// 	}

// 	if (x.tagName == 'SCRIPT') {
// 		console.log('skipped for script')
// 		return;
// 	}
// 	var children_list = x.childNodes;

// 	// if there are no child nodes, check inner html and it is not a script tag
// 	if (children_list.length < 2) {
// 		// if there is no inner html then return 
// 		if (x.innerText != null && x.innerText != null){
// 			var isMadeInUsa = true;
			
// 			for (var j = 0; j < target_strings.length; j++) {
// 				if (x.innerText.toLowerCase().search(target_strings[j]) == -1) {
// 					isMadeInUsa = false;
// 				}
// 			}
			
// 			if (isMadeInUsa) {
// 				// console.log(x.innerText)
// 				// console.log(x)
// 				foundMadeInUsa()
// 			}
// 		}
// 	}

// 	else {
// 		for (var i = 0; i < children_list.length; i++){
// 			checkMadeInAmerica(children_list[i])
// 		}
// 	}
// }

// function firstCheckMadeInAmerica(ids) {
// 	for (var i = 0; i < ids.length; i ++) {
// 		// var x = document.getElementById("dp")
// 		var x = document.getElementById(ids[i])
// 		checkMadeInAmerica(x)	
// 	}
	
// }

// var word = "Russ"


function generateAddOnDiv(){
	// if there is a center column 
	var center_col_div = document.getElementById("centerCol")
	var add_on_div = document.createElement("div")
	add_on_div.class = "feature"
	add_on_div.style.border = "solid black"
	
	// this says where it's made
	var first_col = document.createElement("div")
	first_col.innerText = "Made in ?"

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

generateAddOnDiv()

console.log("ran")