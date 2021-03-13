// node modules

const Discord = require("discord.js");
const { token, geniustoken } = require("./config.json");
const nodefetch = require("node-fetch");
let reminder = require("./database/reminders.json");
let newxp = require("./database/exp.json");
let prefixes = require("./database/prefixes.json");
let botstats = require("./database/stats.json")
const Pagination = require("discord-paginationembed");
const cheerio = require("cheerio");
const ytdl = require('ytdl-core-discord');
const ytsr = require('ytsr');
var fs = require('fs');

// node modules end

// discord client stuff

const client = new Discord.Client ();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

// discord client stuff end

// variables

let curprefix = "=";
let servers = {};
let someRandomThing;
let searchResults;
let someInfo;
let lyricsURL;
let lastSentPlaying;
let someIndex;
let allreminders = "allreminders";
let notCooldown = true;
let voteStays = 0;
let voteKicks = 0;

// variables end

// getting commands

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
};

// getting commands end

// some necessary functions

function SendSuccessMessage(message, success){
    if(!success) success = "Successfuly executed the command!";
    let generalsuccessmessage = new Discord.MessageEmbed()
    .setTitle("Success!")
    .setColor("#09ff01")
    .setDescription(success.toString());
    message.channel.send(generalsuccessmessage);
    };
    
function SendErrorMessage(message, reason){
    if(!reason){
        reason = "Looks like something went wrong. Please try again. If you need help use =bot?"
    };
    let generalerrormessage = new Discord.MessageEmbed()
    .setTitle("Uh oh! Something went wrong!")
    .setColor("#f01717")
    .setDescription(reason.toString());
    message.channel.send(generalerrormessage);
};

// some necessary funcrions end

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.on("guildCreate", async guild => {
    let thankMessage = {
        color: "WHITE",
        title: `Thank you for adding me to ${guild.name}!`,
        description: `If you need any help use =bot? If you have any problems, questions, or if you find any bugs, join [${"the support server"}](${"https://discord.gg/jXQvBj4tup"}) !`,
        thumbnail: {url: guild.iconURL()},
        footer: {
            text: "Enjoy!",
            icon_url: client.user.avatarURL()
        },
        timestamp: new Date()
    };
    guild.systemChannel.send({embed: thankMessage});
});


client.on('ready', () => {
	console.log('Ready!');
    client.user.setActivity("=bot?");
});

client.on('message', async message => {
    if(message.guild === null) return;
    if(message.author.bot) return;
    let createdTime = message.createdTimestamp;
    let d = new Date( createdTime );
    console.log("At " + d.getHours() + ":" + d.getMinutes() + ", " + d.toDateString()+ ", " + message.author.username + " said " + '"' + message.content + '"' );
//custom prefixes
    curprefix = prefixes[message.guild.id].prefix;
    if(!prefixes[message.guild.id]){
        prefixes[message.guild.id] = {
            prefix: "="
        };
        fs.writeFile("./database/prefixes.json", JSON.stringify(prefixes), (err)=>{
            if(err) console.log(err)
        });
    };
    
//level || rank system
    if (!newxp[message.guild.id] && !message.author.bot){
        let user = {
            exp: 1,
            lvl: 1
        };
        newxp[message.guild.id] = [

        ];
        newxp[message.guild.id].push(message.author.id);
        newxp[message.guild.id].push(user);
    };
    someIndex = newxp[message.guild.id].indexOf(message.author.id);
    if(!newxp[message.guild.id][someIndex+1].exp){
        let user = {
            exp: 1,
            lvl: 1
        };
        newxp[message.guild.id].push(message.author.id);     
        newxp[message.guild.id].push(user);
    };
    let curLVL = newxp[message.guild.id][someIndex+1].lvl;
    let XPreq = Math.pow(2, curLVL) * 4;
    newxp[message.guild.id][someIndex+1].exp += 2;
    if(XPreq <= newxp[message.guild.id][someIndex+1].exp){
        newxp[message.guild.id][someIndex+1].lvl += 1;
        let lvlupMSG = new Discord.MessageEmbed()
        .setTitle("Level Up!")
        .setColor("#d89ada")
        .addField(`**${message.author.username}** just leveled up to ${curLVL + 1}`, ":)", true)
        .setThumbnail(message.author.displayAvatarURL());
        message.channel.send(lvlupMSG);
    };

    fs.writeFile("./database/exp.json", JSON.stringify(newxp, null, 4), (err)=>{
        if(err) console.log(err);
    });
    if (!message.content.startsWith(curprefix) || message.author.bot) return;
//command handling
	const args = message.content.slice(curprefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    };
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            return;
        };
    };

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
    	command.execute(message, args);
    } catch (error) {
    	console.error(error);
    	SendErrorMessage(message);
    };
});

//reminder 

var timerID = setInterval(function(){
    botstats.guildNumber = client.guilds.cache.size;
    fs.writeFile("./database/stats.json", JSON.stringify(botstats, null, 4), (err) => {
        if(err) console.error;
    });
    fs.writeFile("../black-cat-website/stats.json", JSON.stringify(botstats, null, 4), (err) => {
        if(err) console.error;
    });
    var date= new Date();
    reminderlist = reminder[allreminders];
    for (let i = 0; i < reminderlist.length;  i++){
        if (i % 2 != 0){
            let splitted = reminder[allreminders][i-1].split(" ");
            if (reminder[allreminders][i].Date + " " + reminder[allreminders][i].Time == date.getDate() + " " + date.getMonth() + " " + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes()) {
                chn = splitted[1];
                client.channels.cache.get(chn).send(`<@${splitted[0]}>, your reminder.`);
                reminder[allreminders].splice(i-1, 2);
                fs.writeFile("./database/reminders.json", JSON.stringify(reminder, null, 4), (err)=>{
                    if(err) console.log(err);
                });
            };
        };
    }
},60 * 1000);

//All music related commands & votekick

async function getVideoDetails (video){
    function learnRegExp(s) {    
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return regexp.test(s);    
    };
    validornot = learnRegExp(video);
    if(!validornot){
        const searchResults = await ytsr(video);
        return searchResults;
    } else{
        const someInfo = await ytdl.getBasicInfo(video);
        return someInfo.videoDetails;
    };
};

async function findLyrics(message, loopingTrack){
    let songName = loopingTrack.title;
    songName = songName.replace(/ *\([^)]*\) */g, '');
    songName = songName.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      ''
    );
    console.log(songName);
    let searchUrl = (`https://api.genius.com/search?q=${encodeURI(songName)}`);
    const headers = {
        Authorization: `Bearer ${geniustoken}`
    };
    try {
        const body = await nodefetch(searchUrl, {headers});
        const result = await body.json();
        if(!result) return SendErrorMessage(message);
        const songPath = result.response.hits[0].result.api_path;  
        if (!songPath) return SendErrorMessage(message, "Couldn't find lyrics for this.");
        const LyricsPath = (`https://api.genius.com${songPath}`);
        console.log(LyricsPath);
        const body2 = await nodefetch(LyricsPath, { headers });
        const result2 = await body2.json();
        if(!result2.response.song.url) return SendErrorMessage(message);
        const pageUrl = result2.response.song.url;
        const response3 = await nodefetch(pageUrl);
        lyricsURL = pageUrl;
        const text = await response3.text();
        const $ = cheerio.load(text);
        let lyrics = $('.lyrics')
          .text()
          .trim();
        if (!lyrics) {
            $('.Lyrics__Container-sc-1ynbvzw-2')
                .find('br')
                .replaceWith('\n');
            lyrics = $('.Lyrics__Container-sc-1ynbvzw-2').text();
            if (!lyrics) { 
                return SendErrorMessage(message);
            } else {
                return lyrics.replace(/(\[.+\])/g, '');
            }
        } else {
            return lyrics.replace(/(\[.+\])/g, '');
        }
    } catch (e) {
        console.log(e);
    };
};


async function playNewTrack(message, loopingTrack){
    let startedMessage;
    let nextTrack;
    let nextTrackURL;
    if(!message.guild.me.hasPermission("DELETE_MESSAGES")){

    } else lastSentPlaying.delete();
    if(!servers[message.guild.id].looping){
        servers[message.guild.id].dispatch.end();
        nextTrack = servers[message.guild.id].queue.shift();
        console.log(nextTrack);
        nextTrackURL = nextTrack.url;
    };

    if(servers[message.guild.id].looping){
        console.log(loopingTrack);
        nextTrack = loopingTrack;
        nextTrackURL = loopingTrack.url;
    };
    const connection = servers[message.guild.id].connection;
    connection.voice.setSelfDeaf(true);
    servers[message.guild.id].loopinginfo.title = nextTrack.title;
    servers[message.guild.id].loopinginfo.url = nextTrackURL;
    servers[message.guild.id].loopinginfo.channelname = nextTrack.channelname;
    servers[message.guild.id].loopinginfo.channelurl = nextTrack.channelurl;
    servers[message.guild.id].loopinginfo.thumbnail = nextTrack.thumbnail;
    const dispatcher = connection.play(await ytdl(nextTrackURL),{ type: 'opus', highWaterMark: 1<<23});
    servers[message.guild.id].dispatch = dispatcher;
    servers[message.guild.id].playing = true;
    startedMessage = new Discord.MessageEmbed()
        .setTitle("Now Playing:")
        .setColor("RANDOM")
        .setDescription(`[${nextTrack.title.toString()}](${nextTrackURL})  -  [${nextTrack.channelname.toString()}](${nextTrack.channelurl})`)
        .setThumbnail(nextTrack.thumbnail);
    console.log('Now playing!');
    lastSentPlaying = await message.channel.send(startedMessage);
    let finnishedMessage = new Discord.MessageEmbed()
    .setDescription("Stopped Playing!")
    .setColor("#f01717");
    dispatcher.on('finish', () => {
        if (servers[message.guild.id].looping) {
            return playNewTrack(message, nextTrack);
        };
        if(servers[message.guild.id].queue[0] != null){
            console.log("Playing next track.");
            return playNewTrack(message);
        } else {
            servers[message.guild.id].playing = false;
            console.log('Finished playing!');
            message.channel.send(finnishedMessage);
            dispatcher.destroy();
            message.guild.me.voice.channel.leave();   
        };

    });
    dispatcher.on('error', console.error);
};



client.on("message", async message => {
    if(message.author.bot) return;
    if(message.guild === null) return;
    if(!message.guild.me.hasPermission("SEND_MESSAGES")) return;
    if(!message.channel.permissionsFor(client.user).toArray().includes("SEND_MESSAGES")) return;
    let args = message.content.slice(1).split(" ").slice(1);
    //lyrics

    if(message.content.startsWith(curprefix+"lyrics")){
        if(!message.member.voice.channel) return SendErrorMessage(message, "You need to be in a voice channel to run this command.");
        if(!servers[message.guild.id].playing) return SendErrorMessage(message,"No track is being played.");
        if(!servers[message.guild.id].loopinginfo) return SendErrorMessage(message,"No track is being played.");
        const sentMessage = await message.channel.send(
            'Searching for lyrics...'
        );
        let lyrics = await findLyrics(message, servers[message.guild.id].loopinginfo);
        if(!lyrics) return SendErrorMessage(message);
        const lyricsIndex = Math.round(lyrics.length / 2048) + 1;
        const lyricsArray = [];
        for (let i = 1; i <= lyricsIndex; ++i) {
          let b = i - 1;
          lyricsArray.push(
            new Discord.MessageEmbed()
              .setTitle(`${servers[message.guild.id].loopinginfo.title}, Page #` + i)
              .setDescription(lyrics.slice(b * 2048, i * 2048))
              .setFooter('Provided by genius.com')
          );
        }
        const lyricsEmbed = new Pagination.Embeds()
          .setArray(lyricsArray)
          .setAuthorizedUsers([message.author.id])
          .setChannel(message.channel)
          .setURL(lyricsURL)
          .setColor('#00724E');
        return sentMessage
            .edit(':white_check_mark: Lyrics Found!', lyricsEmbed.build())
            .then(msg => {
                msg.delete({ timeout: 2000 });
        });
    }

//lyrics end

//loop

    if(message.content.startsWith(curprefix+"loop")){
        if(servers[message.guild.id].looping){
            if(!servers[message.guild.id].playing) return SendErrorMessage(message,"No track is being played.");
            servers[message.guild.id].looping = false;
            return SendSuccessMessage(message, "Unlooped tracked.");
        } else {
            if(!servers[message.guild.id].playing) return SendErrorMessage(message,"No track is being played.");
            servers[message.guild.id].looping = true;
            return SendSuccessMessage(message, "Now looping track.");
        }

    }

//loop end

//pause/unpause

    if(message.content.startsWith(curprefix+"pause")){
        if(!message.member.voice.channel) return SendErrorMessage(message, "You need to be in a voice channel to run this command.");
        if(!servers[message.guild.id].playing) return SendErrorMessage(message,"No track is being played.");
        if(!servers[message.guild.id].dispatch) return SendErrorMessage(message);
        if(!servers[message.guild.id].pausedd) {
            servers[message.guild.id].dispatch.pause();
            servers[message.guild.id].pausedd = true;
            return SendSuccessMessage(message, "Paused!");
        } if(servers[message.guild.id].pausedd) {
            servers[message.guild.id].dispatch.resume();
            servers[message.guild.id].pausedd = false;
            return SendSuccessMessage(message, "Unpaused!");
        }
    }

//pause/unpause end


//skip

    if(message.content.startsWith(curprefix+"skip") || message.content.startsWith(curprefix+"next")){
        if(!message.member.voice.channel) return SendErrorMessage(message, "You need to be in a voice channel to run this command.");
        if(!servers[message.guild.id]) return SendErrorMessage(message,"Queue is currently empty!");
        if(!servers[message.guild.id].playing) return SendErrorMessage(message,"Queue is currently empty!");
        if(servers[message.guild.id].queue[0] == null) return SendErrorMessage(message,"Queue is currently empty!");
        return await playNewTrack(message);
    }

//skip end

//queue command

    if(message.content.startsWith(curprefix+"queue") && !message.content.startsWith(curprefix+"play")){
        if(!servers[message.guild.id]) return SendErrorMessage(message,"Queue is currently empty!");
        if(!servers[message.guild.id].playing) return SendErrorMessage(message,"Queue is currently empty!");
        if(servers[message.guild.id].queue[0] == null) return SendErrorMessage(message,"Queue is currently empty!");
        let qinfo = ""
        for(let i = 0; i < servers[message.guild.id].queue.length; i++ ){
            let vidInfo = servers[message.guild.id].queue[i]
            qinfo = qinfo + (i+1).toString() + ") " + `[${vidInfo.title}](${vidInfo.url})  -  [${vidInfo.channelname}](${vidInfo.channelurl})`  +"\n ";
            console.log(qinfo)
        }
        let qEmbed = {
            color: "RANDOM",
            title: "Queue for **" + message.guild.name + "**",
            description: qinfo
        }
        message.channel.send({embed: qEmbed});
    }

//queue command end

//play 

    if (message.content.startsWith(curprefix+"play")){
        if(!message.guild.me.hasPermission("ADMINISTRATOR")) return SendErrorMessage(message, "I need to have administrator to run this command! https://tenor.com/view/haha-gif-19504806");
        if(!message.member.voice.channel){
            SendErrorMessage(message, "You need to be in a voice channel to run this command.")
            return;
        } 
        if(!message.member.voice.channel.speakable) return SendErrorMessage(message, "I can't play anything in that channel!")
        if (args[0] == null) return SendErrorMessage(message, "You didn't give a link or a search term.");
        console.log(args);
        if(!servers[message.guild.id]){
            servers[message.guild.id] = {
                dispatch: someRandomThing,
                connection: someRandomThing,
                queue: [],
                playing: false,
                paused: false,
                looping: false,
                loopinginfo: {

                }
            };
        };
        function learnRegExp(s) {    
            var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            return regexp.test(s);    
        };
        validornot = learnRegExp(args[0]);
        if (!validornot) {
            if(servers[message.guild.id].playing){
                searchResults = await getVideoDetails(args.join(" "));
                let channelTitle
                let channelURL
                let searchedURL = searchResults.items[0].url;
                let searched = searchResults.items[0];
                let vidTitle=(searched.title);
                if(!searched.author) {
                    channelTitle = "Couldn't find channel."
                    channelURL = ""
                } else {
                    channelTitle = (searched.author.name);
                    channelURL = (searched.author.url);
                }
                let nextTrackDetails = {
                    url: searchedURL,
                    title: vidTitle,
                    channelname: channelTitle,
                    channelurl: channelURL,
                    thumbnail: searched.bestThumbnail.url
                };
                servers[message.guild.id].queue.push(nextTrackDetails);
                console.log(servers[message.guild.id].queue);
                return SendSuccessMessage(message, "Successfuly added " + `[${vidTitle}](${searchedURL})  -  [${channelTitle}](${channelURL})` + " to the queue!");
            };
            servers[message.guild.id].playing = true;
            servers[message.guild.id].queue = [];
            searchResults = await getVideoDetails(args.join(" "));
            let searchedURL = searchResults.items[0].url;
            let searched = searchResults.items[0];
            let vidTitle=(searched.title);
            let channelTitle = (searched.author.name);
            let channelURL = (searched.author.url);
            servers[message.guild.id].loopinginfo = {
                url: searchedURL,
                title: vidTitle,
                channelname: channelTitle,
                channelurl: channelURL,
                thumbnail: searched.bestThumbnail.url
            };
            const connection = await message.member.voice.channel.join();
            servers[message.guild.id].connection = connection;
            connection.voice.setSelfDeaf(true);
            const dispatcher = connection.play(await ytdl(searchedURL, {filter: "audioonly", highWaterMark: 1<<24 }), { type: 'opus'});
            servers[message.guild.id].dispatch = dispatcher;
            let finnishedMessage = new Discord.MessageEmbed()
            .setDescription("Stopped Playing!")
            .setColor("#f01717");
            dispatcher.on('start', async () => {
                let vidTitle=(searched.title);
                let channelTitle = (searched.author.name);
                let channelURL = (searched.author.url);
                let startedMessage = new Discord.MessageEmbed()
                .setTitle("Now Playing:")
                .setColor("RANDOM")
                .setDescription(`[${vidTitle}](${searchedURL})  -  [${channelTitle}](${channelURL})`)
                .setThumbnail(searched.bestThumbnail.url);
                console.log('Now playing!');
                lastSentPlaying = await message.channel.send(startedMessage);
            });
            
            dispatcher.on('finish', () => {
                if(servers[message.guild.id].looping){
                    return playNewTrack(message, servers[message.guild.id].loopinginfo);
                };
                if(servers[message.guild.id].queue[0] != null){
                    console.log("Playing next track.")
                    return playNewTrack(message);
                } else {
                    servers[message.guild.id].playing = false;
                    console.log('Finished playing!');
                    message.channel.send(finnishedMessage);
                    dispatcher.destroy();
                    message.guild.me.voice.channel.leave();   
                };
                
            });
            dispatcher.on('error', console.error);
        }else {
            if(servers[message.guild.id].playing){
                someInfo = await getVideoDetails(args[0]);
                let vidTitle=(someInfo.title);
                let channelTitle = (someInfo.author.name);
                let channelURL = "https://www.youtube.com/channel/"+(someInfo.channelId);
                let nextTrackDetails = {
                    url: args[0],
                    title: vidTitle,
                    channelname: channelTitle,
                    channelurl: channelURL,
                    thumbnail: someInfo.thumbnails[0].url
                };
                servers[message.guild.id].queue.push(nextTrackDetails);
                console.log(servers[message.guild.id].queue);
                return SendSuccessMessage(message, "Successfuly added " +  `[${vidTitle}](${args[0]})  -  [${channelTitle}](${channelURL})` + " to the queue!");
            };
            servers[message.guild.id].playing = true;
            servers[message.guild.id].queue = [];
            const connection = await message.member.voice.channel.join();
            connection.voice.setSelfDeaf(true);
            const dispatcher = connection.play(await ytdl(args[0]), { type: 'opus', highWaterMark: 1<<23});
            servers[message.guild.id].dispatch = dispatcher;
            let finnishedMessage = new Discord.MessageEmbed()
            .setDescription("Stopped Playing!")
            .setColor("#f01717");
            dispatcher.on("start", async () => {
                someInfo = await getVideoDetails(args[0]);
                let vidTitle=(someInfo.title);
                let channelTitle = (someInfo.author.name);
                let channelURL = "https://www.youtube.com/channel/"+(someInfo.channelId);
                servers[message.guild.id].loopinginfo = {
                    url: args[0],
                    title: vidTitle,
                    channelname: channelTitle,
                    channelurl: channelURL,
                    thumbnail: someInfo.thumbnails[0].url
                };
                let startedMessage = new Discord.MessageEmbed()
                .setTitle("Now Playing:")
                .setColor("RANDOM")
                .setDescription(`[${vidTitle}](${args[0]})  -  [${channelTitle}](${channelURL})`)
                .setThumbnail(someInfo.thumbnails[0].url);
                console.log('Now playing!');
                message.channel.send(startedMessage);
            });
                

            dispatcher.on('finish', () => {
                if(servers[message.guild.id].looping){
                    return playNewTrack(message, servers[message.guild.id].loopinginfo);
                } else if(servers[message.guild.id].queue[0] != null){
                    console.log("Playing next track.")
                    return playNewTrack(message);
                } else {
                    servers[message.guild.id].playing = false;
                    console.log('Finished playing!');
                    message.channel.send(finnishedMessage);
                    dispatcher.destroy();
                    message.guild.me.voice.channel.leave();   
                };

            });
            dispatcher.on('error', console.error);
        };

    };

//play end

//leave

    if(message.content.startsWith("öl") || message.content.startsWith("fuckoff") || message.content.startsWith("die") || message.content.startsWith("öl") || message.content.startsWith("sg")) {
        message.guild.me.voice.channel.leave();
        servers[message.guild.id].queue = [];
        servers[message.guild.id].playing = false;
        servers[message.guild.id].looping = false;
    }

//leave end

//cemalroulette 

if(message.content.startsWith(curprefix+"cemalroulette") && message.guild.id == "486163617507573760") {
    message.reply(`${Math.floor( Math.random() * 24)} hours, ${Math.floor( Math.random() * 59) + 1} minutes, ${Math.floor( Math.random() * 59) + 1} seconds.`);
};

//cemalroulette end

//votekick
    if(message.content.toLowerCase().startsWith(curprefix+"votekick")){
        if(message.author.bot) return;
        if(!message.guild.me.hasPermission("ADMINISTRATOR")) return SendErrorMessage(message, "I need to have administrator to run this command!");
        if(!message.guild.me.hasPermission("KICK_MEMBERS")) return SendErrorMessage(message, "I don't have the permission to kick members!");
        if (message.content.includes("@everyone")) return SendErrorMessage(message, "You can't @ everyone!");
        if (message.content.includes("@here")) return SendErrorMessage(message, "You can't @ here!");
        if(!message.mentions.members.first()) return SendErrorMessage(message, "You didn't @ a person!");
        if(message.mentions.members.first().id == message.guild.me.id) return SendErrorMessage(message, "I can't kick myself!");
        if(notCooldown){
            const voteMsg = {
                title: `Vote to kick **${message.mentions.members.first().displayName}**`,
                description: "React with ✅ for the member to get kicked. React with ⛔ for the member to stay.",
                color: "RANDOM"
            }; 
            notCooldown = false;
            var member = message.mentions.members.first();
            const sentVoteMsg = await message.channel.send({embed: voteMsg});
            await sentVoteMsg.react("✅");
            await sentVoteMsg.react("⛔");
            setTimeout(makeDecision, 30000);
            sentVoteMsg.delete({ timeout: 30000});
            client.on('messageReactionAdd', async (reaction) => {
                try {
                    await reaction.fetch();
                } catch (error) {
                    console.error('Something went wrong when fetching the message: ', error);
                    return;
                };
            
                if (reaction.emoji.name == '✅') {
                    if (reaction.message.id === sentVoteMsg.id){
                        voteKicks += 1;
                        console.log("Someone voted yes.");
                    };
                } else if (reaction.emoji.name == '⛔') {
                    if (reaction.message.id === sentVoteMsg.id){
                        voteStays += 1;
                        console.log("Someone voted no.");
                    };
                };
            
            });
            client.on('messageReactionRemove', async (reaction) => {
                try {
                    await reaction.fetch();
                } catch (error) {
                    console.error('Something went wrong when fetching the message: ', error);
                    return;
                };
            
                if (reaction.emoji.name == '✅') {
                    if (reaction.message.id === sentVoteMsg.id){
                        voteKicks -= 1;
                        console.log("Someone un-voted yes.");
                    };
                } else if (reaction.emoji.name == '⛔') {
                    if (reaction.message.id === sentVoteMsg.id){
                        voteStays -= 1;
                        console.log("Someone un-voted no.");
                    };
                };
            
            });
            async function makeDecision(){
                if(voteKicks > voteStays){
                    const kickMsg = {
                        title: `**Begone!** ***${message.mentions.members.first().displayName}***`,
                        fields: [
                            {
                                name: "Votes for kick:",
                                value: voteKicks,
                                inline: true
                            },
                            {
                                name: "Votes for stay:",
                                value: voteStays,
                                inline: true
                            }
                        ],
                        color: "RANDOM"
                    };  
                    message.channel.send({embed: kickMsg});
                    if(message.mentions.members.first().id === message.guild.ownerID) return SendErrorMessage(message, "I can't kick the owner of the server.");
                    if(!message.guild.member(message.mentions.members.first().id)) return SendErrorMessage(message, "That user is no longer in the server!");
                    try  {
                        member.kick();
                    } catch(err) {
                        console.log(err);
                        message.channel.send(`An error occured while trying to kick **${message.mentions.members.first().displayName}**`);
                    }
                    notCooldown = true;
                    voteKicks = 0;
                    voteStays = 0;
                } else{
                    const stayMsg = {
                        title: `**You stay** ***${message.mentions.members.first().displayName}***...`,
                        fields: [
                            {
                                name: "Votes for kick:",
                                value: voteKicks,
                                inline: true
                            },
                            {
                                name: "Votes for stay:",
                                value: voteStays,
                                inline: true
                            }
                        ],
                        color: "RANDOM"
                    };  
                    message.channel.send({embed: stayMsg});
                    notCooldown = true;
                    voteKicks = 0;
                    voteStays = 0;
                };
            };
        };
    };
    

});

client.login(token);