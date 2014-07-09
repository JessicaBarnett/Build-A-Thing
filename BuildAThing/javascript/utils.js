
	/****** UTILITIES ******/

	function bind(func, object){
	  //used to bind a particular "this" to a function which will be passed down to other contexts later
	  //returns bound function
	  return function(){
	    return func.apply(object, arguments); //object is presumably the "this" keyword
	  };
	}

	//makes the old prototype object the prototype of the new prototype object
	//hence all its properties/methods get passed down
	function clone(object){
	  function OneShotConstructor(){}
	  OneShotConstructor.prototype = object;
	  return new OneShotConstructor();
	}

	//for each property in an object, do this action
	function forEachIn(object, action) {
	  for (var propertyName in object){
	    //if (object.hasOwnProperty.call(object, propertyName))  
	      action(propertyName, object[propertyName]);
	  }
	}

	//for multiple inheritance
	//Adds properties/methods of mixin to object
	//*** Now Using mixIntoPet instead ***
	function mixInto(object, mixIn){
	  forEachIn(mixIn, function(propertyName, value){
	    object[propertyName] = value;
	  });
	}


	//for multiple inheritance
	//Adds properties/methods of mixin to object if 
	//if they are shared by both Pet and Base Constructor, 
	//or are unique to the Pet constructor
	//allows All kinds of things to be mixed into Pet 
	function mixIntoPet(object, mixIn){
		forEachIn(mixIn, function(propertyName, value){
			if(object[propertyName] || mixIn._isPetProperty(propertyName)){
	    		object[propertyName] = value;
	    		//console.log("adding " + propertyName + " to " + object.name);
	    	}
	 	});
	}

	/*cycles through an array doing function action to each. 
	does same as a for loop, but is reusable.*/
	function forEach(array, action){
	  for (var i = 0; i < array.length; i++)
	    action(array[i]);
	}
