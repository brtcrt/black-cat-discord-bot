// Dependencies & variables

const Discord = require("discord.js");
const axios = require("axios");
const Canvas = require("canvas");
const base_url = "https://pokeapi.co/api/v2/pokemon/";

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/slash_ErrorMessage");

// Error Message Template

module.exports = {
    name: "pokemon",
    description: "Pokemon info.",
    options: [
        {
            name: "input",
            type: "STRING",
            description: "Pokemon name or pokedex number.",
            required: true,
        },
    ],
    usage: "pokemon [obligatory number or name]",
    category: "Other",
    cooldown: 1,
    aliases: ["pokedex"],
    async execute(client, interaction) {
        const input = interaction.options.getString("input");
        await interaction.deferReply();
        const response = await axios.default
            .get(base_url + input.toLowerCase())
            .catch((err) => {
                if (err.response.status == 404) {
                    return interaction.editReply({
                        embeds: [
                            {
                                title: "Uh oh! Someting went wrong!",
                                color: "#f01717",
                                description:
                                    "Couldn't find a pokemon with that name/id. Make sure that you typed it correctly.",
                            },
                        ],
                    });
                }
            });
        if (!response) return;
        const res = response.data;
        // console.log(res);
        const list_name = res.name.split("");
        let name = "";
        for (let char in list_name) {
            console.log(char);
            if (char == 0) {
                name += list_name[char].toUpperCase();
            } else {
                name += list_name[char];
            }
        }
        const pokemon_info = {
            name: name,
            id: res.id,
            sprite: res.sprites.front_default,
        };
        const img_data = await Canvas.loadImage(pokemon_info.sprite);
        const canvas = Canvas.createCanvas(75, 75);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img_data, 0, 0);
        const data = ctx.getImageData(45, 55, 1, 1).data;
        // const img = new Discord.MessageAttachment(canvas.toBuffer(), "img.jpg");
        // message.channel.send(img);
        const pokemon_embed = {
            title: "Here is your Pokémon",
            fields: [
                {
                    name: "Name",
                    value: pokemon_info.name,
                    inline: true,
                },
                {
                    name: "Id",
                    value: pokemon_info.id.toString(),
                    inline: true,
                },
            ],
            image: {
                url: pokemon_info.sprite,
            },
            timestamp: new Date(),
            color: [data[0], data[1], data[2]],
        };
        interaction.editReply({ embeds: [pokemon_embed] });
    },
};
