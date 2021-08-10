// Dependencies & variables

const { MessageActionRow, MessageButton } = require("discord.js");
const cross = "<:tcross:838119759219654656>";
const vertical = "<:ver:838119671684792341>";
const horizontal = "<:hor:838119722783604847>";
const empty = ":flushed:";
const x = ":x:";
const o = ":o:";
const moves = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const emojiList = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔁"];
const timeout = 60 * 1000;
// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

function AutoPlay(squares) {
    let won = calculateWinner(squares);
    let draw = checkDraw(squares);
    if (won) {
        return;
    } else if (draw) {
        return;
    }

    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
            squares[i] = "O";
            let score = minimax(squares, 0, false);
            squares[i] = null;
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    squares[bestMove] = "O";
    return {
        squares: squares,
        position: bestMove,
    };
    //let emptySquares = [];
    //for(let i=0; i<squares.length; i++) {
    //  if (squares[i] === null) {
    //    emptySquares.push(i);
    //  }
    //}
    //const randomSquare = Math.floor(Math.random()*emptySquares.length);
    //squares[emptySquares[randomSquare]] = "O";
}

function minimax(squares, depth, isMaximizing) {
    let scores = {
        X: -1,
        O: 1,
        draw: 0,
    };
    let winner = calculateWinner(squares);
    let result = null;
    if (checkDraw(squares)) {
        result = "draw";
    }
    if (winner) {
        result = winner;
    }
    if (result !== null) {
        return scores[result];
    }
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < squares.length; i++) {
            if (squares[i] == null) {
                squares[i] = "O";
                let score = minimax(squares, depth + 1, false);
                squares[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < squares.length; i++) {
            if (squares[i] == null) {
                squares[i] = "X";
                let score = minimax(squares, depth + 1, true);
                squares[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkDraw(squares) {
    let filled = 0;
    for (let i = 0; i < squares.length; i++) {
        if (squares[i] !== null) {
            filled++;
        }
    }
    if (filled === 9) {
        return true;
    } else {
        return false;
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return squares[a];
        }
    }
    return null;
}
class xox {
    constructor() {
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
            finished: false,
        };
    }
    visualize() {
        const squares = this.state.squares.slice();
        let status = "";
        let board_string = "";
        for (let i = 0; i < 9; i++) {
            let added = "";
            if (squares[i] === "O") {
                added = o;
            } else if (squares[i] === "X") {
                added = x;
            } else {
                added = emojiList[i];
            }
            if (i === 2 || i === 5) {
                board_string += `${added}\n${horizontal}${cross}${horizontal}${cross}${horizontal}\n`;
            } else if (i === 8) {
                board_string += `${added}`;
            } else {
                board_string += `${added}${vertical}`;
            }
        }
        const winner = calculateWinner(this.state.squares);
        const draw = checkDraw(this.state.squares);
        if (winner) {
            status = `Winner is ${winner}`;
        } else if (draw) {
            status = "It's a draw.";
        } else {
            status = `Next player: X`;
        }
        const visual = {
            title: status,
            description: board_string,
            footer: {
                text: `X: You  |  O: Ai`,
            },
        };
        return visual;
    }
    move(position, message) {
        const squares = this.state.squares.slice();
        if (squares[position] === "O" || squares[position] === "X") return;
        squares[position] = "X";
        let draw = checkDraw(squares);
        let won = calculateWinner(squares);
        if (!won && !draw) {
            this.state.xIsNext = this.state.xIsNext === true ? false : true;
            const ai_response = AutoPlay(squares);
            this.state.squares = ai_response.squares;
        } else {
            this.state.squares = squares;
            this.state.finished = true;
            return "GAME FINISHED";
        }
    }
}

module.exports = {
    name: "xox",
    description: "Play a game of tic-tac-toe against me.",
    category: "Game",
    usage: "xox",
    cooldown: 1,
    aliases: ["tictactoe", "tic-tac-toe"],
    async execute(client, interaction) {
        let game = new xox();
        const update_board = () => {
            interaction.editReply({ embeds: [game.visualize()] });
        };

        const row1 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("0")
                    .setLabel("1")
                    .setStyle("PRIMARY")
            )
            .addComponents(
                new MessageButton()
                    .setCustomId("1")
                    .setLabel("2")
                    .setStyle("PRIMARY")
            )
            .addComponents(
                new MessageButton()
                    .setCustomId("2")
                    .setLabel("3")
                    .setStyle("PRIMARY")
            );
        const row2 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("3")
                    .setLabel("4")
                    .setStyle("PRIMARY")
            )
            .addComponents(
                new MessageButton()
                    .setCustomId("4")
                    .setLabel("5")
                    .setStyle("PRIMARY")
            )
            .addComponents(
                new MessageButton()
                    .setCustomId("5")
                    .setLabel("6")
                    .setStyle("PRIMARY")
            )
            .addComponents(
                new MessageButton()
                    .setCustomId("restart")
                    .setLabel("Restart")
                    .setStyle("DANGER")
            );
        const row3 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("6")
                    .setLabel("7")
                    .setStyle("PRIMARY")
            )
            .addComponents(
                new MessageButton()
                    .setCustomId("7")
                    .setLabel("8")
                    .setStyle("PRIMARY")
            )
            .addComponents(
                new MessageButton()
                    .setCustomId("8")
                    .setLabel("9")
                    .setStyle("PRIMARY")
            );

        await interaction.reply({
            embeds: [game.visualize()],
            components: [row1, row2, row3],
        });
        const message = await interaction.fetchReply();
        const filter = (i) => !i.user.bot && i.user.id == interaction.user.id;
        const buttonCollector = message.channel.createMessageComponentCollector(
            {
                filter: filter,
                time: timeout,
            }
        );
        buttonCollector.on("collect", async (i) => {
            switch (i.customId) {
                case "0":
                    game.move(0);
                    update_board();
                    await i.update("X");
                    break;
                case "1":
                    game.move(1);
                    update_board();
                    await i.update("X");
                    break;
                case "2":
                    game.move(2);
                    update_board();
                    await i.update("X");
                    break;
                case "3":
                    game.move(3);
                    update_board();
                    await i.update("X");
                    break;
                case "4":
                    game.move(4);
                    update_board();
                    await i.update("X");
                    break;
                case "5":
                    game.move(5);
                    update_board();
                    await i.update("X");
                    break;
                case "6":
                    game.move(6);
                    update_board();
                    await i.update("X");
                    break;
                case "7":
                    game.move(7);
                    update_board();
                    await i.update("X");
                    break;
                case "8":
                    game.move(8);
                    update_board();
                    await i.update("X");
                    break;
                case "restart":
                    game = new xox();
                    update_board();
                    await i.update("Restarted");
                    break;
                default:
                    break;
            }
        });
        buttonCollector.on("end", () => {
            console.log("end");
        });
    },
};
