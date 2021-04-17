// Dependencies & variables

const Discord = require("discord.js");
const path = require("path");
const nodefetch = require("node-fetch");
let { giphytoken } = require(path.join(__dirname, "../") + "/config.json");

// Dependencies & variables end

// Error Message Template

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

// Error Message Template

module.exports = {
  name: "gif",
  description: "Get random gif.",
  cooldown: 1,
  aliases: ["randomgif"],
  async execute(message, args) {
    let sent = await message.channel.send("Getting a random gif...");
    try {
      const response = await nodefetch(
        "https://api.giphy.com/v1/gifs/random?q=" + "&api_key=" + giphytoken
      );
      const body = await response.json();
      sent.edit(body.data.url);
    } catch (e) {
      console.log(e);
    }
  },
};
