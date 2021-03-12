// Dependencies & variables

const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
let todolist  = require(path.join(__dirname, "../")+"/database/todolist.json");
let prefixes = require(path.join(__dirname, "../")+"/database/prefixes.json");

// Dependencies & variables end

// Error Message Template

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

// Error Message Template

module.exports = {
    name: "todo",
    description: "",
    cooldown: 1,
    aliases: ["todolist"],
    async execute(message, args){
        let curprefix = prefixes[message.guild.id].prefix;
        if(!todolist[message.author.id] && !message.author.bot){
            todolist[message.author.id] = [

            ];
        };
        if(todolist[message.author.id] && !message.author.bot && !args[0]){
            if(todolist[message.author.id].length <= 0) {
                let nothinginlist = new Discord.MessageEmbed()
                .setTitle("Uh oh! Something went wrong!")
                .setColor("#f01717") 
                .setDescription("Looks like you don't have anything in your todo list. If you need help, use " + curprefix + "help todo");
                message.channel.send(nothinginlist)
            } else {
                const randomColor = () => {
                    let color = '#';
                    for (let i = 0; i < 6; i++){
                       const random = Math.random();
                       const bit = (random * 16) | 0;
                       color += (bit).toString(16);
                    };
                    return color;
                };
                let usertodolist = {
                    color: randomColor(),
                    title: "Todo list for "+message.author.username,
                    author: {
                        name: message.author.username,
                        icon_url: message.author.avatarURL()
                    },
                    fields: [

                    ]
                };
                for(let i = 0; i < todolist[message.author.id].length; i++ ){
                    usertodolist.fields.push({
                        name: "Number " + (i+1).toString(),
                        value: todolist[message.author.id][i].toString(),
                        inline: false
                    });
                };
                message.channel.send({embed: usertodolist});
            }
        } else if(todolist[message.author.id] && !message.author.bot && args[0] == "add"){
            let addTodo = args.slice(1).join(" ");
            if (!addTodo){
                let failMessage = new Discord.MessageEmbed()
                .setTitle("Uh oh! Something went wrong!")
                .setColor("#f01717")
                .setDescription("You can't add an empty string to your todo list!");
                return message.channel.send(failMessage);
            };
            todolist[message.author.id].push(addTodo);
            let addedMessage = new Discord.MessageEmbed()
            .setTitle("Success!")
            .setColor("#22ff00")
            .setDescription(addTodo+" was added to your todo list.");
            message.channel.send(addedMessage);
            fs.writeFile("./todolist.json", JSON.stringify(todolist, null, 4), (err)=>{
                if(err) console.log(err);
            });
        } else if(todolist[message.author.id] && !message.author.bot && args[0] == "remove"){
            if (!args[1] || !Number.isInteger(parseInt(args[1]))){
                let failMessage = new Discord.MessageEmbed()
                .setTitle("Uh oh! Something went wrong!")
                .setColor("#f01717")
                .setDescription("You didn't specify which one to take off your todo list!");
                return message.channel.send(failMessage);
            };
            let removedone = todolist[message.author.id][parseInt(args[1])-1];
            todolist[message.author.id].splice(parseInt(args[1])-1, 1);
            let removedMessage = new Discord.MessageEmbed()
            .setTitle("Success!")
            .setColor("#22ff00")
            .setDescription(removedone +" was removed from your todo list.");
            message.channel.send(removedMessage);
            fs.writeFile("./todolist.json", JSON.stringify(todolist, null, 4), (err)=>{
                if(err) console.log(err);
            });
        } else if(todolist[message.author.id] && !message.author.bot && args[0] == "change"){
            if (!args[1] || !Number.isInteger(parseInt(args[1]))){
                console.log(1);
                let failMessage = new Discord.MessageEmbed()
                .setTitle("Uh oh! Something went wrong!")
                .setColor("#f01717")
                .setDescription("You didn't specify which one to change!");
                return message.channel.send(failMessage);
            }
            let changedTodo = args.slice(1).slice(1).join(" ");
            if (!changedTodo){
                let failMessage = new Discord.MessageEmbed()
                .setTitle("Uh oh! Something went wrong!")
                .setColor("#f01717")
                .setDescription("You can't add an empty string to your todo list!");
                return message.channel.send(failMessage);
            };
            changedone = todolist[message.author.id][parseInt(args[1])-1];
            todolist[message.author.id].splice(parseInt(args[1])-1, 1);
            todolist[message.author.id].push(changedTodo);
            let changedMessage = new Discord.MessageEmbed()
            .setTitle("Success!")
            .setColor("#22ff00")
            .setDescription(changedone + " was changed to " + changedTodo);
            message.channel.send(changedMessage);
            fs.writeFile(path.join(__dirname, "../")+"/database/todolist.json", JSON.stringify(todolist, null, 4), (err)=>{
                if(err) console.log(err);
            });
        };
    }
};