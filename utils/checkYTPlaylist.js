function getPlaylistId(url) {
    var p = /^.*(youtu.be\/|list=)([^#\&\?]*).*/
    var matches = url.match(p)
    if (matches) {
        return matches[2]
    }
    return false
}

module.exports = getPlaylistId
