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

const playNewTrack = async (client, interaction, loopingTrack) => {
    // please someone end my fucking suffering
    let startedMessage;
    let nextTrack;
    let nextTrackURL;
    if (
        interaction.guild.me.permissions.has(
            Discord.Permissions.FLAGS.MANAGE_MESSAGES
        ) &&
        lastSentPlaying
    ) {
        interaction.delete();
    } else console.log(lastSentPlaying);
    if (!client.playServers[interaction.guild.id].looping) {
        nextTrack = client.playServers[interaction.guild.id].queue.shift();
        console.log(nextTrack);
        nextTrackURL = nextTrack.url;
    }

    if (client.playServers[interaction.guild.id].looping) {
        console.log(loopingTrack);
        nextTrack = loopingTrack;
        nextTrackURL = loopingTrack.url;
    }
    const connection = getVoiceConnection(interaction.guild.id);
    client.playServers[interaction.guild.id].loopinginfo.title =
        nextTrack.title;
    client.playServers[interaction.guild.id].loopinginfo.url = nextTrackURL;
    client.playServers[interaction.guild.id].loopinginfo.channelname =
        nextTrack.channelname;
    client.playServers[interaction.guild.id].loopinginfo.channelurl =
        nextTrack.channelurl;
    client.playServers[interaction.guild.id].loopinginfo.thumbnail =
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
    client.playServers[interaction.guild.id].dispatch = player;
    client.playServers[interaction.guild.id].paused = false;
    client.playServers[interaction.guild.id].playing = true;
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
    lastSentPlaying = await interaction.reply({
        embeds: [startedMessage],
    });
    let finnishedMessage = new Discord.MessageEmbed()
        .setDescription("Stopped Playing!")
        .setColor("#f01717");
    player.on(AudioPlayerStatus.Idle, () => {
        if (client.playServers[interaction.guild.id].looping) {
            return playNewTrack(client, interaction, nextTrack);
        }
        if (client.playServers[interaction.guild.id].queue[0] != null) {
            console.log("Playing next track.");
            return playNewTrack(client, interaction);
        } else {
            client.playServers[interaction.guild.id].playing = false;
            console.log("Finished playing!");
            interaction.channel.send({ embeds: [finnishedMessage] });
            connection.destroy();
            client.playServers[interaction.guild.id].queue = [];
            client.playServers[interaction.guild.id].playing = false;
            client.playServers[interaction.guild.id].looping = false;
            client.playServers[interaction.guild.id].paused = false;
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
                client.playServers[interaction.guild.id].queue = [];
                client.playServers[interaction.guild.id].playing = false;
                client.playServers[interaction.guild.id].looping = false;
                client.playServers[interaction.guild.id].paused = false;
            }
        }
    );
    player.on("error", (error) => {
        console.error(error);
    });
};

module.exports = playNewTrack;
