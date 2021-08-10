function slash_SuccessMessage(
    interaction,
    success = "Successfuly executed the command!"
) {
    let generalsuccessmessage = {
        title: "Success!",
        color: "#09ff01",
        description: success.toString(),
    };
    interaction.reply({ embeds: [generalsuccessmessage] });
    return;
}

module.exports = slash_SuccessMessage;
