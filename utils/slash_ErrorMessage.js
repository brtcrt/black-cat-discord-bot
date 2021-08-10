function slash_ErrorMessage(
    interaction,
    reason = "Looks like something went wrong. Please try again. If you need help use =bot?"
) {
    let generalerrormessage = {
        title: "Uh oh! Someting went wrong!",
        color: "#f01717",
        description: reason.toString(),
    };

    interaction.reply({ embeds: [generalerrormessage] });
    return;
}

module.exports = slash_ErrorMessage;
