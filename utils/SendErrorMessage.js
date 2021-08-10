function SendErrorMessage(
    message,
    reason = "Looks like something went wrong. Please try again. If you need help use =bot?"
) {
    let generalerrormessage = {
        title: "Uh oh! Someting went wrong!",
        color: "#f01717",
        description: reason.toString(),
    };

    message.channel.send({ embeds: [generalerrormessage] });
    return;
}

module.exports = SendErrorMessage;
