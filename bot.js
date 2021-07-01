/*TODO:
Date.Day() starts on Sun NOT Mon, this must be adjusted. e.g. thurs = 4 so there's too much offset when doing simple Day * 16. refer to notes.
Check to see if the Offset value is actually correct for all days.
Focus on making !nxt work first - and change ternary operator for position to a generic value OR < 27
check for other headaches.
*/


var Discord = require('discord.io');
var logger = require('winston');
//var auth = require('./auth.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
//var bot = new Discord.Client()
///bot.login(process.env.BKBT_TOKEN)
var bot = new Discord.Client({
   token: process.env.BKBT_TOKEN,
   autorun: true});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username);
});

var RotLth = 112;
var OfsT = 4;

var Rotnew = ["Ghost Town",	
"Highway",
"El Halluf",
"Steppes",
"Sand River",
"Kasserine",
"Dezful",
"Westfield",	
"Himmelsdorf",	
"Ghost Town",	
"Sunset Coust",	
"Malinovka",
"Overlord",
"Fisherman's Bay",
"El Alamain",
"Cao Bang",
"Arctic Region"	,
"Pilsen",
"Fredvang",	
"Mountain Pass",
"Cliff",
"Vineyard",	
"Westfield",	
"Prohorovka",
"Overlord",
"Mannheim",
"Kaunas",
"El Alamain"]

dayOffset = [24,0,4,8,12,16,20] //sun, mon, tue, wed, -> etc.

function nextmaps(Rotation){
     var offset = dayOffset[new Date().getDay()];
    var hours = new Date().getUTCHours() + 2;
    var Elapsed = new Date().getMinutes() + (( hours) * 60);
    Elapsed -= Elapsed%4
    var position = (Elapsed % RotLth) / 4;
    if(offset != 0 && hours == 0 ||  24){ 
        position += (Rotation.length-1) - offset;
    }
 return "Current map is: `" + Rotation[position] + "` next map is: `" + Rotation[position < (Rotation.length-1)? position +1 : 0] + "`";
    
}


function mapListing(Rotation){
    var mins = new Date().getMinutes();
    var hours = new Date().getUTCHours(); // needed to display date correctly in msg and offset properly
     var offset = dayOffset[new Date().getDay()];
    hours = ((hours+2) % 24)
    mins -= mins%4;
    var list = ' ';
    var Elapsed = mins + (hours*60) + offset;
    var position = (Elapsed % RotLth) / 4;
    if(offset != 0 && hours == 0 ||  24){ 
        position += (Rotation.length-1) - offset;
    }
         var i = 0; 
         var SaneMin= "";                   
        do{
            if(mins < 10){SaneMin = ('0' + mins)}
            else{SaneMin = mins + ''}
            if(position > Rotation.length-1){ position = 0} // make sure positon doesnt exceeed Rotation array length
        list += "` " + hours + ":" + SaneMin  +"  " + Rotation[position] + "` \n";
            if(mins >= 56) { 
                mins = 0; //reset to continue iteration past one hour;
                hours < 23 ? hours++ : hours = 0; 
            }
                else{mins += 4;} // readies for next iteration

            i++;
            position++;
        }while(i <= Rotation.length-1)
    return list;
    
    } 


bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            case 'nxt' || "nxt":
                var msg = nextmaps(Rotnew);
                bot.sendMessage({
                    to: channelID,
                    message: msg});                
            break;
/*            case 'nxt6':
                var msg = nextmaps(Rotnew);
                bot.sendMessage({
                    to: channelID,
                    message: msg});
                break;*/
            case "sch":
                var list = mapListing(Rotnew);
                    bot.sendMessage({
                    to: channelID,
                    message: "Timezone: UTC+2, maps accurate for tier 9 and 10: \n" + list});
                break;
            case "sch6":
                var list = mapListing(Rotnew);
                bot.sendMessage({
                to: channelID,
                message: "Timezone: UTC+2 \n" + list + "WARNING: Cold war maps are replaced, no data on what with."});
           
                }              
         }
});



