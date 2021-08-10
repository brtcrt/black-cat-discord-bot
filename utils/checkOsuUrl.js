function matchOsuUrl(url) {
    let p =
        /^(?:https?:\/\/)?(?:osu\.)?ppy\.sh\/(?:(?:beatmapsets\/))([0-9]*#)(.*\/)([0-9]*\/|.*)(?:\S+)?$/;
    let matches = url.match(p);
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
