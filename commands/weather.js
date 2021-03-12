const request = require("request");
const Discord = require("discord.js")


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

module.exports = {
	name: 'weather',
	description: 'Get weather information.',
    cooldown: 2,
    aliases: [],
	async execute(message, args) {
        let sent = await message.channel.send("Getting weather info...");
        let cont = message.content.slice(1).split(" ").slice(1);
        let cityName = cont.join(" ");
        let currentWeather;
        let degree;
        let degreeFeels;
        let location;
        let Body;
        if (!cont) return SendErrorMessage(message, "You didn't give a city name!");
        const options = {
            method: 'GET',
            url: 'https://community-open-weather-map.p.rapidapi.com/weather',
            qs: {q: cityName, units: 'metric'},
            headers: {
              'x-rapidapi-key': '372dabaf3fmsh38c6ac27799777ap1e9f4bjsn23447de3f22a',
              'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
              useQueryString: true
            },
            mode: "JSON"
        };
        await request(options, async function (error, response, body) {
            if (error) throw new Error(error);
            Body = JSON.parse(body);
            console.log(Body);
            if(!Body.weather) return SendErrorMessage(message, "Couldn't find any results :(");
            currentWeather = Body.weather[0].description;
            currentWeather = currentWeather.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
            degree = Body.main.temp;
            degreeFeels = Body.main.feels_like;
            location = Body.name + ", " + Body.sys.country;
            let min = Body.main.temp_min.toString() + "/";
            let max = Body.main.temp_max.toString();
            let minMax = min + max
            let weatherMessage = new Discord.MessageEmbed()
            .setTitle("Weather in " + location)
            .setDescription(currentWeather)
            .addFields(
                {name: "Temperature:", value: degree.toString(), inline: false},
                {name: "Feels Like:", value: degreeFeels.toString(), inline: true},
                {name: "Min/Max Temp:", value: minMax, inline: true}
            )
            .setColor("RANDOM");
            await sent.edit(weatherMessage);
        });
	},
};