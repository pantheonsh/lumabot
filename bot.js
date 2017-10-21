Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

const Discord = require("discord.js");
const bot = new Discord.Client();
const request = require("request");
const ytdl = require("ytdl-core");

const config = {
    "prefix": ":"
}

const commands = {
    "help": {
        "name": "help",
        "perm": {
            "bot": [],
            "user": [],
            "owneronly": false
        },
        "exec": function(msg, args){
            var e = new Discord.RichEmbed();
            e.setTitle("◕‿◕✿ @ Comandos");
            e.setDescription([
                "say `<texto>`",
                "::: Repete o especificado",
                "",
                "simsimi `<fala>`",
                "::: Conversa com o SimSimi",
                "",
                "help",
                "::: Mostra esta página"
            ].join("\n"));
            msg.channel.send({embed:e});
        }
    },
    "simsimi": {
        "name": "simsimi",
        "perm": {
            "bot": [],
            "user": [],
            "owneronly": false
        },
        "exec": function(msg, args){
            request("http://bob-chat.herokuapp.com/getSumiAnswer/" + encodeURIComponent(msg.author.id) + "/pt/" + encodeURIComponent(args.join(" ")), function(err, response, body){   
                var p = JSON.parse(body);
                var embed = new Discord.RichEmbed();
                embed.setDescription(p.SumiAnswers);
                embed.setColor(16580445);
                embed.setFooter("Simsimi", "https://i.imgur.com/eVcCCNk.png");
                msg.channel.send({embed});
            });
        }
    },
    "say": {
        "name": "say",
        "perm": {
            "bot": [],
            "user": [],
            "owneronly": false
        },
        "exec": function(msg, args){
            msg.reply(args.join(" "));
        }
    }
}

bot.on("ready", () => {
    let channel = bot.channels.get("368254821620514827");
    let playing = false;

    setInterval(() => {
        if(!playing){
            channel.join().then(connection => {
                var url = [
                    "https://www.youtube.com/watch?v=DLzxrzFCyOs", // rico astley
                    "https://www.youtube.com/watch?v=5ZYgIrqELFw", // all star
                    "https://www.youtube.com/watch?v=-w9PukG97oQ", // gren hial zone
                    "https://www.youtube.com/watch?v=9L8qewU22Vc"  // we are number 1
                ].randomElement();
                const stream = ytdl(url, {filter: "audioonly"});
                const dispatcher = connection.playStream(stream);
                playing = true;
                dispatcher.on("end", () => {
                    playing = false;
                    channel.leave();
                });
            });
        }
    }, 5000);
});

bot.on("message", msg => {
    if(!msg.content.startsWith(config.prefix)) return;
    if(!msg.guild) return;

    var args = msg.content.split(" ");
    var cmd = args.shift().replace(config.prefix, "");

    if(commands.hasOwnProperty(cmd)){
        if(!msg.member.hasPermission(commands[cmd].perm.user)){
            return;
        }

        if(commands[cmd].perm.owneronly && msg.author.id != "342664083264241664") return;

        commands[cmd].exec(msg, args);
    }
});

console.log(process.env.token);

bot.login(process.env.token);

/* heroku hax */

var http = require('http');
http.createServer(function (req, res) {
    console.dir(req.url);

    res.writeHead(200, {'Content-Type': 'text/html'});

    res.end('foda');
}).listen(process.env.PORT);

//