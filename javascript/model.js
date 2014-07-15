/********* THING MODEL **********/
// contains all of the things currently created as properties
// can add and remove things

function ThingModel() {
    this.allThings = {};
    this.numThings = 0;
};

ThingModel.prototype.makeStarterThings = function() {
    // PARAMETERS CHEATSHEET 
    // Thing: name
    // Mineral: name, shape
    // LivingThing: name, food
    // Plant: name, food, height (in inches)
    // Animal: name, food, movement, habitat, sound 
    // Pet: humanName, isHappy? 

    this.addThing(this.makeAnyThing("Mineral", null, "Quartz", "Octoganal"));
    this.addThing(this.makeAnyThing("LivingThing", null, "Paramecium", "you don't want to know"));
    this.addThing(this.makeAnyThing("Plant", null, "Venus Fly Trap", "hamburgers", "300"));
    this.addThing(this.makeAnyThing("Animal", null, "Squirrel", "my tomatoes", "climbing", "the backyard", "Eeek!!"));
    this.addThing(this.makeAnyThing("Mineral", null, "Copper", "like abe lincoln's head"));
    this.addThing(this.makeAnyThing("Plant", null, "Juniper Tree", "severed heads", "180"));
    this.addThing(this.makeAnyThing("LivingThing", null, "Toe Fungus", "Soles"));
    this.addThing(this.makeAnyThing("Animal", null, "Seagull", "funnelcake and fish", "flying", "the seaside", "kee!  kee!"));

    this.addThing(this.makeAnyThing("Plant", "Happy", "Cactus", "sunlight and nutrients in the soil", "8"));
    this.addThing(this.makeAnyThing("Animal", "Cody", "Cat", "Cat food", "walking", "house", "mreow"));

    // this.addThing("Rose", this.makeAnyThing("Plant", false, "Rose", "sunlight and nutrients in the soil", "20"));
    // this.addThing("Tiger", this.makeAnyThing("Animal", false, "Tiger", "little children", "Leap", "jungle", "Rawr"));	
    // this.addThing("Bacteria", this.makeAnyThing("Living Thing", false, "Bacteria", "microscopic yumminess"));
    // this.addThing("Best Thing Ever", this.makeAnyThing("Thing", false, "Best Thing Ever"));
    // this.addThing("Cat", this.makeAnyThing("Animal", true, "Cat", "Cat food", "walk", "house", "mreow"));
    // this.addThing("Rabbit", this.makeAnyThing("Animal", true, "Rabbit", "vegetables and hay", "hopp", "house", "thump"));
    // this.addThing("Cactus", this.makeAnyThing("Plant", true, "Cactus", "sunlight and nutrients in the soil", "8"));
    // this.addThing("Rock", this.makeAnyThing("Mineral", true, "Rock", "upside-down"));
};

//note: if you give a new thing the same name as an old thing, 
//old thing will be overwritten
ThingModel.prototype.addThing = function(Thing) {
    this.numThings++;
    return this.allThings[Thing.name] = Thing;
};

ThingModel.prototype.removeThing = function(name) {
    var temp = this.allThings[name]
    delete this.allThings[name];
    this.numThings--;
    return temp; //returns deleted Thing
};

ThingModel.prototype.thingNames = function() {
    var names = [];
    for (property in this.allThings)
        names[names.length] = property;
    return names.toString();
};

ThingModel.prototype.getThing = function(name) {
    return this.allThings(name);
};

//because I can't find a better way to convert a string into a function call
//don't want to use window["string"]...
ThingModel.prototype.stringToThing = function(thingName) {
    if (thingName === "Thing")
        return new Thing();
    else if (thingName === "Mineral")
        return new Mineral();
    else if (thingName === "LivingThing")
        return new LivingThing();
    else if (thingName === "Plant")
        return new Plant();
    else if (thingName === "Animal")
        return new Animal();
    else
        throw new Error("incorrect thingName: " + thingName);
};

//can accept arguments as an array, or as a split list
ThingModel.prototype.makeAnyThing = function(type, petName /*args*/ ) {

    var args = Array.prototype.slice.call(arguments, 2);
    //why this Array.prototype nonsense?  because arguments is only "array-like" 

    //if first argument in args is an array, then the args were passed as an array originally. 
    if (args[0] instanceof Array)
        args = args[0]; //reassigns args array to the originally-passed argument array 

    //Would prefer to avoid this giant, repetitive if-statement...

    var newThing;

    //note: I have an unknown # of arguments, so I have to use the apply method.  
    if (type.indexOf("Animal") >= 0) {
        newThing = new Animal(); //created w/o arguments.  Needed to pass as context to apply
        newThing = Animal.prototype.constructor.apply(newThing, args);
    } else if (type.indexOf("Plant") >= 0) {
        newThing = new Plant(); //created w/o arguments.  Needed to pass as context to apply
        newThing = Plant.prototype.constructor.apply(newThing, args);
    } else if (type.indexOf("LivingThing") >= 0) {
        newThing = new LivingThing(); //created w/o arguments.  Needed to pass as context to apply
        newThing = LivingThing.prototype.constructor.apply(newThing, args);
    } else if (type.indexOf("Mineral") >= 0) {
        newThing = new Mineral(); //created w/o arguments.  Needed to pass as context to apply
        newThing = Mineral.prototype.constructor.apply(newThing, args);
    } else if (type.indexOf("Thing") >= 0) {
        newThing = new Thing(); //created w/o arguments.  Needed to pass as context to apply
        newThing = Thing.prototype.constructor.apply(newThing, args);
    } else throw new Error("passed an incompatible type: " + type);

    if (petName) {
        var petMixin = new Pet(petName, true);
        mixIntoPet(newThing, petMixin); //mixIntoPet is in utils
    }

    return newThing;

};

ThingModel.prototype.getEssentialStats = function(thingName) {

};