
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
    //if (object.hasOwnProperty(propertyName))  
    	//shouldn't really be taking this out, but the methods are getting bumped as not-own-properties
    	//even though they are overwritten/redefined in Pet...?
      action(propertyName, object[propertyName]);
  }
}

//for multiple inheritance
function mixInto(object, mixIn){
  forEachIn(mixIn, function(propertyName, value){
  	//console.log("propertyName = " + propertyName + "  Value = "+ value);
    object[propertyName] = value;
  });
};

/********  	PROTOTYPES   ********/

	function Thing(name, type){
		this.name = name;
		this.type = type;
	}

	Thing.prototype.print = function(){
		console.log("This is a " + this.name + ". It is a " + this.type  + ".");
	};

	Thing.prototype.kick= function(){
		console.log("You kicked the " + this.name + "!  Thunk!");
	};

//livingThing inherits Thing

	function LivingThing(name, type, food){
		Thing.call(this, name, type);
		this.food = food;
		this.energy = 10;
	}
	LivingThing.prototype = clone(Thing.prototype);
	LivingThing.prototype.constructor = LivingThing;


	LivingThing.prototype.kick = function(){
		console.log("You kicked the " + this.name + "!  Squish!!");
	}

	LivingThing.prototype.eat= function(){
		this.energy++;
		console.log("The " + this.name + " is eating " + this.food + "!")
	};

	LivingThing.prototype.printEnergy = function(){
		console.log("it has " + this.energy + " energy");
		return this.energy;
	}

	LivingThing.prototype.print= function(){
		Thing.prototype.print.apply(this);//extending Thing.print
		console.log("It eats " + this.food + " and has " + this.energy + " energy.");
	};

//Plant inherits LivingThing (And thus Thing)

	function Plant(name, type, food, height){
		LivingThing.call(this, name, type, food);
		this.height = height;
	}
	Plant.prototype = clone(LivingThing.prototype);
	Plant.prototype.constructor = Plant;

	Plant.prototype.grow= function(){
		this.height++;
		this.energy--;
		console.log("This " + this.name + " has grown a little bit!");	
	};

	Plant.prototype.printHeight = function(){
		console.log("It is " +this.height+ " inches tall");
	}

	Plant.prototype.print= function(){
		LivingThing.prototype.print.apply(this); //Extends LivingThing.print
		this.printHeight();
	};

//Animal inherits LivingThing (and thus Thing)

	function Animal(name, type, food, movement, habitat, sound){
		LivingThing.call(this, name, type, food);
		this.movement = movement;
		this.habitat = habitat;
		this.sound = sound;
	}
	Animal.prototype = clone(LivingThing.prototype);
	Animal.prototype.constructor = Animal;


	//Extends LivingThing.print
	Animal.prototype.print = function(){
		LivingThing.prototype.print.apply(this); //Extends LivingThing.print
		console.log("It lives in the "+this.habitat+", moves by "+this.movement+"ing and makes a " +this.sound+ " sound.");
	};

	//Overrides LivingThing.kick
	Animal.prototype.kick =function(){
		console.log("You kicked the " + this.name + ".  It bites you!!");
	};

	Animal.prototype.eat = function(){
		this.energy++;
		console.log("The " + this.name + " is eating " + this.food + "!")
	}

	Animal.prototype.move = function(){
		this.energy-= 2;
		console.log("The " + this.name + " is " + this.movement + "ing around!");
	};

	Animal.prototype.makeSound = function(){
		console.log("You hear a mysterious \'" + this.sound + "\' coming from the " + this.habitat +".");
	};


//Pet can mix with either LivingThing, Animal or Plant.  
//Anything with an eat, kick, and print function
	function Pet(humanName, happy){
		this.happy = happy;
		this.humanName = humanName;
	}

	//Extends Animal.print or Plant.print
	Pet.prototype.print = function(){
		console.log("This is " + this.humanName + ".");

		if (this instanceof Animal)
			Animal.prototype.print.apply(this); //uses the Prototype's print method first.  Could be either Plant or Animal
		else if(this instanceof Plant)
			Plant.prototype.print.apply(this); 

		console.log(this.humanName + this.isHappy());
	};

	//Extends Animal.print or Plant.print
	Pet.prototype.eat = function(){
		LivingThing.prototype.eat.apply(this);
		this.happy = true;
	}

	//Extends Animal.print or Plant.print
	Pet.prototype.kick = function(){
		if (this instanceof Animal)
			Animal.prototype.kick.apply(this); //uses the Prototype's print method first.  Could be either Plant or Animal
		else if(this instanceof Plant)
			Plant.prototype.kick.apply(this); 
		this.happy = false;
	}

	Pet.prototype.pet = function(){
		//console.log("in pet!!");
		this.happy = true;
		console.log("You are petting " + this.humanName + ". It is happy!");
	};

	Pet.prototype.isHappy = function(){
		//console.log("in pet!!");
		return this.happy ? " is very happy!" : " is not happy : (";
	}

/*******  LINE BREAK FUNCTION TO MAKE THINGS PRETTY IN THE CONSOLE!  *******/

function lineBreak(text){
	console.log("******************  "+text+"  ********************");
}

/******* NOW TO MAKE SOME THINGS  *******/

lineBreak("rock");

var rock = new Thing("rock", "mineral");
rock.print();
rock.kick();

lineBreak("bacteria");

var bacteria = new LivingThing("bacteria", "single-cell organism", "microscopic yumminess");
bacteria.print();
bacteria.kick();

lineBreak("flower");

var flower = new Plant("rose", "plant", "sunlight and nutrients in the soil", "20");
flower.print() //inherited from Plant
flower.grow(); //inherited from Plant
flower.printHeight();
flower.printEnergy();
flower.kick(); //inherited from Thing


lineBreak("tiger");

var tiger = new Animal("Tiger", "Animal", "little children", "Leap", "jungle", "Rawr", true);
tiger.print(); //inherited from Animal
tiger.kick(); //inherited from Animal
tiger.move(); //inherited from Animal
tiger.printEnergy();
tiger.eat(); //inherited from LivingThing

lineBreak("cody the cat");

var cody = new Animal("Cat", "Animal", "Cat food", "walk", "house", "mreow");
var PetMixin = new Pet("Cody", true);

mixInto(cody, PetMixin);

cody.print(); //inherited from Pet
cody.eat();//inherited from LivingThing
console.log(cody.isHappy());
cody.kick(); //inherited from Animal
console.log(cody.isHappy());
cody.move(); //inherited from Animal
cody.pet(); //inherited from Pet

lineBreak("honey the rabbit");

var honey = new Animal("Rabbit", "Animal", "vegetables and hay", "hopp", "house", "thump");
PetMixin = new Pet("Honey", true);

mixInto(honey, PetMixin);

honey.print(); //inherited from Pet
honey.kick(); //inherited from Animal
honey.move(); //inherited from Animal
honey.eat(); //inherited from LivingThing and Pet
honey.pet(); //inherited from Pet
honey.printEnergy(); //inherited from livingThing


lineBreak("happy the cactus");

var happy = new Plant("Cactus", "plant", "sunlight and nutrients in the soil", "8");
PetMixin = new Pet("Happy", true);

mixInto(happy, PetMixin);

happy.print(); //inherited from Pet 
happy.kick();
console.log("Happy" + happy.isHappy());
happy.printHeight();
happy.grow(); //inherited from Plant
happy.printHeight();
happy.printEnergy();
happy.pet = function(){
	console.log("OUCH!!!!  Why did you pet a cactus?!!");
	Pet.prototype.pet.apply(this);
	console.log("...and probably evil.");
}
happy.pet();







