/*
	PARAMETERS CHEATSHEET 
	I wrote them, but even I can't even remember what they all are

	Thing: name
	Mineral: name, shape
	LivingThing: name, food
	Plant: name, food, height (in inches)
	Animal: name, food, movement, habitat, sound 
	Pet: humanName, isHappy? 
*/


//********  TESTS  ********//

	//runInheritanceTests();
	//runDOMtests();
	//thisTest();
	//modelTest();
	

	//makeGridTest(thingModel);



	function makeGridTest(thingModel){
		//thingView, thingModel

		thingView.makeGrid(thingModel);
	}

	function modelTest(){
		var mod = new ThingModel();

		//can make objects and use methods
		var newThing = mod.makeAnyThing("Thing", "Toaster");
		newThing.print();

		//can make all kinds of objects
		console.log(mod.makeAnyThing("Mineral", "Quartz", "Octoganal"));
		console.log(mod.makeAnyThing("LivingThing", "Paramecium", "you don't want to know"));
		console.log(mod.makeAnyThing("Plant", "Venus fly trap", "hamburgers", "300"));
		console.log(mod.makeAnyThing("Animal", "Squirrel", "my tomatoes", "climbing", "the backyard", "Eeek!!"));

		//can add Things to ThingModel
		mod.addThing("Copper", mod.makeAnyThing("Mineral", "Copper", "like abe lincoln's head"));
		mod.addThing("JuniperTree", mod.makeAnyThing("Plant", "Juniper Tree", "severed heads", "180"));
		mod.addThing("ToeFungus", mod.makeAnyThing("LivingThing", "Toe Fungus", "Soles"));
		mod.addThing("Seagull", mod.makeAnyThing("Animal", "Seagull", "funnelcake and fish", "flying", "the seaside", "kee!  kee!"));

		console.log("Added 4 things: ");
		console.log(mod.thingNames());

		//can remove Things from ThingModel
		mod.removeThing("Copper");
		mod.removeThing("JuniperTree");

		console.log("removed 2 things: ");
		console.log(mod.thingNames());

	}


	//note: the thisTest was meant to be tested with all the other code, 
	//inside an anonymous closure function.  might not work as expected in the global space...
	function thisTest(){
		//you can't pass a this that points to a context that doesn't exist yet...
		var testThing; 
		testThing = new Thing();  //hence this
		console.log(testThing);

		testThing = Thing.prototype.constructor.apply(testThing, ["Eyeore"]); 
		console.log(testThing);

		console.log(this); //window 
		console.log(this["Thing"]); 
		//if this refers to window, this should give me the Thing Constructor...?
		//nope.  undefined.  
	}


	function runDOMtests(){
		var happy = new Plant("Cactus", "sunlight and nutrients in the soil", "8");
		PetMixin = new Pet("Happy", true);
		mixIntoPet(happy, PetMixin);

		var flower = new Plant("rose", "sunlight and nutrients in the soil", "20");

		makeStatList(happy, $("div#status"));
		makeStatList(flower, $("div#status"));
	}

	function runInheritanceTests(){

		/*******  LINE BREAK FUNCTION TO MAKE THINGS PRETTY IN THE CONSOLE!  *******/

		function lineBreak(text){
			console.log("******************  "+text+"  ********************");
		}

		/******* NOW TO MAKE SOME THINGS  *******/

		lineBreak("thing");

		var something = new Thing("Best Thing Ever");
		something.print(); //from Thing
		something.kick(); //from Thing

		lineBreak("rock");

		var rock = new Mineral("rock", "spider-like");
		rock.print(); //from Thing
		rock.kick(); //from Thing

		lineBreak("bacteria");

		var bacteria = new LivingThing("bacteria", "microscopic yumminess");
		bacteria.print();//from LivingThing.  extends Thing.print
		bacteria.kick();//redefined in LivingThing

		lineBreak("flower");

		var flower = new Plant("rose", "sunlight and nutrients in the soil", "20");
		flower.print() //from Plant.  Extends LivingThing.print (which extends Thing.print)
		flower.grow(); //from Plant
		flower.printHeight();//from Plant
		flower.printEnergy();//inherited from LivingThing 
		flower.kick(); //inherited from LivingThing (from Thing)


		lineBreak("tiger");

		var tiger = new Animal("Tiger", "little children", "Leap", "jungle", "Rawr");
		tiger.print(); //from Animal.  Extends LivingThing.print (which extends Thing.print)
		tiger.kick(); //redefined in Animal 
		tiger.move(); //from Animal
		tiger.printEnergy();//inherited from LivingThing
		tiger.eat(); //inherited from LivingThing

		lineBreak("cody the cat");

		var cody = new Animal("Cat", "Cat food", "walk", "house", "mreow");
		var PetMixin = new Pet("Cody", true);

		mixIntoPet(cody, PetMixin);

		cody.print(); //from Pet.  Extends Animal.print (which extends LivingThing.print/Thing.print)
		cody.eat();//from Pet.  Extends LivingThing.eat
		console.log(cody.isHappy());
		cody.kick(); //from Pet.  Extends Animal.kick
		console.log(cody.isHappy()); //from Pet
		cody.move(); //from Animal
		cody.pet(); //from Pet

		lineBreak("honey the rabbit");

		var honey = new Animal("Rabbit", "vegetables and hay", "hopp", "house", "thump");
		PetMixin = new Pet("Honey", true);

		mixIntoPet(honey, PetMixin);

		honey.print();//from Pet. Extends Animal.print (which extends LivingThing.print/Thing.print)
		honey.kick();//from Pet.  Extends Animal.kick
		honey.move();//from Animal
		honey.eat();//from Pet.  Extends LivingThing.eat
		honey.pet();//from Pet
		honey.printEnergy();//inherited from livingThing


		lineBreak("happy the cactus");

		var happy = new Plant("Cactus", "sunlight and nutrients in the soil", "8");
		PetMixin = new Pet("Happy", true);

		mixIntoPet(happy, PetMixin);

		happy.print(); //from Pet.  Extends Plant.print (which extends LivingThing.print/Thing.print)
		happy.kick();//from Pet.  Extends Plant.kick
		console.log("Happy" + happy.isHappy()); //from Pet
		happy.printHeight(); //from Plant
		happy.grow(); //from Plant
		happy.printHeight();//from Plant
		happy.printEnergy();//inherited from LivingThing
		happy.pet = function(){
			console.log("OUCH!!!!  Why did you pet a cactus?!!");
			Pet.prototype.pet.apply(this);
			console.log("...and probably evil.");
		};
		happy.pet(); //from Pet

		lineBreak("my Pet Rock");

		var myPetRock = new Mineral("rock", "upside-down");
		PetMixin = new Pet("Stormageddon", true);

		mixIntoPet(myPetRock, PetMixin);

		myPetRock.print(); //from Thing
		myPetRock.kick(); //from Thing
		console.log(myPetRock.humanName + myPetRock.isHappy()); //from Pet
		myPetRock.pet(); //from Pet
	}

