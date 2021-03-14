// Dependencies & variables

const Discord = require("discord.js");
const Pagination = require("discord-paginationembed");
const path = require("path");
let xp  = require(path.join(__dirname, "../")+"/database/exp.json");

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
    name: "leaderboards",
    description: "",
    cooldown: 1,
    aliases: ["levels","ranks","lb"],
    async execute(message, args){
        let user;
        let userArray=[];
        let counter = 0;
        let leaderboard = "";
        let xpguild = xp[message.guild.id]
        for(let i=0; i<xp[message.guild.id].length-1; i+=2){
            let infoindex = i+1
            let tx = 0;
            for(let a=0; a<xp[message.guild.id][infoindex].lvl; a++){
                tx+=Math.pow(2,a)*4;
                
            };
            console.log(tx);
            user = {
                id: "",
                level: 0,
                totalxp: 0
            };
            user.id = xpguild[i];
            user.level = xpguild[infoindex].lvl;
            user.totalxp = tx+xpguild[infoindex].exp;
            
            //while(i<xp[message.guild.id].length){
            //    console.log(i);
            //    i++;
            //}
            //for(let a=1; a<xp[message.guild.id].lenght; a+=2){
            //    console.log("something");
            //    let current = a;
            //    let tx = 0;
            //    for(let b=0; b<xpguild[current].level-1; b++) {
            //        if(b != xpguild[current].level) {
            //            tx+=Math.pow(2,b)*4;
            //            console.log(tx);
            //        } else {
            //            tx+=xpguild[current].exp;
            //            console.log(tx);
            //        }
            //    }
            //    user.totalxp = tx;
            //}
            userArray.push(user);
            //leaderboard = leaderboard + `${String(counter)}) <@${user.id}> -- Total Experience: ${user.totalxp} \n`;
        }
        userArray.sort((a,b) => {
            return b.totalxp - a.totalxp;
        });
        console.log(userArray);
        for(b=0; b<userArray.length; b++) {
            counter++
            let oneUser = userArray[b];
            leaderboard = leaderboard + `${String(counter)}) <@${oneUser.id}> -- Total Experience: ${oneUser.totalxp}, Level: ${oneUser.level} \n`;
        }
        console.log(leaderboard);
        const lbindex = Math.round(leaderboard.length / 2048) + 1;
        const lbarray = [];
        for (let i = 1; i <= lbindex; ++i) {
          let b = i - 1;
          lbarray.push(
            new Discord.MessageEmbed()
              .setTitle(`${message.guild.name}'s leaderboard, Page #` + i)
              .setDescription(leaderboard.slice(b * 2048, i * 2048))
          );
        }
        const lbEmbed = new Pagination.Embeds()
          .setArray(lbarray)
          .setAuthorizedUsers([message.author.id])
          .setChannel(message.channel)
          .setColor('RANDOM');
        lbEmbed.build();
    }
};