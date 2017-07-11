var request = require("request");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var inquirer = require("inquirer");
var keys = require("./keys.js");
var fs = require("fs");
var command="";
var secondArg ="";

inquirer.prompt([

  {
    type: "list",
    name: "doingWhat",
    message: "Please choose an option :",
    choices: ["my-tweets", "spotify-this-song", "movie-this","do-what-it-says"]
  }

]).then(function(user) {
    command = user.doingWhat;
    if (user.doingWhat === "my-tweets" || user.doingWhat === "do-what-it-says") {
        choice();
    }else{
        inquirer.prompt([

            {
            type: "input",
            name: "item",
            message: "Please enter your search parameter :"
            }

        ]).then(function(param) {
            if (param.item != ""){
                secondArg = param.item;
            }else{
                secondArg = undefined;
            }
            choice();
        });
    }
});
function choice(){
    switch (command){
        case "my-tweets" :
            tweeter();
            break;
        case "spotify-this-song" :
            spotify();
            break;
        case "movie-this" :
            movie();
            break;
        case "do-what-it-says" :
            random();
            break;
    }
}
//============================ Tweeter function ==========================
function tweeter(){
    
    var client = new Twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });

    var params = {screen_name: 'nodejs'};
    client.get('statuses/user_timeline', {screen_name: '@kai1359', count: 20} , function(error, tweets, response) {
        if (!error) {
            console.log("============== Last 20 tweets =============");
            fs.appendFile("log.txt", "\n============== Last 20 tweets ============="+"\n===========================================", function(err) {
                if (err) {
                    return console.log(err);
                }
            });
            for (var i = 0 ; i < tweets.length; i++){
                console.log("============== tweet number "+(i+1)+" =============");
                console.log("Tweet #"+(i+1)+" : "+tweets[i].text);
                console.log("Created at : "+tweets[i].created_at);
                fs.appendFile("log.txt", "\nTweet #"+(i+1)+" : "+tweets[i].text+"\nCreated at : "+tweets[i].created_at+"\n===========================================", function(err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            };
                console.log("========================================");
        }else{
            console.log(error);
        };
    });
};
//============================ Spotify function ================================
function spotify(){
    if(secondArg == undefined){
        secondArg = "The Sign ace of base";
    }
    var spotify = new Spotify({
        id: keys.spotifyKeys.id,
        secret: keys.spotifyKeys.secret 
    });
    spotify.search({ type: 'track', query: secondArg}).then(function(response) {
        console.log("============ Spotify "+secondArg+" ===========");
        console.log("Artist name : "+response.tracks.items[0].artists[0].name);
        console.log("Song name : "+response.tracks.items[0].name);
        console.log("Album name : "+response.tracks.items[0].album.name);
        console.log("Preview URL : "+response.tracks.items[0].preview_url);
        console.log("==========================================================");
        fs.appendFile("log.txt", "\n=========== Spotify "+secondArg+" ==========="+"\nArtist name : "+response.tracks.items[0].artists[0].name+"\nSong name : "+response.tracks.items[0].name+"\nAlbum name : "+response.tracks.items[0].album.name+"\nPreview URL : "+response.tracks.items[0].preview_url+"\n==========================================================", function(err) {
            if (err) {
                return console.log(err);
            }
        });
    }).catch(function(err) {
        console.log(error);
    });
};
//============================ Movie function ==================================
function movie(){
    var key = keys.imdbKey.consumer_key;
    if(secondArg == undefined){
        secondArg = "Get The Gringo";
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + secondArg + "&y=&plot=short&apikey="+key;
    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          console.log("============================== Movie Information =========================");
          console.log("Movie title : " + JSON.parse(body).Title);
          console.log("Release Year: " + JSON.parse(body).Year);
          console.log("IMDB Rating : " + JSON.parse(body).imdbRating);
          console.log("Rotten Tomato Rating : " + JSON.parse(body).Ratings[1].Value);
          console.log("Country : " + JSON.parse(body).Country);
          console.log("Language : " + JSON.parse(body).Language);
          console.log("Plot : " + JSON.parse(body).Plot);
          console.log("Actors : " + JSON.parse(body).Actors);
          console.log("==========================================================================");
            fs.appendFile("log.txt", "==============================="+"\nMovie title : " + JSON.parse(body).Title+"\nRelease Year: " + JSON.parse(body).Year+"\nIMDB Rating : " + JSON.parse(body).imdbRating+"\nRotten Tomato Rating : " + JSON.parse(body).Ratings[1].Value+"\nCountry : " + JSON.parse(body).Country+"\nLanguage : " + JSON.parse(body).Language+"\nPlot : " + JSON.parse(body).Plot+"\nActors : " + JSON.parse(body).Actors+"\n===============================", function(err) {
                    if (err) {
                        return console.log(err);
                    }
                });
        };
    });
};
//============================ Random function =================================
function random(){
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log(err);
        };  
        var r = Math.floor((Math.random() * 3));

        var dataArray = data.split("\n");
        var dataArg = dataArray[r].split(",");

        command = dataArg[0];
        secondArg = dataArg[1];
        console.log("===================================");
        console.log("Random command is : "+command);
        console.log("Default parameter is : "+secondArg);
        console.log("===================================");
        choice();
    });
};
