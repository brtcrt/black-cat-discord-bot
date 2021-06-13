function matchOsuUrl(url) {
    var p =
        /^(?:https?:\/\/)?(?:osu\.)?ppy\.sh\/(?:(?:beatmapsets\/))([0-9]*#)(.*\/)([0-9]*\/|.*)(?:\S+)?$/;
    var matches = url.match(p);
    if (matches) {
        return {
            setid: matches[1],
            mode: matches[2],
            id: matches[3],
        };
    }
    return false;
}

module.exports = matchOsuUrl;
