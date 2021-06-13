// node modules

const Discord = require("discord.js");
const {
  token,
  geniustoken,
  ytkey,
  spotifyid,
  spotifysecret,
  dburi,
  port,
} = require("./config.json");
const mongoose = require("mongoose");
const nodefetch = require("node-fetch");
let reminder = require("./database/reminders.json");
let botstats = require("./database/stats.json");
const Pagination = require("discord-paginationembed");
const matchYoutubeUrl = require("./utils/matchYoutubeUrl");
const matchSpotifyUrl = require("./utils/checkSpotifyUrl");
const checkUrl = require("./utils/checkUrl");
const getPlaylistId = require("./utils/checkYTPlaylist");
const cheerio = require("cheerio");
const ytdl = require("ytdl-core-discord");
const ytsr = require("ytsr");
const ytpl = require("ytpl");
const Canvas = require("canvas");
const fs = require("fs");
const Spotify = require("node-spotify-api");
const search = require("youtube-search");
const Levels = require("discord-xp");
Levels.setURL(dburi);

// node modules end

// db stuff

const GuildSchema = new mongoose.Schema({
  guild_id: String,
  prefix: String,
});

const Guild = mongoose.model("Guild", GuildSchema);

mongoose.connect(dburi);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to mongo.");
});

// db stuff end

// spotify/youtube api client

const spotify = new Spotify({ id: spotifyid, secret: spotifysecret });
const opts = { maxResults: 1, key: ytkey };

//spotify/youtube api client end

// discord client stuff

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

// discord client stuff end

// variables

let curprefix = "=";
let playServers = {};
let someRandomThing;
let searchResults;
let someInfo;
let lyricsURL;
let lastSentPlaying;
let allreminders = "allreminders";

// variables end

// getting commands

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// getting commands end

// some necessary functions

function SendSuccessMessage(message, success) {
  if (!success) success = "Successfuly executed the command!";
  let generalsuccessmessage = new Discord.MessageEmbed()
    .setTitle("Success!")
    .setColor("#09ff01")
    .setDescription(success.toString());
  message.channel.send(generalsuccessmessage);
}

function SendErrorMessage(message, reason) {
  if (!reason) {
    reason =
      "Looks like something went wrong. Please try again. If you need help use =bot?";
  }
  let generalerrormessage = new Discord.MessageEmbed()
    .setTitle("Uh oh! Something went wrong!")
    .setColor("#f01717")
    .setDescription(reason.toString());
  message.channel.send(generalerrormessage);
}

// some necessary funcrions end

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

const applyText = (canvas, text) => {
  const ctx = canvas.getContext("2d");
  let fontSize = 70;
  do {
    ctx.font = `${(fontSize -= 10)}px Poppins`;
  } while (ctx.measureText(text).width > canvas.width - 300);
  return ctx.font;
};

client.on("guildMemberAdd", async (member) => {
  const channel = member.guild.systemChannel;
  if (!channel) return;
  const canvas = Canvas.createCanvas(900, 300);
  const ctx = canvas.getContext("2d");
  const bg = await Canvas.loadImage("./storage/back.jpg");
  const avatar = await Canvas.loadImage(
    member.user.displayAvatarURL({ format: "jpg" })
  );
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
  var grd = ctx.createLinearGradient(300, 50, 600, 400);
  grd.addColorStop(0, "#ff8a00");
  grd.addColorStop(1, "#00FFFF");
  ctx.fillStyle = grd;
  ctx.strokeStyle = "#74037b";
  ctx.font = "28px Poppins Light";
  ctx.fillText(
    "Welcome to the server,",
    canvas.width / 3.1,
    canvas.height / 2.5
  );
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  ctx.font = applyText(canvas, member.displayName);
  ctx.fillText(member.displayName, canvas.width / 3.1, canvas.height / 1.6);
  ctx.beginPath();
  ctx.arc(150, 150, 100, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, 50, 50, 250, 200);
  const img = new Discord.MessageAttachment(canvas.toBuffer(), "img.jpg");
  channel.send(img);
});

client.on("guildCreate", async (guild) => {
  let thankMessage = {
    color: "WHITE",
    title: `Thank you for adding me to ${guild.name}!`,
    description: `If you need any help use =bot? If you have any problems, questions, or if you find any bugs, join [${"the support server"}](${"https://discord.gg/jXQvBj4tup"}) ! If you want to learn more visit [${"the webpage"}](${"https://brtcrt.github.io/black-cat-website/index.html"}) !`,
    thumbnail: { url: guild.iconURL() },
    footer: {
      text: "Enjoy!",
      icon_url: client.user.avatarURL(),
    },
    timestamp: new Date(),
  };
  guild.systemChannel.send({ embed: thankMessage });
});

client.on("ready", () => {
  console.log("Ready!");
  setInterval(() => {
    let activities_list = [
      "=bot?",
      "=snake | =bot?",
      "with your mom | =bot?",
      "30",
      "russianroulette | =bot?",
      "some music | =bot?",
      "=play | =bot?",
      "=bot? | =bot?",
      "https://brtcrt.github.io/black-cat-website | =bot?",
      `${client.guilds.cache.size} servers | =bot?`,
    ];
    const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
    client.user.setActivity(activities_list[index], {
      type:
        index === 5 || (index === 3) | (index === 6) ? "LISTENING" : "PLAYING",
    });
  }, 10000);
});

client.on("message", async (message) => {
  if (message.guild === null) return;
  if (message.author.bot) return;
  let createdTime = message.createdTimestamp;
  let d = new Date(createdTime);
  // console.log(
  //     "At " +
  //         d.getHours() +
  //         ":" +
  //         d.getMinutes() +
  //         ", " +
  //         d.toDateString() +
  //         ", " +
  //         message.author.username +
  //         " said " +
  //         '"' +
  //         message.content +
  //         '"'
  // ); // for debug purposes. uncomment this If you need help at de-bugging
  //custom prefixes

  // const [guild, created] = await Guild.findOrCreate({
  //     where: { guild_id: message.guild.id },
  //     defaults: {
  //         prefix: "=",
  //     },
  // });
  // if (created) {
  //     guild.save();
  // }

  Guild.findOne({ guild_id: message.guild.id }, "prefix", (err, guild) => {
    if (err) return console.log(err);
    if (!guild) {
      const new_guild = new Guild({
        guild_id: message.guild.id,
        prefix: "=",
      });
      console.log("create new guild");
      new_guild.save((err) => {
        if (err) return console.log(err);
      });
    } else {
      curprefix = guild.prefix;
    }
  });

  const args = message.content.slice(curprefix.length).trim().split(/ +/);
  if (
    message.content.startsWith(curprefix + "prefix") ||
    message.content.startsWith(curprefix + "changeprefix")
  ) {
    if (!args[1]) {
      let preembed = new Discord.MessageEmbed()
        .setThumbnail(message.guild.iconURL())
        .setDescription(`Current prefix for this guild is ${curprefix}`);
      return message.channel.send({ embed: preembed });
    } else {
      let new_prefix = args[1];
      if (new_prefix === "") {
        return SendErrorMessage("Can't set prefix to nothing!");
      }
      await Guild.findOne(
        { guild_id: message.guild.id },
        "prefix",
        async (err, guild) => {
          if (err) {
            console.log(err);
            return SendErrorMessage(
              message,
              "Something went wrong while changing the prefix. Please try again."
            );
          }

          guild.prefix = new_prefix;
          await guild.save();
          console.log("new prefix");
          if (guild.prefix === new_prefix) {
            SendSuccessMessage(
              message,
              'Command prefix is now "' + args[1] + '"'
            );
          }
        }
      );
    }
  }
  //level || rank system
  const randomAmountOfXp = Math.floor(Math.random() * 20) + 10; // Min 10, Max 30
  const hasLeveledUp = await Levels.appendXp(
    message.author.id,
    message.guild.id,
    randomAmountOfXp
  );

  if (hasLeveledUp) {
    const user = await Levels.fetch(message.author.id, message.guild.id);
    let lvlupMSG = new Discord.MessageEmbed()
      .setTitle("Level Up!")
      .setColor("#d89ada")
      .addField(
        `**${message.author.username}** just leveled up to ${user.level}`,
        ":)",
        true
      )
      .setThumbnail(message.author.displayAvatarURL());
    message.channel.send(lvlupMSG);
  }
  if (!message.content.startsWith(curprefix) || message.author.bot) return;
  //command handling
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );
  if (!command) return;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      return;
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    SendErrorMessage(message);
  }
});

//reminder

var timerID = setInterval(function () {
  botstats.guildNumber = client.guilds.cache.size;
  fs.writeFile(
    "./database/stats.json",
    JSON.stringify(botstats, null, 4),
    (err) => {
      if (err) console.error;
    }
  );
  fs.writeFile(
    "../black-cat-website/stats.json",
    JSON.stringify(botstats, null, 4),
    (err) => {
      if (err) console.error;
    }
  );
  var date = new Date();
  reminderlist = reminder[allreminders];
  for (let i = 0; i < reminderlist.length; i++) {
    if (i % 2 != 0) {
      let splitted = reminder[allreminders][i - 1].split(" ");
      if (
        reminder[allreminders][i].Date + " " + reminder[allreminders][i].Time ==
        date.getDate() +
          " " +
          date.getMonth() +
          " " +
          date.getFullYear() +
          " " +
          date.getHours() +
          ":" +
          date.getMinutes()
      ) {
        chn = splitted[1];
        client.channels.cache
          .get(chn)
          .send(`<@${splitted[0]}>, your reminder.`);
        reminder[allreminders].splice(i - 1, 2);
        fs.writeFile(
          "./database/reminders.json",
          JSON.stringify(reminder, null, 4),
          (err) => {
            if (err) console.log(err);
          }
        );
      }
    }
  }
}, 60 * 1000);

//All music related commands & votekick

async function getVideoDetails(video) {
  validornot = checkUrl(video);
  if (!validornot) {
    let videoDetails = {
      url: "",
      title: "",
      channelname: "",
      channelurl: "",
      thumbnail: "",
    };
    await search(video, opts, function (err, results) {
      if (err) return console.log(err);
      const _videoDetails = {
        url: results[0].link,
        title: results[0].title,
        channelname: results[0].channelTitle,
        channelurl: `https://www.youtube.com/channel/${results[0].channelId}`,
        thumbnail: results[0].thumbnails.default.url,
      };
      videoDetails.url = _videoDetails.url;
      videoDetails.title = _videoDetails.title;
      videoDetails.channelname = _videoDetails.channelname;
      videoDetails.channelurl = _videoDetails.channelurl;
      videoDetails.thumbnail = _videoDetails.thumbnail;
    });
    return videoDetails;
  } else {
    const someInfo = await ytdl.getBasicInfo(video);
    return someInfo.videoDetails;
  }
}

async function findLyrics(message, loopingTrack) {
  let songName = loopingTrack.title;
  songName = songName.replace(/ *\([^)]*\) */g, "");
  songName = songName.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
    ""
  );
  console.log(songName);
  let searchUrl = `https://api.genius.com/search?q=${encodeURI(songName)}`;
  const headers = {
    Authorization: `Bearer ${geniustoken}`,
  };
  try {
    const body = await nodefetch(searchUrl, { headers });
    const result = await body.json();
    if (!result) return SendErrorMessage(message);
    const songPath = result.response.hits[0].result.api_path;
    if (!songPath)
      return SendErrorMessage(message, "Couldn't find lyrics for this.");
    const LyricsPath = `https://api.genius.com${songPath}`;
    console.log(LyricsPath);
    const body2 = await nodefetch(LyricsPath, { headers });
    const result2 = await body2.json();
    if (!result2.response.song.url) return SendErrorMessage(message);
    const pageUrl = result2.response.song.url;
    const response3 = await nodefetch(pageUrl);
    lyricsURL = pageUrl;
    const text = await response3.text();
    const $ = cheerio.load(text);
    let lyrics = $(".lyrics").text().trim();
    if (!lyrics) {
      $(".Lyrics__Container-sc-1ynbvzw-2").find("br").replaceWith("\n");
      lyrics = $(".Lyrics__Container-sc-1ynbvzw-2").text();
      if (!lyrics) {
        return SendErrorMessage(message);
      } else {
        return lyrics.replace(/(\[.+\])/g, "");
      }
    } else {
      return lyrics.replace(/(\[.+\])/g, "");
    }
  } catch (e) {
    console.log(e);
  }
}

async function playNewTrack(message, loopingTrack) {
  let startedMessage;
  let nextTrack;
  let nextTrackURL;
  // console.log(playServers[message.guild.id])
  if (message.guild.me.hasPermission("MANAGE_MESSAGES") && lastSentPlaying) {
    lastSentPlaying.delete();
  } else console.log(lastSentPlaying);
  if (!playServers[message.guild.id].looping) {
    //playServers[message.guild.id].dispatch.end();
    nextTrack = playServers[message.guild.id].queue.shift();
    console.log(nextTrack);
    nextTrackURL = nextTrack.url;
  }

  if (playServers[message.guild.id].looping) {
    console.log(loopingTrack);
    nextTrack = loopingTrack;
    nextTrackURL = loopingTrack.url;
  }
  const connection = playServers[message.guild.id].connection;
  connection.voice.setSelfDeaf(true);
  playServers[message.guild.id].loopinginfo.title = nextTrack.title;
  playServers[message.guild.id].loopinginfo.url = nextTrackURL;
  playServers[message.guild.id].loopinginfo.channelname = nextTrack.channelname;
  playServers[message.guild.id].loopinginfo.channelurl = nextTrack.channelurl;
  playServers[message.guild.id].loopinginfo.thumbnail = nextTrack.thumbnail;
  const dispatcher = connection.play(
    await ytdl(nextTrackURL, {
      filter: "audioonly",
      highWaterMark: 1 << 25,
    }),
    { type: "opus", highWaterMark: 1 }
  );
  playServers[message.guild.id].dispatch = dispatcher;
  playServers[message.guild.id].playing = true;
  startedMessage = new Discord.MessageEmbed()
    .setTitle("Now Playing:")
    .setColor("RANDOM")
    .setDescription(
      `[${nextTrack.title.toString()}](${nextTrackURL})  -  [${nextTrack.channelname.toString()}](${
        nextTrack.channelurl
      })`
    )
    .setThumbnail(nextTrack.thumbnail);
  console.log("Now playing!");
  lastSentPlaying = await message.channel.send(startedMessage);
  let finnishedMessage = new Discord.MessageEmbed()
    .setDescription("Stopped Playing!")
    .setColor("#f01717");
  dispatcher.on("finish", () => {
    if (playServers[message.guild.id].looping) {
      return playNewTrack(message, nextTrack);
    }
    if (playServers[message.guild.id].queue[0] != null) {
      console.log("Playing next track.");
      return playNewTrack(message);
    } else {
      playServers[message.guild.id].playing = false;
      console.log("Finished playing!");
      message.channel.send(finnishedMessage);
      dispatcher.destroy();
      playServers[message.guild.id].queue = [];
      playServers[message.guild.id].playing = false;
      playServers[message.guild.id].looping = false;
      playServers[message.guild.id].paused = false;
      message.guild.me.voice.channel.leave();
    }
  });
  dispatcher.on("error", console.error);
}

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (message.guild === null) return;
  if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
  if (
    !message.channel
      .permissionsFor(client.user)
      .toArray()
      .includes("SEND_MESSAGES")
  )
    return;
  let args = message.content.slice(1).split(" ").slice(1);
  //lyrics

  if (message.content.startsWith(curprefix + "lyrics")) {
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES"))
      return SendErrorMessage(
        message,
        "I need to have MANAGE_MESSAGES to run this command!"
      );
    if (!message.member.voice.channel)
      return SendErrorMessage(
        message,
        "You need to be in a voice channel to run this command."
      );
    if (!playServers[message.guild.id].playing)
      return SendErrorMessage(message, "No track is being played.");
    if (!playServers[message.guild.id].loopinginfo)
      return SendErrorMessage(message, "No track is being played.");
    const sentMessage = await message.channel.send("Searching for lyrics...");
    let lyrics = await findLyrics(
      message,
      playServers[message.guild.id].loopinginfo
    );
    if (!lyrics) return SendErrorMessage(message, "Couldn't find any lyrics");
    const lyricsIndex = Math.round(lyrics.length / 2048) + 1;
    const lyricsArray = [];
    for (let i = 1; i <= lyricsIndex; ++i) {
      let b = i - 1;
      lyricsArray.push(
        new Discord.MessageEmbed()
          .setTitle(
            `${playServers[message.guild.id].loopinginfo.title}, Page #` + i
          )
          .setDescription(lyrics.slice(b * 2048, i * 2048))
          .setFooter("Provided by genius.com")
      );
    }
    const lyricsEmbed = new Pagination.Embeds()
      .setArray(lyricsArray)
      .setAuthorizedUsers([message.author.id])
      .setChannel(message.channel)
      .setURL(lyricsURL)
      .setColor("#00724E");
    return sentMessage
      .edit(":white_check_mark: Lyrics Found!", lyricsEmbed.build())
      .then((msg) => {
        msg.delete({ timeout: 2000 });
      });
  }

  //lyrics end

  //loop

  if (message.content.startsWith(curprefix + "loop")) {
    if (playServers[message.guild.id].looping) {
      if (!playServers[message.guild.id].playing)
        return SendErrorMessage(message, "No track is being played.");
      playServers[message.guild.id].looping = false;
      return SendSuccessMessage(message, "Unlooped track.");
    } else {
      if (!playServers[message.guild.id].playing)
        return SendErrorMessage(message, "No track is being played.");
      playServers[message.guild.id].looping = true;
      return SendSuccessMessage(message, "Now looping track.");
    }
  }

  //loop end

  //pause/unpause

  if (message.content.startsWith(curprefix + "pause")) {
    if (!message.member.voice.channel)
      return SendErrorMessage(
        message,
        "You need to be in a voice channel to run this command."
      );
    if (!playServers[message.guild.id].playing)
      return SendErrorMessage(message, "No track is being played.");
    if (!playServers[message.guild.id].dispatch)
      return SendErrorMessage(message);
    if (playServers[message.guild.id].dispatch.paused === false) {
      await playServers[message.guild.id].dispatch.pause();
      return SendSuccessMessage(message, "Paused!");
    }
    if (playServers[message.guild.id].dispatch.paused === true) {
      console.log(playServers[message.guild.id].dispatch);
      try {
        playServers[message.guild.id].dispatch.pause();
        playServers[message.guild.id].dispatch.resume();
        playServers[message.guild.id].dispatch.pause();
        playServers[message.guild.id].dispatch.resume();
      } catch (e) {
        console.log(e);
      }
      return SendSuccessMessage(message, "Unpaused!");
    }
  }

  //pause/unpause end

  //skip
  if (
    message.content.startsWith(curprefix + "skip") ||
    message.content.startsWith(curprefix + "next")
  ) {
    if (!message.member.voice.channel)
      return SendErrorMessage(
        message,
        "You need to be in a voice channel to run this command."
      );
    if (!playServers[message.guild.id])
      return SendErrorMessage(message, "Queue is currently empty!");
    if (!playServers[message.guild.id].playing)
      return SendErrorMessage(message, "Queue is currently empty!");
    if (playServers[message.guild.id].queue[0] == null)
      return SendErrorMessage(message, "Queue is currently empty!");
    return await playNewTrack(message);
  }

  //skip end

  //queue command

  if (
    message.content.startsWith(curprefix + "queue") &&
    !message.content.startsWith(curprefix + "play")
  ) {
    if (!playServers[message.guild.id])
      return SendErrorMessage(message, "Queue is currently empty!");
    if (!playServers[message.guild.id].playing)
      return SendErrorMessage(message, "Queue is currently empty!");
    if (playServers[message.guild.id].queue[0] == null)
      return SendErrorMessage(message, "Queue is currently empty!");
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES"))
      return SendErrorMessage(
        message,
        "I need to have MANAGE_MESSAGES to run this command!"
      );
    let qinfo = [];
    for (let i = 0; i < playServers[message.guild.id].queue.length; i++) {
      let vidInfo = playServers[message.guild.id].queue[i];
      qinfo.push(
        (i + 1).toString() +
          ") " +
          `[${vidInfo.title}](${vidInfo.url})  -  [${vidInfo.channelname}](${vidInfo.channelurl})` +
          "\n "
      );
    }
    console.log(qinfo);
    const qIndex = Math.round(qinfo.length / 8) + 1;
    console.log(qIndex);
    const qArray = [];
    for (let i = 0; i <= qIndex; i++) {
      let qText = "";
      qText += qinfo.slice(i * 8, (i + 1) * 8).join("");
      console.log(qText);
      let b = i - 1;
      qArray.push(
        new Discord.MessageEmbed()
          .setTitle(`${message.guild.name}' queue, Page #${i + 1}`)
          .setDescription(qText)
      );
    }
    const qEmbed = new Pagination.Embeds()
      .setArray(qArray)
      .setAuthorizedUsers([message.author.id])
      .setChannel(message.channel)
      .setColor("RANDOM");
    qEmbed.build();
  }

  //queue command end

  //play

  if (message.content.startsWith(curprefix + "play")) {
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES"))
      return SendErrorMessage(
        message,
        "I need to have MANAGE_MESSAGES to run this command!"
      );
    if (!message.member.voice.channel) {
      SendErrorMessage(
        message,
        "You need to be in a voice channel to run this command."
      );
      return;
    }
    if (!message.member.voice.channel.speakable)
      return SendErrorMessage(
        message,
        "I can't play anything in that channel!"
      );
    if (args[0] == null)
      return SendErrorMessage(
        message,
        "You didn't give a link or a search term."
      );
    console.log(args);
    if (!playServers[message.guild.id]) {
      playServers[message.guild.id] = {
        dispatch: someRandomThing,
        connection: someRandomThing,
        queue: [],
        playing: false,
        paused: false,
        looping: false,
        loopinginfo: {},
      };
    }
    validornot = checkUrl(args[0]);
    if (!validornot) {
      const searched = await ytsr(args.join(" "), { limit: 1 });
      const nextTrackDetails = searched.items[0];
      console.log(nextTrackDetails);
      const nextTrack = {
        url: nextTrackDetails.url,
        title: nextTrackDetails.title,
        channelname: nextTrackDetails.author.name,
        channelurl: nextTrackDetails.author.url,
        thumbnail: nextTrackDetails.bestThumbnail.url,
      };
      playServers[message.guild.id].queue.push(nextTrack);
      console.log(playServers[message.guild.id].queue);
      if (playServers[message.guild.id].playing === true) {
        return SendSuccessMessage(
          message,
          "Successfuly added " +
            `[${nextTrackDetails.title}](${nextTrackDetails.url})  -  [${nextTrackDetails.author.name}](${nextTrackDetails.channelurl})` +
            " to the queue!"
        );
      }
      const connection = await message.member.voice.channel.join();
      playServers[message.guild.id].connection = connection;
      connection.voice.setSelfDeaf(true);
      playNewTrack(message);
    } else {
      isSpotify = matchSpotifyUrl(args[0]);
      isVideo = matchYoutubeUrl(args[0]);
      playlistId = getPlaylistId(args[0]);
      if (isSpotify !== false) {
        console.log(isSpotify);
        var name_title = "";
        var name_title_tracks = "";
        var playlist_songs = [];
        await spotify
          .request(
            `https://api.spotify.com/v1/${isSpotify.query}/${isSpotify.id}`
          )
          .then((data) => {
            name_title_tracks =
              isSpotify.query === "tracks"
                ? `${data.artists[0].name} - ${data.name}`
                : undefined;
            playlist_songs =
              isSpotify.query === "playlists" ? data.tracks.items : undefined;
          })
          .catch(function (err) {
            console.error("Error occurred: " + err);
          });
        if (isSpotify.query === "tracks") {
          const searched = await ytsr(name_title_tracks, {
            limit: 1,
          });
          const nextTrackDetails = searched.items[0];
          console.log(nextTrackDetails);
          const nextTrack = {
            url: nextTrackDetails.url,
            title: nextTrackDetails.title,
            channelname: nextTrackDetails.author.name,
            channelurl: nextTrackDetails.author.url,
            thumbnail: nextTrackDetails.bestThumbnail.url,
          };
          playServers[message.guild.id].queue.push(nextTrack);
          console.log(playServers[message.guild.id].queue);
          if (playServers[message.guild.id].playing === true) {
            return SendSuccessMessage(
              message,
              "Successfuly added " +
                `[${nextTrackDetails.title}](${nextTrackDetails.url})  -  [${nextTrackDetails.author.name}](${nextTrackDetails.channelurl})` +
                " to the queue!"
            );
          }
          const connection = await message.member.voice.channel.join();
          playServers[message.guild.id].connection = connection;
          connection.voice.setSelfDeaf(true);
          playNewTrack(message);
        } else if (isSpotify.query === "playlists") {
          console.log(playlist_songs.length);
          const name_title_first = `${playlist_songs[0].track.artists[0].name} - ${playlist_songs[0].track.name}`;
          const firstsearched = await ytsr(name_title_first, {
            limit: 1,
          });
          const firstTrackDetails = firstsearched.items[0];
          const nextTrack_playlist = {
            url: firstTrackDetails.url,
            title: firstTrackDetails.title,
            channelname: firstTrackDetails.author.name,
            channelurl: firstTrackDetails.author.url,
            thumbnail: firstTrackDetails.bestThumbnail.url,
          };
          playServers[message.guild.id].queue.push(nextTrack_playlist);
          playlist_songs.splice(0, 1);
          playlist_songs.forEach(async (song) => {
            name_title = `${song.track.artists[0].name} - ${song.track.name}`;
            const searched = await ytsr(name_title, {
              limit: 1,
            });
            const nextTrackDetails = searched.items[0];
            const nextTrack_playlist = {
              url: nextTrackDetails.url,
              title: nextTrackDetails.title,
              channelname:
                nextTrackDetails.author !== undefined
                  ? nextTrackDetails.author.name
                  : "Couldn't find channel",
              channelurl:
                nextTrackDetails.author !== undefined
                  ? nextTrackDetails.author.url
                  : "",
              thumbnail:
                nextTrackDetails.bestThumbnail !== undefined
                  ? nextTrackDetails.bestThumbnail.url
                  : "https://i.imgur.com/ebv8tyw.png",
            };
            playServers[message.guild.id].queue.push(nextTrack_playlist);
          });
          if (playServers[message.guild.id].playing === true) {
            return SendSuccessMessage(
              message,
              "Successfuly added " +
                `${playlist_songs.length + 1} tracks` +
                " to the queue!"
            );
          }
          SendSuccessMessage(
            message,
            "Successfuly added " +
              `${playlist_songs.length + 1} tracks` +
              " to the queue!"
          );
          const connection = await message.member.voice.channel.join();
          playServers[message.guild.id].connection = connection;
          connection.voice.setSelfDeaf(true);
          playNewTrack(message);
        } else
          return SendErrorMessage(message, "Couldn't find song on youtube.");
      } else if (playlistId !== false) {
        const playlist = await ytpl(playlistId.toString());
        const list_items = playlist.items;
        list_items.forEach((item) => {
          item_info = {
            title: item.title,
            url: item.url,
            channelname: item.author.name,
            channelurl: item.author.url,
            thumbnail: item.thumbnails[0].url,
          };
          playServers[message.guild.id].queue.push(item_info);
        });
        SendSuccessMessage(message, `Queued ${list_items.length} videos.`);
        if (!playServers[message.guild.id].playing) {
          const connection = await message.member.voice.channel.join();
          connection.voice.setSelfDeaf(true);
          playServers[message.guild.id].connection = connection;
          playNewTrack(message);
        }
      } else if (isVideo !== false) {
        someInfo = await getVideoDetails(args[0]);
        let vidTitle = someInfo.title;
        let channelTitle = someInfo.author.name;
        let channelURL =
          "https://www.youtube.com/channel/" + someInfo.channelId;
        let nextTrackDetails = {
          url: args[0],
          title: vidTitle,
          channelname: channelTitle,
          channelurl: channelURL,
          thumbnail: someInfo.thumbnails[0].url,
        };
        playServers[message.guild.id].queue.push(nextTrackDetails);
        console.log(playServers[message.guild.id].queue);
        if (playServers[message.guild.id].playing === true) {
          return SendSuccessMessage(
            message,
            "Successfuly added " +
              `[${vidTitle}](${args[0]})  -  [${channelTitle}](${channelURL})` +
              " to the queue!"
          );
        } else {
          playServers[message.guild.id].playing = true;
          playServers[message.guild.id].queue = [];
          someInfo = await getVideoDetails(args[0]);
          let vidTitle = someInfo.title;
          let channelTitle = someInfo.author.name;
          let channelURL =
            "https://www.youtube.com/channel/" + someInfo.channelId;
          let nextTrackDetails = {
            url: args[0],
            title: vidTitle,
            channelname: channelTitle,
            channelurl: channelURL,
            thumbnail: someInfo.thumbnails[0].url,
          };
          playServers[message.guild.id].queue.push(nextTrackDetails);

          const connection = await message.member.voice.channel.join();
          connection.voice.setSelfDeaf(true);
          playServers[message.guild.id].connection = connection;
          playNewTrack(message);
        }
      } else {
        return SendErrorMessage(message, "That isn't a Youtube url!");
      }
    }
  }

  //play end

  //leave

  if (
    message.content.startsWith(curprefix + "öl") ||
    message.content.startsWith(curprefix + "fuckoff") ||
    message.content.startsWith(curprefix + "die") ||
    message.content.startsWith(curprefix + "öl") ||
    message.content.startsWith(curprefix + "sg")
  ) {
    playServers[message.guild.id].queue = [];
    playServers[message.guild.id].playing = false;
    playServers[message.guild.id].looping = false;
    playServers[message.guild.id].paused = false;
    message.guild.me.voice.channel.leave();
  }

  //leave end

  //cemalroulette

  if (
    message.content.startsWith(curprefix + "cemalroulette") &&
    message.guild.id == "486163617507573760"
  ) {
    message.reply(
      `${Math.floor(Math.random() * 24)} hours, ${
        Math.floor(Math.random() * 59) + 1
      } minutes, ${Math.floor(Math.random() * 59) + 1} seconds.`
    );
  }

  //cemalroulette end
});

client.on("error", (err) => {
  console.log(err);
});

client.login(token);
