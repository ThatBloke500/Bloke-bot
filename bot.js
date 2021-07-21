/*TODO:
Collect data for tier 6 and below, and also cold war. Monitor for edge-case bugs.
*/


var Discord = require('discord.io');

var bot = new Discord.Client({
   token: process.env.BKBT_TOKEN,
   autorun: true});

bot.on('ready', function (evt) {
console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

var RotLth = 112;
var Rotnew = ["Ghost Town",	
"Highway",
"El Halluf",
"Steppes",
"Sand River",
"Kasserine",
"Dezful (Mines)",
"Westfield",	
"Himmelsdorf",	
"Ghost Town",	
"Sunset Coast",	
"Malinovka",
"Overlord",
"Fisherman's Bay",
"El Alamain",
"Cao Bang (Port)",
"Arctic Region"	,
"Pilsen",
"Fredvang (Himmelsdorf)",	
"Mountain Pass",
"Cliff",
"Vineyard",	
"Westfield",	
"Prohorovka",
"Overlord",
"Mannheim (Abbey)",
"Kaunas",
"El Alamain"]

var reminder = "\n **CW map (normal map)** = Tier 9(tier 6)"

var ElMins = [1440*6,0,1440,2880,1440*3,1440*4,1440*5]//sun, mon, tue, wed, -> etc.
/*function nextmaps(Rotation){
   var CurrDate = new Date(Date.now());
   CurrDate.setTime(CurrDate.getTime() + (2*60*60*1000));
    var hours = (CurrDate.getHours());
    var day = CurrDate.getDay()
    var offset = ElMins[day];
   var timeStep = CurrDate.getMinutes() - (CurrDate.getMinutes() % 4)
   var overtime =  (timeStep+4) - CurrDate.getMinutes()
    hours*=60
    var Elapsed = CurrDate.getMinutes() + hours + offset;
    Elapsed -= Elapsed%4
    var position = (Elapsed % RotLth) / 4;
 return "Current map is: `" + Rotation[position] + "` next map is: `" + Rotation[position < (Rotation.length-1)? position +1 : 0] + "` \n Time till switch: **" + overtime + "** minutes" + reminder;
    
}*/

function Exp(Rotation, count, SendOffset){
   var overtime = " ";
   if(SendOffset){
      var timeStep = CurrDate.getMinutes() - (CurrDate.getMinutes() % 4) // cleans up modulo
      var overtime = "Time till switch: **" + ((timeStep+4) - CurrDate.getMinutes()) + "** minutes"} //add time till next switch.... this could be cleaner probably
   var CurrDate = new Date(Date.now());
   CurrDate.setTime(CurrDate.getTime() + (2*60*60*1000));
    var mins =  CurrDate.getMinutes();
    var hours =  CurrDate.getHours(); // needed to display date correctly in msg and offset properly
     var offset = ElMins[CurrDate.getDay()]; //removes the need for daily offseting by making each day count towards % 28. I hope this is what keeps it working
    mins -= mins%4;
    var list = ' ';
    var Elapsed = mins + (hours*60) + offset;
    var position = (Elapsed % RotLth) / 4;
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
        }while(i <= count-1)
    return list + "\n" + overtime; //default overtime value is nothing. when used by nxt it switches to tell the next time until X
    
    } 



bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        
       
        switch(cmd) {
            /*case "help":
            bot.sendMessage({
                    to: channelID,
                    message:"This is a map bot for WoT console's WW2 mode, Cold war is currently unsupported.\n
            `nxt` = "})
            */                
            case "sch":
                var list = Exp(Rotnew, Rotnew.length, false);
                    bot.sendMessage({
                    to: channelID,
                    message: "Timezone: UTC+2, tier 8s and 7s will experience variation.\n" + list + reminder});
                break;
              
           case "nxt":
           var paramX = parseInt(args[1]);
           var warn = false
           if(Number.isNaN(paramX) || paramX > 16 || paramX < 0){
           paramX = 3;
           warn = true;} // handles people putting in junk data or trying to break the bot
              
              var list;
              list = Exp(Rotnew, paramX, true)
              if(warn){
              bot.sendMessage({
                    to: channelID,
                    message:"**No Number found / NUM out of range (max 16) - defaulting to 3 maps**\n" + list + reminder});}
              else{
                 bot.sendMessage({
                    to: channelID,
                    message:"UTC+2:\n" + list + reminder});}
              break;
                }              
         }
});



