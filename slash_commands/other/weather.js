const request = require("request");
const Discord = require("discord.js");

module.exports = {
    name: "weather",
    description: "Get weather information.",
    options: [
        {
            name: "city",
            type: "STRING",
            description: "City name.",
            required: true,
        },
    ],
    category: "Other",
    usage: "weather [obligatory: city, country, continent?)",
    cooldown: 2,
    aliases: ["weatherreport"],
    async execute(client, interaction) {
        await interaction.deferReply();
        let cityName = interaction.options.getString("city");
        let currentWeather;
        let degree;
        let degreeFeels;
        let location;
        let Body;
        const options = {
            method: "GET",
            url: "https://community-open-weather-map.p.rapidapi.com/weather",
            qs: { q: cityName, units: "metric" },
            headers: {
                "x-rapidapi-key":
                    "372dabaf3fmsh38c6ac27799777ap1e9f4bjsn23447de3f22a",
                "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
                useQueryString: true,
            },
            mode: "JSON",
        };
        await request(options, async function (error, response, body) {
            if (error) throw new Error(error);
            Body = JSON.parse(body);
            if (!Body.weather)
                return interaction.editReply({
                    embeds: [
                        {
                            title: "Uh Oh! Something went wrong!",
                            description:
                                "Couldn't find a location with that name.",
                        },
                    ],
                });
            currentWeather = Body.weather[0].description;
            currentWeather = currentWeather.replace(
                /(^\w{1})|(\s+\w{1})/g,
                (letter) => letter.toUpperCase()
            );
            degree = Body.main.temp;
            degreeFeels = Body.main.feels_like;
            location = Body.name + ", " + Body.sys.country;
            let min = Body.main.temp_min.toString() + "/";
            let max = Body.main.temp_max.toString();
            let minMax = min + max;
            let weatherMessage = new Discord.MessageEmbed()
                .setTitle("Weather in " + location)
                .setDescription(currentWeather)
                .addFields(
                    {
                        name: "Temperature:",
                        value: degree.toString(),
                        inline: false,
                    },
                    {
                        name: "Feels Like:",
                        value: degreeFeels.toString(),
                        inline: true,
                    },
                    { name: "Min/Max Temp:", value: minMax, inline: true }
                )
                .setColor("RANDOM");
            await interaction.editReply({ embeds: [weatherMessage] });
        });
    },
};
