// Dependencies & variables

const Discord = require("discord.js");
const chess = require("chess");
const Canvas = require("canvas");
const time_limit = 45 * 60 * 1000;

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

class ChessGame {
    constructor(player1, player2) {
        this.gameClient = chess.create({ PGN: true });
        this.draw_vote = 0;
        this.player_ids = [player1, player2];
        this.turn = this.player_ids[0];
        this.finished = false;
    }

    async GenerateBoard(board) {
        board.reverse();
        const canvas = Canvas.createCanvas(1024, 1024);
        const ctx = canvas.getContext("2d");
        const empty_board = await Canvas.loadImage(
            "./storage/chess/board_with_text.jpg"
        );
        ctx.drawImage(empty_board, 0, 0, canvas.width, canvas.height);
        for (let j = 0; j < 8; j++) {
            for (let k = 0; k < 8; k++) {
                let piece = board[j][k];
                if (piece.type !== null) {
                    let piece_image = await Canvas.loadImage(
                        `./storage/chess/svg/${piece.color.name}_${piece.type}.svg`
                    );
                    ctx.drawImage(
                        piece_image,
                        (k * canvas.width) / 8,
                        (j * canvas.width) / 8,
                        canvas.width / 8,
                        canvas.width / 8
                    );
                }
            }
        }
        const img = new Discord.MessageAttachment(
            canvas.toBuffer(),
            "board.jpg"
        );
        return img;
    }
    PrepareBoard() {
        let squares = this.GetGameStatus().board.squares;
        let simple_board = [];
        let ready_board = [];
        squares.forEach((square) => {
            simple_board.push({
                type: square.piece ? square.piece.type : null,
                color: square.piece ? square.piece.side : null,
            });
        });
        for (let i = 0; i < 64; i += 8) {
            let row = simple_board.slice(i, i + 8);
            ready_board.push(row);
        }
        return ready_board;
    }
    ValidateMove(move) {
        let status = this.GetGameStatus();
        let prepd_n_moves = Object.keys(status.notatedMoves);
        if (prepd_n_moves.includes(move)) {
            return true;
        } else {
            return false;
        }
    }
    Move(move) {
        let valid = this.ValidateMove(move);
        if (valid) {
            console.log("moved");
            this.gameClient.move(move);
            this.draw_vote = 0;
            if (this.GetGameStatus().isCheckMate) {
                this.finished = true;
                return 1;
            }
            if (this.GetGameStatus().isStalemate) {
                this.finished = true;
                return 0;
            }
            if (this.GetGameStatus().isRepetition) {
                this.finished = true;
                return -1;
            }
            this.ChangeTurn();
            return true;
        } else {
            return false;
        }
    }
    GetGameStatus() {
        return this.gameClient.getStatus();
    }
    ChangeTurn() {
        if (this.turn === this.player_ids[0]) {
            this.turn = this.player_ids[1];
        } else {
            this.turn = this.player_ids[0];
        }
    }
    OfferDraw() {
        if (this.draw_vote === 0) {
            this.draw_vote++;
            this.ChangeTurn();
        } else if (this.draw_vote === 1) {
            this.finished = true;
        } else {
            return;
        }
    }
    Resign() {
        this.finished = true;
        this.ChangeTurn();
    }
}

module.exports = {
    name: "chess",
    description: "",
    cooldown: 1,
    aliases: ["chess-game"],
    async execute(message, args) {
        if (!message.mentions.members.first()) {
            return SendErrorMessage(
                message,
                "You need to @ the player you want to play with."
            );
        }
        if (message.mentions.members.first().user.bot) {
            return SendErrorMessage(message, "You can't play with a bot :(");
        }
        let other_player_id = message.mentions.members.first().id;
        let game = new ChessGame(message.author.id, other_player_id);
        const sent_board = await message.channel.send(
            await game.GenerateBoard(game.PrepareBoard())
        );
        const filter = (m) =>
            (m.content.includes("move") ||
                m.content.includes("draw") ||
                m.content.includes("resign")) &&
            m.author.id === game.turn &&
            game.finished !== true;

        const messageCollector = sent_board.channel.createMessageCollector(
            filter,
            { time: time_limit }
        );
        messageCollector.on("collect", async (msg) => {
            const move_args = msg.content.trim().split(" ");
            if (move_args[0] === "" || !move_args[0]) {
                return message.channel.send("You didn't give a command!");
            }
            if (move_args[0].toLowerCase() === "move") {
                if (move_args[1] === "" || !move_args[1]) {
                    return message.channel.send("You didn't give a move!");
                }
                const success_elem = game.Move(move_args[1]);
                if (success_elem) {
                    console.log("generate new board");
                    message.channel.send(
                        await game.GenerateBoard(game.PrepareBoard())
                    );

                    if (success_elem === 1) {
                        message.channel.send(
                            `Checkmate! <@${game.turn}> has won.`
                        );
                    }
                    if (success_elem === 0) {
                        message.channel.send("Draw by stalemate.");
                    }
                    if (success_elem === -1) {
                        message.channel.send("Draw by repetition.");
                    }
                    return;
                } else {
                    return message.channel.send(
                        `${move_args[1]} is an invalid move. Try again.`
                    );
                }
            } else if (move_args[0].toLowerCase() === "draw") {
                if (game.draw_vote === 0) {
                    game.OfferDraw();
                    return message.channel.send(
                        `<@${game.turn}> to accept the draw offer, use draw again. If you want to reject, use no-draw`
                    );
                }
                if (game.draw_vote === 1) {
                    game.OfferDraw();
                    return message.channel.send("Game ended in a draw.");
                }
            } else if (move_args[0].toLowerCase() === "resign") {
                game.Resign();
                message.channel.send(`<@${game.turn}> has won.`);
            } else if (
                move_args[0].toLowerCase() === "no-draw" &&
                game.draw_vote === 1
            ) {
                game.ChangeTurn();
                return message.channel.send(
                    `Draw offer rejected! It's your turn again <@${game.turn}>`
                );
            } else {
                message.channel.send(
                    "Didn't get move, draw, no-draw or resign."
                );
            }
        });
        messageCollector.on("end", (collected) => {
            message.channel.send("Time limit exceeded. Game aborted.");
        });
    },
};
