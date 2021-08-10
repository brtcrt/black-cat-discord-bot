// Dependencies & variables

const Discord = require("discord.js");
const axios = require("axios");
const xmlToJson = require("xml-to-json-stream");
const parser = xmlToJson({ attributeMode: true });

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "egewhensex",
    description: "Rule 34",
    category: "Rule 34",
    usage: "egewhensex (search_term)",
    cooldown: 1,
    aliases: [
        "egewhentwohamburger",
        "jooobiden",
        "theindustrialrevolutionanditsconsequenceshavebeenadisasterforthehumanrace",
    ],
    async execute(client, message, args) {
        var rule_embed;
        var rule_image;
        if (!args[0])
            return SendErrorMessage(
                message,
                "You need to provide some terms to search for."
            );
        const res = await axios({
            method: "get",
            url: `https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${encodeURIComponent(
                args.join(" ")
            )}`,
        });
        await parser.xmlToJson(res.data.toString(), (err, json) => {
            if (err) {
                console.log(err);
            }

            console.log(json);
            const count = parseInt(json.posts.count);
            const random_index = Math.floor(
                Math.random() * (count - 1 >= 100 ? 100 : count - 1)
            );
            const random_post = json.posts.post[random_index];
            const tags = random_post.tags.trim().split(" ").join(", ");
            const score = random_post.score;
            rule_image = random_post.file_url;
            rule_embed = {
                title: "Have fun ;)",
                fields: [
                    {
                        name: "Tags",
                        value: tags,
                        inline: false,
                    },
                    {
                        name: "Score",
                        value: score,
                        inline: false,
                    },
                ],
                footer: {
                    text: `${count.toString()} results`,
                },
            };
        });
        await message.channel.send({ embed: rule_embed });
        return message.channel.send({
            files: [
                {
                    attachment: rule_image,
                    name: `SPOILER_FILE.${rule_image.split(".").pop()}`,
                },
            ],
        });
    },
};
