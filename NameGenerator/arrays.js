var Generator = new NameGenerator();

function forEach(array, action){
  for (var i = 0; i < array.length; i++)
    action(array[i]);
}


/******NAME GENERATOR OBJECT*******/

function NameGenerator(){
	this.prefix = ["The exalted", "Mr", "Ms", "Dr", "the honourable", "the estranged", "the coolest of the cucumbers"];
	this.givenName =["Alice", "Bob", "Corinne", "David", "Eloise", "Fattah", "Gwen", "Henry", "Isabella"];
	this.surname = ["Smith", "Hamilton", "Johnson", "Anderson", "Robinson", "Hernandez"];
	this.suffix = ["the third", "the twenty-third", "and friends", "the monarch of england", "the president of the United states", "is super awesome", "is weird", "smells", "is Batman"];
}	

//returns array
NameGenerator.prototype.getAllArrays= function(){
		return [this.prefix, this.givenName, this.surname, this.suffix];
	};

//returns nothing
NameGenerator.prototype.printAllArrays = function(){
		forEach(this.getAllArrays(), function(arrayElement){
			console.log(arrayElement.toString());
		});
	};

//returns nothing
NameGenerator.prototype.addName = function(array, addition){
		forEach(addition.split(", "), function(element){
			array.push(element);
		});
	};

//returns nothing
NameGenerator.prototype.addNamePieces = function(){
	var $prefixInput = $("input#prefix"), $givenNameInput= $("input#givenName"), 
		$surnameInput= $("input#surname"), $suffixInput= $("input#suffix");

	if ($prefixInput.val()){
		this.addName(this.prefix, $prefixInput.val());
		$prefixInput.val("");
	}

	if ($givenNameInput.val()){
		this.addName(this.givenName, $givenNameInput.val());
		$givenNameInput.val("");
	}

	if ($surnameInput.val()){
		this.addName(this.surname, $surnameInput.val());
		$surnameInput.val("");
	}

	if ($suffixInput.val()){
		this.addName(this.suffix, $suffixInput.val());
		$suffixInput.val("");
	}

	this.printAllArrays();
}

//returns string
NameGenerator.prototype.assembleName = function(){
	var name = "";
	var arrays = this.getAllArrays()
	forEach(arrays, function(array){
		 name += array[Math.floor(Math.random()*array.length)] + " ";
	});
	return name;
}

//takes int
//returns array
NameGenerator.prototype.assembleMultipleNames = function(numberOfNames){
	var names = [];
	for (var i = 0; i< numberOfNames; i++)
		names[i] = this.assembleName();
	return names;
}

//takes Array
//returns nothing
NameGenerator.prototype.printNamesToDoc = function(names){
	var $namesDiv = $("#names");
	$("label[for='names']").show();
	$namesDiv.children().remove();
	forEach(names, function(element){
		$namesDiv.append("<pre>"+element+"</pre>");
	});
	
}


/******UTILITIES******/

function setUp(){

	$("#addName button").click(function(){Generator.addNamePieces();});
	$("#generateNames button").click(function(){
			var numberOfNames = $("#numOfNames").val();
			var namesArray = Generator.assembleMultipleNames(numberOfNames);
			Generator.printNamesToDoc(namesArray);
		});
}


setUp();






