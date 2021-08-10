const checkUrl = require("./checkUrl");
const search = require("youtube-search");
const ytdl = require("ytdl-core");
const ytkey = process.env.YTKEY;
const opts = { maxResults: 1, key: ytkey };

// this stupid fucking thing didn't work without doing the _videoDetails terribleness :(

const getVideoDetails = async (video) => {
    validornot = checkUrl(video);
    if (!validornot) {
        let videoDetails = {
            url: "",
            title: "",
            channelname: "",
            channelurl: "",
            thumbnail: "",
        };
        await search(video, opts, function (err, results) {
            if (err) return console.log(err);
            const _videoDetails = {
                url: results[0].link,
                title: results[0].title,
                channelname: results[0].channelTitle,
                channelurl: `https://www.youtube.com/channel/${results[0].channelId}`,
                thumbnail: results[0].thumbnails.default.url,
            };
            videoDetails.url = _videoDetails.url;
            videoDetails.title = _videoDetails.title;
            videoDetails.channelname = _videoDetails.channelname;
            videoDetails.channelurl = _videoDetails.channelurl;
            videoDetails.thumbnail = _videoDetails.thumbnail;
        });
        return videoDetails;
    } else {
        const someInfo = await ytdl.getBasicInfo(video);
        return someInfo.videoDetails;
    }
};

module.exports = getVideoDetails;
