// node modules

const Discord = require("discord.js");
const mongoose = require("mongoose");
const axios = require("axios");
let reminder = require("./database/reminders.json");
const Canvas = require("canvas");
const fs = require("fs");
require("dotenv/config");
const dblkey = process.env.DBLKEY;
const token = process.env.TOKEN;
const blackcatid = process.env.BLACKCATID;
const dburi = process.env.DBURI;
const top_token = process.env.TOP_TOKEN;
const Levels = require("discord-xp");
const SendSuccessMessage = require("./utils/SendSuccessMessage");
const SendErrorMessage = require("./utils/SendErrorMessage");

Levels.setURL(dburi);

// node modules end

// db stuff

const config = {
    level: { type: Boolean, default: true },
    join: { type: Boolean, default: true },
};

const GuildSchema = new mongoose.Schema({
    guild_id: String,
    prefix: { type: String, default: "=" },
    config: config,
});

const UserSchema = new mongoose.Schema({
    user_id: String,
    rr_streaks: {
        winstreak: { type: Number, default: 0 },
        losestreak: { type: Number, default: 0 },
        longestwin: { type: Number, default: 0 },
        longestloss: { type: Number, default: 0 },
    },
});

const User = mongoose.model("User", UserSchema);
const Guild = mongoose.model("Guild", GuildSchema);

mongoose.connect(dburi);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Connected to mongo.");
});

// db stuff end

// discord client stuff

const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    ],
});
client.models = new Discord.Collection();
client.commands = new Discord.Collection();
client.slash_commands = new Discord.Collection();
client.playServers = {};
client.curprefix;
client.curr_user;
client.config = config;
const cooldowns = new Discord.Collection();

// discord client stuff end

// setting up the models collection

client.models.set("User", User);
client.models.set("Guild", Guild);

// setting up the models collection end

// variables

// variables end

// getting commands

const commandFolders = fs.readdirSync("./commands");

for (const folder of commandFolders) {
    const commandFiles = fs
        .readdirSync(`./commands/${folder}`)
        .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

const slash_commandFolders = fs.readdirSync("./slash_commands");

for (const slash_folder of slash_commandFolders) {
    const slash_commandFiles = fs
        .readdirSync(`./slash_commands/${slash_folder}`)
        .filter((file) => file.endsWith(".js"));
    for (const slash_file of slash_commandFiles) {
        const command = require(`./slash_commands/${slash_folder}/${slash_file}`);
        client.slash_commands.set(command.name, command);
    }
}

// getting commands end

client.on("ready", () => {
    console.log("Ready!");
    setInterval(() => {
        let activities_list = [
            "=bot?",
            "snake | =bot?",
            "with your mom | =bot?",
            "30",
            "russianroulette | =bot?",
            "some music | =bot?",
            "=play | =bot?",
            "=bot? | =bot?",
            "https://www.blackcatbot.xyz | =bot?",
            `${client.guilds.cache.size} servers & ${client.users.cache.size} users | =bot?`,
            "chess | =bot?",
            "=scp | =bot?",
        ];
        const index = Math.floor(
            Math.random() * (activities_list.length - 1) + 1
        );
        client.user.setActivity(activities_list[index], {
            type:
                index === 5 || (index === 3) | (index === 6)
                    ? "LISTENING"
                    : "PLAYING",
        });
    }, 10000);
    setInterval(async () => {
        if (client.user.id != blackcatid) {
            return console.log("Not the real bot!");
        }
        let dbl_options = {
            method: "post",
            url: `https://discordbotlist.com/api/bots/${client.user.id}/stats`,
            Path: {
                id: client.user.id,
            },
            headers: {
                Authorization: dblkey,
            },
            data: {
                guilds: client.guilds.cache.size,
            },
        };
        const resolve_dbl = await axios(dbl_options);
        let top_options = {
            method: "post",
            url: "https://top.gg/api/bots/670266777015549980/stats",
            headers: {
                Authorization: top_token,
            },
            data: {
                server_count: client.guilds.cache.size,
            },
        };
        const resolve_top = await axios(top_options);
    }, 5 * 60 * 1000);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    if (!client.slash_commands.has(interaction.commandName)) return;

    User.findOne(
        { user_id: interaction.user.id },
        "rr_streaks",
        (err, user) => {
            if (err) return console.log(err);
            if (!user) {
                const new_user = new User({
                    user_id: interaction.user.id,
                });
                console.log("Created new user");
                new_user.save((err) => {
                    if (err) return console.log(err);
                });
                client.curr_user = new_user;
            } else {
                client.curr_user = user;
            }
        }
    );

    await Guild.findOne(
        { guild_id: interaction.guild.id },
        "prefix",
        async (err, guild) => {
            if (err) return console.log(err);
            if (!guild) {
                const new_guild = new Guild({
                    guild_id: interaction.guild.id,
                    prefix: "=",
                });
                console.log("Created new guild");
                await new_guild.save((err) => {
                    if (err) return console.log(err);
                });
                client.curprefix = new_guild.prefix;
            } else {
                client.curprefix = guild.prefix;
            }
        }
    );

    try {
        await client.slash_commands
            .get(interaction.commandName)
            .execute(client, interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            embeds: [
                {
                    title: "Uh oh! Something went wrong!",
                    color: "RED",
                    description: "Please try again!",
                },
            ],
            ephemeral: true,
        });
    }
});

client.on("messageCreate", async (message) => {
    if (message.guild === null) return;
    if (message.author.bot) return;
    let createdTime = message.createdTimestamp;
    let d = new Date(createdTime);
    if (
        !message.channel
            .permissionsFor(client.user)
            .toArray()
            .includes("SEND_MESSAGES")
    ) {
        return;
    }

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

    await Guild.findOne(
        { guild_id: message.guild.id },
        "prefix",
        async (err, guild) => {
            if (err) return console.log(err);
            if (!guild) {
                const new_guild = new Guild({
                    guild_id: message.guild.id,
                    prefix: "=",
                });
                console.log("Created new guild");
                await new_guild.save((err) => {
                    if (err) return console.log(err);
                });
                client.curprefix = new_guild.prefix;
            } else {
                client.curprefix = guild.prefix;
            }
        }
    );

    User.findOne({ user_id: message.author.id }, "rr_streaks", (err, user) => {
        if (err) return console.log(err);
        if (!user) {
            const new_user = new User({
                user_id: message.author.id,
            });
            console.log("Created new user");
            new_user.save((err) => {
                if (err) return console.log(err);
            });
            client.curr_user = new_user;
        } else {
            client.curr_user = user;
        }
    });

    const args = message.content
        .slice(client.curprefix.length)
        .trim()
        .split(/ +/);
    //level || rank system
    const cur_guild = await Guild.findOne({ guild_id: message.guild.id });

    const randomAmountOfXp = Math.floor(Math.random() * 20) + 10; // Min 10, Max 30
    const hasLeveledUp = await Levels.appendXp(
        message.author.id,
        message.guild.id,
        randomAmountOfXp
    );

    if (cur_guild.config.level) {
        if (hasLeveledUp) {
            const user = await Levels.fetch(
                message.author.id,
                message.guild.id
            );
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
    }

    if (!message.content.startsWith(client.curprefix) || message.author.bot)
        return;
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
        const expirationTime =
            timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            return;
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(client, message, args);
    } catch (error) {
        console.error(error);
        SendErrorMessage(message);
    }
});

//reminder

var timerID = setInterval(function () {
    // this pos doesn't fucking work really
    var date = new Date();
    reminderlist = reminder["allreminders"];
    for (let i = 0; i < reminderlist.length; i++) {
        if (i % 2 != 0) {
            let splitted = reminder["allreminders"][i - 1].split(" ");
            if (
                reminder["allreminders"][i].Date +
                    " " +
                    reminder["allreminders"][i].Time ==
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
                reminder["allreminders"].splice(i - 1, 2);
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

const applyText = (canvas, text) => {
    const ctx = canvas.getContext("2d");
    let fontSize = 70;
    do {
        ctx.font = `${(fontSize -= 10)}px Poppins`;
    } while (ctx.measureText(text).width > canvas.width - 300);
    return ctx.font;
};

client.on("guildMemberAdd", async (member) => {
    const join_guild = await Guild.findOne({ guild_id: member.guild.id });
    if (!join_guild) {
        return;
    }
    if (!join_guild.config.join) {
        return;
    }
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
        description: `Hey! Thanks for adding me. You can configure some of my setting using =config. If you need any help use =bot? If you have any problems, questions, or if you find any bugs, join [${"the support server"}](${"https://discord.gg/jXQvBj4tup"}) ! If you want to learn more visit [${"the webpage"}](${"https://www.blackcatbot.xyz"}) !`,
        thumbnail: { url: guild.iconURL() },
        footer: {
            text: "Enjoy!",
            icon_url: client.user.avatarURL(),
        },
        timestamp: new Date(),
    };
    guild.systemChannel.send({ embed: thankMessage });
});

process.on("unhandledRejection", (error) => {
    console.error("Unhandled promise rejection:", error);
});

client.on("error", (err) => {
    console.log(err);
});

client.login(token);
