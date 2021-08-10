const MarkovGen = require("markov-generator");
const fetchLimit = 100;

const generatemarkov = async (message) => {
    let messageArray = [];
    const fetched = await message.channel.messages
        .fetch({ limit: fetchLimit })
        .catch((err) => {
            console.error(err);
            return SendErrorMessage(
                message,
                `Couldn't fetch ${fetchLimit} messages.`
            );
        });
    fetched.forEach((msg) => {
        // console.log(msg.content);
        messageArray.push(msg.content);
    });
    let markov = new MarkovGen({
        input: messageArray,
        minLength: 7,
    });
    const sentance = markov.makeChain();
    return sentance;
};

module.exports = generatemarkov;
