const Discord = require("discord.js")
const fs = require("fs")
const client = new Discord.Client()

const settings = require("./config/bot.json")


const { Player } = require("discord-player");

const player = new Player(client, settings.youtube_api);

client.player = player;
client.commands = new Discord.Collection();
client.aliases =  new Discord.Collection();
client.emotes = require("./config/emojis.json");
client.colors = require("./config/colors.json");

fs.readdir("./commands/", (err, files) => {
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0) return console.log("Could not find any commands!");
    jsfile.forEach((f, i) => { 
    console.log(`Loaded ${f}!`);
        
    let pull = require(`./commands/${f}`);
   
    client.commands.set(pull.config.name, pull);  
    pull.config.aliases.forEach(alias => {
    client.aliases.set(alias, pull.config.name)
                
    });
})});

client.on("ready", () => {

    console.log("Bot çalışıyor");
    let playing = client.voice.connections.size; 

});

client.on('message', async message => {
    
    let prefix = settings.prefix
        
    let messageArray = message.content.split(" ")
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);
      
      
    if(!message.content.startsWith(prefix)) return;
    let commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)))
    if(commandfile) commandfile.run(client,message,args,prefix);   
        
});

client.login(settings.token_bot);
