function matchSpotifyUrl(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?open\.spotify\.com\/((?:track\/|playlist\/))((\w|-){22})(?:\S+)?$/;
    var matches = url.match(p);
    if (matches) {
        if (matches[1] === "playlist/") {
            return { query: "playlists", id: matches[2] };
        } else {
            return { query: "tracks", id: matches[2] };
        }
    }
    return false;
}

module.exports = matchSpotifyUrl;
