function getPlaylistId(url) {
    let p = /^.*(youtu.be\/|list=)([^#\&\?]*).*/;
    let matches = url.match(p);
    if (matches) {
        return matches[2];
    }
    return false;
}

module.exports = getPlaylistId;
