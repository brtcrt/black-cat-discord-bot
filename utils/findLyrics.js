const geniustoken = process.env.GENIUSTOKEN;
const nodefetch = require("node-fetch");
const cheerio = require("cheerio");
const SendErrorMessage = require("./SendErrorMessage");

const findLyrics = async (interaction, loopingTrack) => {
    let songName = loopingTrack.title;
    songName = songName.replace(/ *\([^)]*\) */g, "");
    songName = songName.replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
        ""
    );
    console.log(songName);
    let searchUrl = `https://api.genius.com/search?q=${encodeURI(songName)}`;
    const headers = {
        Authorization: `Bearer ${geniustoken}`,
    };
    try {
        const body = await nodefetch(searchUrl, { headers });
        const result = await body.json();
        if (!result) return SendErrorMessage(message);
        const songPath = result.response.hits[0].result.api_path;
        if (!songPath)
            return SendErrorMessage(message, "Couldn't find lyrics for this.");
        const LyricsPath = `https://api.genius.com${songPath}`;
        console.log(LyricsPath);
        const body2 = await nodefetch(LyricsPath, { headers });
        const result2 = await body2.json();
        if (!result2.response.song.url) return SendErrorMessage(interaction);
        const pageUrl = result2.response.song.url;
        const response3 = await nodefetch(pageUrl);
        lyricsURL = pageUrl;
        const text = await response3.text();
        const $ = cheerio.load(text);
        let lyrics = $(".lyrics").text().trim();
        if (!lyrics) {
            $(".Lyrics__Container-sc-1ynbvzw-2").find("br").replaceWith("\n");
            lyrics = $(".Lyrics__Container-sc-1ynbvzw-2").text();
            if (!lyrics) {
                return SendErrorMessage(interaction);
            } else {
                return lyrics.replace(/(\[.+\])/g, "");
            }
        } else {
            return lyrics.replace(/(\[.+\])/g, "");
        }
    } catch (e) {
        console.log(e);
    }
};

module.exports = findLyrics;
