function SendSuccessMessage(
    message,
    success = "Successfuly executed the command!"
) {
    let generalsuccessmessage = {
        title: "Success!",
        color: "#09ff01",
        description: success.toString(),
    };
    message.channel.send({ embeds: [generalsuccessmessage] });
    return;
}

module.exports = SendSuccessMessage;
