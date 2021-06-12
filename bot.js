/*TODO:
nothing yet.
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

var Rotation = ["Malinowka","Fredvang","Himmelsdorf","El Halluf","Cao Bang","Cliff","Vineyard","Mannheim","Kaunas","Highway","Dezful","Mountain Pass","Prokhorovka",
    "Fredvang",
    "Kasserine",
    "Steppes",
    "Cao Bang",
    "Fisherman's Bay",
    "Sunset Coast",
    "Mannheim",
    "Arctic Region",
    "Pilsen",
    "Dezful",
    "Sand River"];
//var Resets = [96, 192, 288, 384, 480, 576, 672, 768, 864, 960, 1056, 1152, 1248, 1344, 1440]


bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
        case 'maplist':
            var Maplist = ' ';
                Rotation.forEach(function callbackFn(element, index){
                    Maplist+= element
                    if(index < Rotation.length){Maplist+= ', '}
                });

                bot.sendMessage({
                    to: channelID,
                    message: Maplist
                    
                });
                console.log(Maplist)
                break;
            case 'nxt' || "nxt":
                var Elapsed = new Date().getMinutes() + (( new Date().getUTCHours() + 2) * 60);
                Elapsed -= Elapsed%4
                var position = (Elapsed % 96) / 4;
                console.log(position)
                bot.sendMessage({
                    to: channelID,
                    message: "Current map is: `" + Rotation[position] + "` next map is: `" + Rotation[position < 23? position +1 : 0] + "`"});
            break;

            case "sch":
                var mins = new Date().getMinutes();
                var hours = new Date().getUTCHours(); // needed to display date correctly in msg
                hours = (hours+2) % 24
                mins -= mins%4;
                var list = ' ';
                var Elapsed = mins + ((hours) * 60);
                var position = (Elapsed % 96) / 4;
                     var i = 0; 
                     var SaneMin= "";                   
                    do{
                        if(mins < 10){SaneMin = ('0' + mins)}
                        else{SaneMin = mins + ''}
                        if(position > Rotation.length){ position = 0} // make sure positon doesnt exceeed Rotation array length
                    list += "` " + hours + ":" + SaneMin  +"  " + Rotation[position] + "` \n";
                        if(mins >= 56) { 
                            mins = 0; //reset to continue iteration past one hour;
                            hours < 23 ? hours++ : hours = 0; 
                        }
                            else{mins += 4;} // readies for next iteration

                        i++;
                        position++;
                    }while(i <= Rotation.length)
                        bot.sendMessage({
                        to: channelID,
                        message: "The following times are set for UTC+2: \n" + list});
                }              
         }
});



