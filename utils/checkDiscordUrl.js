function matchSpotifyUrl(url) {
    let p =
        /^(?:https?:\/\/)?(?:cdn\.)?discordapp\.com\/attachments\/(?:[0-9]{18})\/(?:[0-9]{18})\/(?:.+)$/gm;

    return p.test(url);
}

module.exports = matchSpotifyUrl;
