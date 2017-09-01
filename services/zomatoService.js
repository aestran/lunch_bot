var zomato = require('zomato');
var Restaurant = require('./zomato/Restaurant.js');


let selectedCuisines = ["British", "Chinese"];

let client = zomato.createClient({
    userKey: '4a3b30ef356a829e79e73f8886f0aa0e',
});

//3rd
function restaurants(locations, cuisines, callback) {

    let cuisineIds = new Array();
    selectedCuisines.forEach(function(cuisine) {
        let cuisineId = getcuisineId(cuisine, cuisines);
        console.log("cuisineId returned " + cuisineId);
        cuisineIds.push(cuisineId);
    })

    client.search({
        entity_id: locations[0].id, //location id 
        entity_type: "city", // location type (city,subzone,zone , landmark, metro,group) 
        count: "3", // number of maximum result to display 
        start: "1", //fetch results after offset 
        radius: "10000", //radius around (lat,lon); to define search area, defined in meters(M) 
        cuisines: cuisineIds, //list of cuisine id's separated by comma 
        sort: "rating", //choose any one out of these available choices 
        order: "asc" // used with 'sort' parameter to define ascending(asc )/ descending(desc) 

    }, function(err, restaurants) {
        if (!err) {
            let parsedResponse = JSON.parse(restaurants);
            let sortedRestaurents = new Array();
            parsedResponse.restaurants.forEach(function(restaurantData) {
                var restaurant = new Restaurant(restaurantData.restaurant);
                sortedRestaurents.push(restaurant);
                console.log('Restaurant added')
            })

            callback(err, sortedRestaurents)
        } else {
            console.log(err);
        }
    });
}

//2nd
function getCuisines(locations, callback) {
    client.getCuisines({
        city_id: locations[0].id,

    }, function(err, result) {
        if (!err) {
            let cuisineResult = JSON.parse(result);
            let cuisines = cuisineResult.cuisines;
            restaurants(locations, cuisines, callback);
        } else {
            console.log(err);
        }
    });
}

function getCity(lat, long) {

}

//utils
function getcuisineId(cuisineName, cuisines) {
    let availableCuisines = cuisines;
    let cuisineId = "";
    availableCuisines.forEach(function(availableCuisine) {
        if (availableCuisine.cuisine.cuisine_name == cuisineName) {
            console.log("entered loop returning " + availableCuisine.cuisine.cuisine_id)
            cuisineId = availableCuisine.cuisine.cuisine_id;
        }
    })
    return cuisineId;
}


function addQuotes(string) {
    return '"' + string + '"';
}

module.exports = {
    requestLocations: function(callback) {
        client.getCities({
                q: "Belfast",
                count: "1"
            },
            function(err, result) {
                if (!err) {
                    let cityResponse = JSON.parse(result);
                    let locations = cityResponse.location_suggestions;
                    let cuisines = getCuisines(locations, callback);
                    console.log('Function returned ${cuisines}')
                } else {
                    console.log(err);
                }
            })
    }
}

var Buz = function () {};

Buz.prototype.requestLocations = function(callback) {
        client.getCities({
                q: "Belfast",
                count: "1"
            },
            function(err, result) {
                if (!err) {
                    let cityResponse = JSON.parse(result);
                    let locations = cityResponse.location_suggestions;
                    let cuisines = getCuisines(locations, callback);
                    console.log('Function returned ${cuisines}')                   
                } else {
                    console.log(err);
                }
            })
    }

    module.exports = new Buz();

require('make-runnable');