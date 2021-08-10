// Dependencies & variables
const Discord = require("discord.js");
const {
    joinVoiceChannel,
    createAudioPlayer,
    NoSubscriberBehavior,
    createAudioResource,
    getVoiceConnection,
    VoiceConnectionStatus,
} = require("@discordjs/voice");
const playNewTrack = require("../../utils/playNewTrack");
const getVideoDetails = require("../../utils/getVideoDetails");
const matchYoutubeUrl = require("../../utils/matchYoutubeUrl");
const matchSpotifyUrl = require("../../utils/checkSpotifyUrl");
const matchDiscordUrl = require("../../utils/checkDiscordUrl");
const checkUrl = require("../../utils/checkUrl");
const getPlaylistId = require("../../utils/checkYTPlaylist");
const ytsr = require("ytsr");
const ytpl = require("ytpl");
const Spotify = require("node-spotify-api");
const spotifyid = process.env.SPOTIFYID;
const spotifysecret = process.env.SPOTIFYSECRET;
const dburi = process.env.DBURI;
const Levels = require("discord-xp");
Levels.setURL(dburi);

const spotify = new Spotify({ id: spotifyid, secret: spotifysecret });

let someInfo;

// Dependencies & variables end

// Error Message Template
const SendSuccessMessage = require("../../utils/slash_SuccessMessage");

const SendErrorMessage = require("../../utils/slash_ErrorMessage");

// Error Message Template

module.exports = {
    name: "play",
    description: "Play some tracks. Support YouTube, Spotify and Discord.",
    options: [
        {
            name: "input",
            type: "STRING",
            description: "Link or search term.",
            required: true,
        },
    ],
    usage: "play [obligatory: search term or link]",
    cooldown: 1,
    aliases: ["playsong"],
    async execute(client, interaction) {
        // oh my fucking god please I fucking hate this piece of actual garbage.
        const input = interaction.options.getString("input");

        if (!interaction.member.voice.channel) {
            SendErrorMessage(
                interaction,
                "You need to be in a voice channel to run this command."
            );
            return;
        }
        if (!interaction.member.voice.channel.speakable)
            return SendErrorMessage(
                interaction,
                "I can't play anything in that channel!"
            );
        console.log(input);
        if (!client.playServers[interaction.guild.id]) {
            client.playServers[interaction.guild.id] = {
                dispatch: null,
                connection: null,
                queue: [],
                playing: false,
                paused: false,
                looping: false,
                loopinginfo: {},
            };
        }
        validornot = checkUrl(input);
        if (!validornot) {
            const searched = await ytsr(input, { limit: 1 });
            const nextTrackDetails = searched.items[0];
            console.log(nextTrackDetails);
            const nextTrack = {
                url: nextTrackDetails.url,
                title: nextTrackDetails.title,
                channelname: nextTrackDetails.author.name,
                channelurl: nextTrackDetails.author.url,
                thumbnail: nextTrackDetails.bestThumbnail.url,
            };
            client.playServers[interaction.guild.id].queue.push(nextTrack);
            console.log(client.playServers[interaction.guild.id].queue);
            if (client.playServers[interaction.guild.id].playing === true) {
                return SendSuccessMessage(
                    interaction,
                    "Successfuly added " +
                        `[${nextTrackDetails.title}](${nextTrackDetails.url})  -  [${nextTrackDetails.author.name}](${nextTrackDetails.channelurl})` +
                        " to the queue!"
                );
            }
            const connection = await joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });
            playNewTrack(client, interaction);
            return SendSuccessMessage(
                interaction,
                "Joined the channel and playing now!"
            );
        } else {
            isSpotify = matchSpotifyUrl(input);
            isVideo = matchYoutubeUrl(input);
            isDiscord = matchDiscordUrl(input);
            playlistId = getPlaylistId(input);
            if (isSpotify !== false) {
                console.log(isSpotify);
                let name_title = "";
                let name_title_tracks = "";
                let playlist_songs = [];
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
                            isSpotify.query === "playlists"
                                ? data.tracks.items
                                : undefined;
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
                    client.playServers[interaction.guild.id].queue.push(
                        nextTrack
                    );
                    console.log(client.playServers[interaction.guild.id].queue);
                    if (
                        client.playServers[interaction.guild.id].playing ===
                        true
                    ) {
                        return SendSuccessMessage(
                            interaction,
                            "Successfuly added " +
                                `[${nextTrackDetails.title}](${nextTrackDetails.url})  -  [${nextTrackDetails.author.name}](${nextTrackDetails.channelurl})` +
                                " to the queue!"
                        );
                    }
                    const connection = await joinVoiceChannel({
                        channelId: interaction.member.voice.channel.id,
                        guildId: interaction.guild.id,
                        adapterCreator: interaction.guild.voiceAdapterCreator,
                    });
                    playNewTrack(client, interaction);
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
                    client.playServers[interaction.guild.id].queue.push(
                        nextTrack_playlist
                    );
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
                        client.playServers[interaction.guild.id].queue.push(
                            nextTrack_playlist
                        );
                    });
                    if (
                        client.playServers[interaction.guild.id].playing ===
                        true
                    ) {
                        return SendSuccessMessage(
                            interaction,
                            "Successfuly added " +
                                `${playlist_songs.length + 1} tracks` +
                                " to the queue!"
                        );
                    }
                    SendSuccessMessage(
                        interaction,
                        "Successfuly added " +
                            `${playlist_songs.length + 1} tracks` +
                            " to the queue!"
                    );
                    const connection = await joinVoiceChannel({
                        channelId: interaction.member.voice.channel.id,
                        guildId: interaction.guild.id,
                        adapterCreator: interaction.guild.voiceAdapterCreator,
                    });
                    playNewTrack(client, interaction);
                } else
                    return SendErrorMessage(
                        interaction,
                        "Couldn't find song on youtube."
                    );
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
                    client.playServers[interaction.guild.id].queue.push(
                        item_info
                    );
                });
                SendSuccessMessage(
                    interaction,
                    `Queued ${list_items.length} videos.`
                );
                if (!client.playServers[interaction.guild.id].playing) {
                    const connection = await joinVoiceChannel({
                        channelId: interaction.member.voice.channel.id,
                        guildId: interaction.guild.id,
                        adapterCreator: interaction.guild.voiceAdapterCreator,
                    });
                    playNewTrack(client, interaction);
                }
            } else if (isVideo !== false) {
                someInfo = await getVideoDetails(input);
                let vidTitle = someInfo.title;
                let channelTitle = someInfo.author.name;
                let channelURL =
                    "https://www.youtube.com/channel/" + someInfo.channelId;
                let nextTrackDetails = {
                    url: input,
                    title: vidTitle,
                    channelname: channelTitle,
                    channelurl: channelURL,
                    thumbnail: someInfo.thumbnails[0].url,
                };
                client.playServers[interaction.guild.id].queue.push(
                    nextTrackDetails
                );
                console.log(client.playServers[interaction.guild.id].queue);
                if (client.playServers[interaction.guild.id].playing === true) {
                    return SendSuccessMessage(
                        interaction,
                        "Successfuly added " +
                            `[${vidTitle}](${input})  -  [${channelTitle}](${channelURL})` +
                            " to the queue!"
                    );
                } else {
                    client.playServers[interaction.guild.id].playing = true;
                    client.playServers[interaction.guild.id].queue = [];
                    someInfo = await getVideoDetails(input);
                    let vidTitle = someInfo.title;
                    let channelTitle = someInfo.author.name;
                    let channelURL =
                        "https://www.youtube.com/channel/" + someInfo.channelId;
                    let nextTrackDetails = {
                        url: input,
                        title: vidTitle,
                        channelname: channelTitle,
                        channelurl: channelURL,
                        thumbnail: someInfo.thumbnails[0].url,
                    };
                    client.playServers[interaction.guild.id].queue.push(
                        nextTrackDetails
                    );

                    const connection = await joinVoiceChannel({
                        channelId: interaction.member.voice.channel.id,
                        guildId: interaction.guild.id,
                        adapterCreator: interaction.guild.voiceAdapterCreator,
                    });
                    playNewTrack(client, interaction);
                    return SendSuccessMessage(
                        interaction,
                        "Joined the channel and playing now!"
                    );
                }
            } else if (isDiscord) {
                let nextTrackDetails = {
                    url: input,
                    title: "unknown",
                    channelname: "unknown",
                    channelurl: input,
                    thumbnail: client.user.avatarURL(),
                };
                client.playServers[interaction.guild.id].queue.push(
                    nextTrackDetails
                );
                console.log(client.playServers[interaction.guild.id].queue);
                if (client.playServers[interaction.guild.id].playing === true) {
                    return SendSuccessMessage(
                        interaction,
                        "Successfuly added " +
                            `[${"unknown"}](${input})  -  [${"unknown"}](${input})` +
                            " to the queue!"
                    );
                } else {
                    client.playServers[interaction.guild.id].playing = true;
                    client.playServers[interaction.guild.id].queue = [];
                    client.playServers[interaction.guild.id].queue.push(
                        nextTrackDetails
                    );
                    const connection = await joinVoiceChannel({
                        channelId: interaction.member.voice.channel.id,
                        guildId: interaction.guild.id,
                        adapterCreator: interaction.guild.voiceAdapterCreator,
                    });
                    playNewTrack(client, interaction);
                }
            } else {
                return SendErrorMessage(
                    interaction,
                    "That isn't a supported format yet!"
                );
            }
        }
    },
};
