/*Maths:
Calculation of map rotation:
Get the time in 24-hour format, get the day number.
split time into mins(clean up minutes using mins modulo 4 to remove excess), set hours equal to UTC+2 and then multiply hours by 60. day switching is accounted for.
Use the day number to lookup the minutes passed before midnight of the same day (to offset the rotation correctly)
Add all of this together.
Take this total elapsed time and Modulo it by the rotation length (28) then divide it by 4 (minutes till map change) to get the position.
Now this position can iterate over the Rotation list array to make a text message for discord, adding 4 minutes and +1 to position to each time listed as it loops over.
This can and has been all done by hand. The bot is simply a slave to this process, much like the origin of the name robot.
Simple maths really.
*/


var Discord = require('discord.io');

var bot = new Discord.Client({
   token: process.env.BKBT_TOKEN,
   autorun: true}); //BKBT_TOKEN is stored on the server and is the super secret bot-specific token for injecting code. I am not dumb enough to keep it as a plain text value.

bot.on('ready', function (evt) {
console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

var RotNA = [];
var RotEU = [];
var RotLth = 112; //rotation length * 4.

var MapNA = ["Mannheim", new Date('August 19, 1975 23:15:30')] // mutable global variable to save map name - check not null or empty. [map, date] format
var MapEU = ["Mannheim", new Date('August 19, 1971 23:15:30')] // same as above
var reminder = "\n **CW map (normal map)** = Tier 9(tier 6)"
//var ElMins = [1440*6,0,1440,2880,1440*3,1440*4,1440*5]//sun, mon, tue, wed, -> etc. JS days have sunday first as = 0 instead of something sane like 6.


function handler(){return 0}

function sniper(map, server){
   if(map.length < 3){return;} //check the name isnt less than 3 chars. not the best data check but whatever. 
   var CurrDate = new Date(Date.now());
   var list = "sent \n";
   var backwards = CurrDate.getMinutes() % 4
   CurrDate.setTime(CurrDate.getTime() - (backwards*60*1000));
   if(server=="EU"){
      MapEU[0] = map
      MapEU[1] = CurrDate; 
      if(RotEU.length < 28){
      RotEU.push([MapEU[0],MapEU[1]])
      }
       else{list += mapCaller("EU")}
   } 
   else{
      MapNA[0] = map
      MapNA[1] = CurrDate;
      if(RotNA.length < 28){
      RotNA.push([MapNA[0],MapNA[1]])
      }
      else{list += mapCaller("NA")}
   }
return list;
}


function mapCaller(SV){
   if(SV === undefined){SV = "EU";}
   console.log(SV);
   //SV needs to be capitalised
   var time = new Date(Date.now());
   var timeleft = 4 - (time.getMinutes() % 4);
   var NAvalid = Math.abs(time - MapNA[1]) < 230000 ? "Valid" : "Invalid";
   var EUvalid =  Math.abs(time - MapEU[1]) < 230000 ? "Valid" :  "Invalid"; // 4mins *60*1000 = 240,000 ms PAIN.
   var x=0; 
   var list = "MAP-DATADUMP: \n";
   if(SV=="EU"){ 
      do{
         list+= "`" + RotEU[x].join() + "` \n"
         x++;
      } while(x < RotEU.length)
         if(RotEU.length > 27){RotEU = []}
      return list;
   }
   if(SV== "NA" || SV != "EU"){
    do{
       list+= "`" + RotNA[x].join() + "` \n"
       x++;
   } while(x < RotNA.length)
      if(RotNA.length > 27){RotEU = []}
      
   return list + " these were the maps collected this past cycle";
   }
   else{return "Last recorded maps were: \n NA: `" + MapNA[0] + ": " + NAvalid + "` \n EU: `" + MapEU[0] + ": " + EUvalid + "`\n next switch: **" + timeleft + " mins **"; 

       }
}



bot.on('message', function (user, userID, channelID, message, evt) {
//where !sch, !nxt etc. are heard.
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        if(args.length > 2){args[1]+= " " + args[2]} //combine the two words of maps like El halluf alamein into one with a bit of gorey code.
       
        switch(cmd) {   
           case "na":
              sniper(args[1], "NA")
              bot.sendMessage({
                 to: channelID,
                 message:sniper(args[1], "NA")});
              break;
           case "eu":
               bot.sendMessage({
                 to: channelID,
                 message:sniper(args[1], "EU")});
              
              break;
           case "map":
              bot.sendMessage({
                    to: channelID,
                    message: mapCaller(args[1])});
              break;}              
         }
});
              
              
          
           /* case "sch":
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
              break;*/


/*var Rotold = ["Ghost Town",	
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
"El Alamain"]*/


/*
function Exp(Rotation, count, SendOffset){
   var overtime = " "; // this is just a var to show to users how long it'll be until the next map switch relative to their current time
   var CurrDate = new Date(Date.now());
   if(SendOffset){
      var timeStep = CurrDate.getMinutes() - (CurrDate.getMinutes() % 4) // cleans up time with modulo
      var overtime = "Time till switch: **" + ((timeStep+4) - CurrDate.getMinutes()) + "** minutes"} //add time till next switch.... this could be cleaner probably
   CurrDate.setTime(CurrDate.getTime() + (2*60*60*1000)); // add 2 hours to make it align with UTC+2.
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
            if(position > Rotation.length-1){ position = 0} // make sure position doesnt exceeed Rotation array length
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
    
    } */



