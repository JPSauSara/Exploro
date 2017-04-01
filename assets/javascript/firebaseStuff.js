// Initialize Firebase
var config = {
    apiKey: "AIzaSyDNBDkxaoN6kJ7ZH6DuNp3lhAjkmhi5oow",
    authDomain: "plan-my-date.firebaseapp.com",
    databaseURL: "https://plan-my-date.firebaseio.com",
    storageBucket: "plan-my-date.appspot.com",
    messagingSenderId: "878178355337"
};
firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();


// wrapper function - empties all data in database
function emptyDB(){
	database.ref().set("");
}	


/* Issue: doesn't check if user already exists, so will add duplicates
*
*  Adds a new user to user-node
*  uses randomly generate key # from FB as user ID, but this isn't used for anything 
*/
function addUser(newUser) {			
	var newUserKey = database.ref('users/').push().key;

	newUser.id = newUserKey;
	//console.log("newUser.id= " + newUser.id);

	database.ref('users/'+ newUserKey).update(newUser);
}


/* Adds an itinerary with FB generated key # as the itinerary's name
*  
*  Doesn't do anything if user's email isn't in FB 
*/
function addItinerary(user, itinerary){
		
	// get the user via their email address
	database.ref().child('users').orderByChild('email').equalTo(user.email)
	.on('child_added', function(snapshot) {
	
		var usrID = snapshot.val().id;

		// add to users tree add user's key-id and store the itinerary in their itinerary tree 
		database.ref('users/'+ usrID + '/itineraries/').push(itinerary);
    });
}

/* Get user's itineraries by their email
* 
*  Nothing happens if the email address isn't in FB
*/
function getUserEmail(userEmail) {

    database.ref().child('users').orderByChild('email').equalTo(userEmail)
        .on('child_added', function (snapshot) {

            ssVal = snapshot.val()

            // console.log(JSON.stringify(ssVal));

            // store all ss.Val()'s itineraries as an Object in ssValItin
            var ssValItin = snapshot.val().itineraries;


            // prop = each itinerary in user.itineraries
            for (prop in ssValItin) {

                var anItin = ssValItin[prop]; // ssValItin.-KgRO-lyAbSgG9I3y21L = [Object, Object, Object]
                // anItin = rando-key whose type = array (of objects)

                // step thru anItin = array[3]
                anItin.forEach(function (evnt) {


                    evnt.forEach(function (evnt) {

                        // send each Event-object to webpage
                        //$("#userEmailOutput").append("<p>" + JSON.stringify(evnt) + "</p>");

                        for (prp in evnt) {
                            //console.log('evnt.' + prp, '= ', evnt[prp]);
                            $("#userEmailOutput").append("<br>" + prp + ": " + evnt[prp]);
                        }
                        $("#userEmailOutput").append("<br>");
                    });

                });

                $("#userEmailOutput").append("<br>");
            }
        });
}





// Below NOT USED !!!!!!!!!
/* Finds user by name and returns a snapshot of all its data to console
*  
*  Nothing happens if user doesn't exist
*/
/*
function getAllUserInfo(userName){	
	
	database.ref().child('users').orderByChild('name').equalTo(userName.name)
	.once('child_added', function(snapshot) {
	   console.log("US snapshot= "  + snapshot);
	   console.log("US snapshot.val= "  + snapshot.val);
	   console.log("US keys= " + Object.keys(snapshot));
       console.log("US values= " + Object.values(snapshot));          
    });
	
	console.log("getUserSnapshot called");
}*/


// -- Below just for Testing -- //

/* 
var aUser1 = {
	name: "Benson Hendersonnnn",
	email: "bendo@outlook.com",
	id: "",
	itineraries: ""
}

var itinerary1 = [
{
"Date_Time:":"Saturday, March 25 2017, 12:00:00 am",
"Event:":"\"Pizza Parade\" Walking Tour",
"Description:":"Pizza Parade: Get the (Deep) Dish on This Culinary Tour Dive into the best pizza pie San Francisco has to offer on this guided tasting tour through the trendy neighborhoods around Beach and Mason Streets. You'll sample hand-tossed, stuffed, deep-dish, wood-fired crispy and more, with a variety of toppings, from the city's most famed pizza purveyors on this fun and filling outing, while learning about local history and landmarks from your friendly and knowledgeable guide",
"Venue:":"San Francisco Maritime Museum 900 Beach Street at the foot of Polk  San Francisco, California"
},

{
"Date_Time:":"Saturday, March 25 2017, 10:00:00 am",
"Event:":"Worshiping Women: Power and Devotion in Indian Painting",
"Description:":"Female power and its personifications hold an important place in Hindu devotional practices. The goddess figure represents the primordial female force—both in its creative and destructive aspects—underlying nature (prakriti) and power (shakti). As Devi (Great Goddess), divine female energy is worshiped under different names and visual forms. She may be the local village goddess, the powerful Durga, the frightening Kali, the benevolent Lakshmi or the devoted Sita. Goddesses are sometimes diviniti",
"Venue:":"Asian Art Museum 200 Larkin St  San Francisco, California 94102"
},

{
"Date_Time:":"Saturday, March 25 2017, 10:00:00 am",
"Event:":"Paintings by Sue Lassetter",
"Description:":"Paintings by Sue Lassetter, Artist Member at The Marin Museum of Contemporary Art",
"Venue:":"WestAmerica Bank 7333 Redwood Hwy  Novato, California 94945"
}];

aUser1.name = "lee@aol.com"

addItinerary(aUser1, itinerary1);
*/


/*
// -- testing stuff below -- //
function typeOf(input, varName){	
	console.log("type of '" + varName + "' =  " + jQuery.type(input) + "  ie= " + input);
}

function type(input, varName){	
	console.log(varName + "= " + jQuery.type(input) + "   ie= " + input);
}

function strfy(input, varName){	
	console.log("var '" + varName + "' strfy'd = " + JSON.stringify(input));
}

function out(input, varName){
	console.log(varName + "= " + input);
}	*/