// Dependencies & variables

const Discord = require("discord.js");
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

function SendErrorMessage(message, reason) {
    if (!reason) {
        reason =
            "Looks like something went wrong. Please try again. If you need help use =bot?";
    }
    let generalerrormessage = new Discord.MessageEmbed()
        .setTitle("Uh oh! Something went wrong!")
        .setColor("#f01717")
        .setDescription(reason.toString());
    message.channel.send(generalerrormessage);
}

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

const example_board = `
❌<:ver:838119671684792341>❌<:ver:838119671684792341>⭕
<:hor:838119722783604847><:tcross:838119759219654656><:hor:838119722783604847><:tcross:838119759219654656><:hor:838119722783604847>
⭕<:ver:838119671684792341>⭕<:ver:838119671684792341>❌
<:hor:838119722783604847><:tcross:838119759219654656><:hor:838119722783604847><:tcross:838119759219654656><:hor:838119722783604847>
❌<:ver:838119671684792341>⭕<:ver:838119671684792341>❌"
`;

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
    name: "tic-tac-toe",
    description: "",
    cooldown: 1,
    aliases: ["xox"],
    async execute(message, args) {
        let game = new xox();
        const update_board = () => {
            sent_board.edit({ embed: game.visualize() });
        };
        const sent_board = await message.channel.send({
            embed: game.visualize(),
        });
        for (k in emojiList) {
            await sent_board.react(emojiList[k]);
        }
        await sent_board.react("🔁");
        const reactionCollector = sent_board.createReactionCollector(
            (reaction, user) =>
                emojiList.includes(reaction.emoji.name) &&
                !user.bot &&
                user.id == message.author.id,
            { time: timeout }
        );
        reactionCollector.on("collect", async (reaction) => {
            reaction.users.remove(message.author);
            switch (reaction.emoji.name) {
                case emojiList[0]:
                    game.move(0);
                    update_board();
                    break;
                case emojiList[1]:
                    game.move(1);
                    update_board();
                    break;
                case emojiList[2]:
                    game.move(2);
                    update_board();
                    break;
                case emojiList[3]:
                    game.move(3);
                    update_board();
                    break;
                case emojiList[4]:
                    game.move(4);
                    update_board();
                    break;
                case emojiList[5]:
                    game.move(5);
                    update_board();
                    break;
                case emojiList[6]:
                    game.move(6);
                    update_board();
                    break;
                case emojiList[7]:
                    game.move(7);
                    update_board();
                    break;
                case emojiList[8]:
                    game.move(8);
                    update_board();
                    break;
                case emojiList[9]:
                    game = new xox();
                    update_board();
                    break;
                default:
                    break;
            }
        });
        reactionCollector.on("end", () => {
            sent_board.reactions.removeAll();
        });
        // if (
        //     !calculateWinner(game.state.squares) &&
        //     !checkDraw(game.state.squares)
        // ) {
        //     message.client.on("messageReactionAdd", async (reaction, user) => {
        //         try {
        //             await reaction.fetch();
        //         } catch (error) {
        //             console.error(
        //                 "Something went wrong when fetching the message: ",
        //                 error
        //             );
        //             return;
        //         }
        //         if (
        //             reaction.message.id === sent_board.id &&
        //             user.id == message.author.id &&
        //             !calculateWinner(game.state.squares) &&
        //             !checkDraw(game.state.squares)
        //         ) {
        //             for (k in emojiList) {
        //                 if (reaction.emoji.name == emojiList[k]) {
        //                     reaction.users.remove(message.author);
        //                     status = game.move(k);
        //                     if (status === "GAME FINISHED") {
        //                         resetable = true;
        //                     }
        //                     update_board();
        //                 }
        //             }
        //             if (reaction.emoji.name == "🔁") {
        //                 reaction.users.remove(message.author);
        //                 game = new xox();
        //                 update_board();
        //             }
        //         }
        //     });
        // }
    },
};
