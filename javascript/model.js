/********* THING MODEL **********/
// contains all of the things currently created as properties
// can add and remove things

function ThingModel() {
    this.allThings = {};
    this.numThings = 0;
};

ThingModel.prototype.makeStarterThings = function() {
    // PARAMETERS CHEATSHEET 
    // makeAnyThing: Type, petName or null, arguments
    // Thing: name
    // Mineral: name, shape
    // LivingThing: name, food
    // Plant: name, food, height (in inches)
    // Animal: name, food, movement, habitat, sound 
    // Pet: humanName, isHappy? 
    //non-pets need to pass null as 2nd parameter.  pets will pass a pet name.

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

    this.addThing(this.makeAnyThing("Plant", null, "Rose", "sunlight and nutrients in the soil", "20"));
    this.addThing(this.makeAnyThing("Animal", null, "Tiger", "little children", "Leap", "jungle", "Rawr"));
    this.addThing(this.makeAnyThing("Living Thing", null, "Toaster", "Bread!"));

    this.addThing(this.makeAnyThing("Thing", "Thingy", "Best Thing Ever"));
    this.addThing(this.makeAnyThing("Animal", "Honey", "Rabbit", "vegetables and hay", "hopp", "house", "thump"));
    this.addThing(this.makeAnyThing("Mineral", "Rocky", "Rock", "upside-down"));
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

//returns string containing all Thing Names in allThings
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
    } else if (type.indexOf("Living Thing") >= 0) {
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

//returns true if passed stat is essential, meaning it gets updated
//and the user needs to see it easily
ThingModel.prototype.isEssentialStat = function(stat) {
    var essentialStats = ["energy", "happy", "height"];
    return essentialStats.indexOf(stat) >= 0;
};