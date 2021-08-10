const Discord = require("discord.js");
const {
    AudioPlayerStatus,
    VoiceConnectionStatus,
    getVoiceConnection,
    StreamType,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
} = require("@discordjs/voice");
const matchDiscordUrl = require("./checkDiscordUrl");
const ytdl = require("ytdl-core");
let lastSentPlaying;

const playNewTrack = async (client, message, loopingTrack) => {
    // please someone end my fucking suffering
    let startedMessage;
    let nextTrack;
    let nextTrackURL;
    if (
        message.guild.me.permissions.has(
            Discord.Permissions.FLAGS.MANAGE_MESSAGES
        ) &&
        lastSentPlaying
    ) {
        lastSentPlaying.delete();
    } else console.log(lastSentPlaying);
    if (!client.playServers[message.guild.id].looping) {
        nextTrack = client.playServers[message.guild.id].queue.shift();
        console.log(nextTrack);
        nextTrackURL = nextTrack.url;
    }

    if (client.playServers[message.guild.id].looping) {
        console.log(loopingTrack);
        nextTrack = loopingTrack;
        nextTrackURL = loopingTrack.url;
    }
    const connection = getVoiceConnection(message.guild.id);
    client.playServers[message.guild.id].loopinginfo.title = nextTrack.title;
    client.playServers[message.guild.id].loopinginfo.url = nextTrackURL;
    client.playServers[message.guild.id].loopinginfo.channelname =
        nextTrack.channelname;
    client.playServers[message.guild.id].loopinginfo.channelurl =
        nextTrack.channelurl;
    client.playServers[message.guild.id].loopinginfo.thumbnail =
        nextTrack.thumbnail;
    const stream = matchDiscordUrl(nextTrackURL)
        ? nextTrackURL
        : ytdl(nextTrackURL, {
              filter: "audioonly",
              highWaterMark: 1 << 25,
          });
    const resource = createAudioResource(stream, {
        inputType: StreamType.Arbitrary,
    });
    const player = createAudioPlayer();

    player.play(resource);
    connection.subscribe(player);
    client.playServers[message.guild.id].dispatch = player;
    client.playServers[message.guild.id].paused = false;
    client.playServers[message.guild.id].playing = true;
    startedMessage = new Discord.MessageEmbed()
        .setTitle("Now Playing:")
        .setColor("RANDOM")
        .setDescription(
            `[${nextTrack.title.toString()}](${nextTrackURL})  -  [${nextTrack.channelname.toString()}](${
                nextTrack.channelurl
            })`
        )
        .setThumbnail(nextTrack.thumbnail);
    console.log("Now playing!");
    lastSentPlaying = await message.channel.send({ embeds: [startedMessage] });
    let finnishedMessage = new Discord.MessageEmbed()
        .setDescription("Stopped Playing!")
        .setColor("#f01717");
    player.on(AudioPlayerStatus.Idle, () => {
        if (client.playServers[message.guild.id].looping) {
            return playNewTrack(client, message, nextTrack);
        }
        if (client.playServers[message.guild.id].queue[0] != null) {
            console.log("Playing next track.");
            return playNewTrack(client, message);
        } else {
            client.playServers[message.guild.id].playing = false;
            console.log("Finished playing!");
            message.channel.send({ embeds: [finnishedMessage] });
            connection.destroy();
            client.playServers[message.guild.id].queue = [];
            client.playServers[message.guild.id].playing = false;
            client.playServers[message.guild.id].looping = false;
            client.playServers[message.guild.id].paused = false;
        }
    });
    connection.on(
        VoiceConnectionStatus.Disconnected,
        async (oldState, newState) => {
            try {
                await Promise.race([
                    entersState(
                        connection,
                        VoiceConnectionStatus.Signalling,
                        5_000
                    ),
                    entersState(
                        connection,
                        VoiceConnectionStatus.Connecting,
                        5_000
                    ),
                ]);
                // Seems to be reconnecting to a new channel - ignore disconnect
            } catch (error) {
                // Seems to be a real disconnect which SHOULDN'T be recovered from
                connection.destroy();
                client.playServers[message.guild.id].queue = [];
                client.playServers[message.guild.id].playing = false;
                client.playServers[message.guild.id].looping = false;
                client.playServers[message.guild.id].paused = false;
            }
        }
    );
    player.on("error", (error) => {
        console.error(error);
    });
};

module.exports = playNewTrack;
