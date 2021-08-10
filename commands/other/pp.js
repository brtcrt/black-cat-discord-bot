// Dependencies & variables

const Discord = require("discord.js");
const axios = require("axios");
const pp_key = process.env.PP_KEY;
const base_url = "https://api.tillerino.org/";
const user_base_url = "https://osu.ppy.sh/users/";
const url_checker = require("../../utils/checkOsuUrl");
const mods = {
    hdhr: 24,
    hddt: 72,
    dthr: 80,
    hddthr: 88,
    nf: 1,
    ez: 2,
    td: 4,
    hd: 8,
    hr: 16,
    dt: 64,
    ht: 256,
    fl: 1024,
    so: 4096,
};
const statuses = {
    loved: 4,
    qualified: 3,
    approved: 2,
    ranked: 1,
    pending: 0,
    WIP: -1,
    graveyard: -2,
};
// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "osu-pp",
    description: "pp info for a beatmap in osu!",
    category: "Other",
    usage: "osu-pp [obligatory beatmap link or id] (optional: mod or mod combinations like hddt or hdhr)",
    cooldown: 1,
    aliases: ["osu-beatmap"],
    async execute(client, message, args) {
        if (!args[0] || args[0] === "")
            return SendErrorMessage(message, "No id or link given.");
        const url_res = url_checker(args[0]);
        let mod = 0;
        let modname = "";
        let status = "";
        for (let arg of args) {
            if (mods[arg.trim().replace("+", "")]) {
                mod += mods[arg.trim().replace("+", "")];
                modname += arg.trim().replace("+", "");
            }
        }
        if (url_res.id) {
            const res = await axios({
                url: `${base_url}beatmapinfo?beatmapid=${url_res.id}&k=${pp_key}&mods=${mod}`,
                method: "get",
            });
            const res_map = await axios({
                url: `${base_url}beatmaps/byId/${url_res.id}?k=${pp_key}`,
                method: "get",
            });

            const map_data = res_map.data;
            for (let stat in statuses) {
                if (statuses[stat] === map_data.approved) {
                    status = stat;
                }
            }
            const cover_page = `https://assets.ppy.sh/beatmaps/${map_data.setId}/covers/cover.jpg`;
            const data = res.data;
            const pps = data.ppForAcc;
            const osu_embed = {
                title: map_data.fullName,
                url: `https://osu.ppy.sh/beatmapsets/${map_data.setId}#osu/${map_data.beatmapId}`,
                thumbnail: {
                    url: cover_page,
                },
                fields: [
                    {
                        name: "Creator",
                        value: `[${map_data.creator}](${user_base_url}${map_data.creatorId})`,
                        inline: false,
                    },
                    {
                        name: "Status",
                        value: `${status}`,
                        inline: false,
                    },
                    {
                        name: "Difficulty",
                        value: `Star rating: ${map_data.starDifficulty}${
                            data.starDiff !== map_data.starDifficulty
                                ? ` (Adjusted: ${data.starDiff})`
                                : ""
                        }
                        CS: ${map_data.circleSize}
                        HP: ${map_data.healthDrain}
                        AR: ${map_data.approachRate}
                        OD : ${map_data.overallDifficulty}`,
                        inline: false,
                    },
                    {
                        name: "pp",
                        value: `95%: ${pps["0.95"]}
                        97%: ${pps["0.97"]}
                        99%: ${pps["0.99"]}
                        100%: ${pps["1.0"]}`,
                        inline: false,
                    },
                ],
            };
            message.channel.send({ embeds: [osu_embed] });
        } else {
            const beatmap_id = args[0];
            const res = await axios({
                url: `${base_url}beatmapinfo?beatmapid=${beatmap_id}&k=${pp_key}&mods=${mod}`,
                method: "get",
            });
            const res_map = await axios({
                url: `${base_url}beatmaps/byId/${beatmap_id}?k=${pp_key}`,
                method: "get",
            });

            const map_data = res_map.data;
            for (let stat in statuses) {
                if (statuses[stat] === map_data.approved) {
                    status = stat;
                }
            }
            const cover_page = `https://b.ppy.sh/thumb/${map_data.setId}l.jpg`;
            const data = res.data;
            const pps = data.ppForAcc;
            const osu_embed = {
                title: map_data.fullName,
                url: `https://osu.ppy.sh/beatmapsets/${map_data.setId}#osu/${map_data.beatmapId}`,
                thumbnail: {
                    url: cover_page,
                },
                fields: [
                    {
                        name: "Creator",
                        value: `[${map_data.creator}](${user_base_url}${map_data.creatorId})`,
                        inline: false,
                    },
                    {
                        name: "Status",
                        value: `${status}`,
                        inline: false,
                    },
                    {
                        name: "Difficulty",
                        value: `Star rating: ${map_data.starDifficulty}${
                            data.starDiff !== map_data.starDifficulty
                                ? ` (Adjusted: ${data.starDiff})`
                                : ""
                        }
                        CS: ${map_data.circleSize}
                        HP: ${map_data.healthDrain}
                        AR: ${map_data.approachRate}
                        OD : ${map_data.overallDifficulty}`,
                        inline: false,
                    },
                    {
                        name: "pp",
                        value: `95%: ${pps["0.95"]}
                        97%: ${pps["0.97"]}
                        99%: ${pps["0.99"]}
                        100%: ${pps["1.0"]}`,
                        inline: false,
                    },
                ],
            };
            message.channel.send({ embeds: [osu_embed] });
        }
    },
};
