// Dependencies & variables

const Discord = require("discord.js");
const emojiList = ["⬅️", "⬇️", "⬆️", "➡️"];
const timeout = 60 * 1000;
// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

module.exports = {
    name: "snake",
    description: "Play a game of snake.",
    category: "Game",
    usage: "snake",
    cooldown: 1,
    aliases: ["snakegame"],
    async execute(client, message, args) {
        if (
            !message.guild.me.permissions.has(
                Discord.Permissions.FLAGS.MANAGE_MESSAGES
            )
        )
            return SendErrorMessage(
                message,
                "I need to have MANAGE_MESSAGES in order to run this command as it uses an embed with reactions and also deletes reactions!"
            );
        const boxes = {
            empty: ":white_large_square:",
            head: ":orange_square:",
            body: ":blue_square:",
            food: ":red_square:",
            border: ":black_large_square:",
        };
        let gameOver = false;
        class Player {
            constructor() {
                this.head = {
                    x: 1,
                    y: 5,
                };
                this.body = [];
                this.alive = true;
                this.score = 0;
                this.food = {
                    x: 4,
                    y: 5,
                };
                this.LoseMessage = {
                    title: "You Lost!",
                    fields: [
                        {
                            name: "Score:",
                            value: this.body.length + 1,
                            inline: true,
                        },
                    ],
                };
            }
            getScore() {
                let score = 0;
                for (let elem in this.body) {
                    score++;
                }
                return score;
            }
            createBody(board, direction) {
                let body_part = {
                    x: this.head.x,
                    y: this.head.y,
                };
                this.body.push(body_part);
                let new_y;
                let new_x;
                do {
                    new_x = Math.floor(Math.random() * 5) + 2;
                    new_y = Math.floor(Math.random() * 5) + 2;
                } while (board[new_y][new_x] != boxes.empty);
                if (board[new_y][new_x] == boxes.empty) {
                    this.food.x = Math.floor(Math.random() * 7) + 1;
                    this.food.y = Math.floor(Math.random() * 7) + 1;
                    this.score++;
                }
            }
            move(board, message, direction) {
                let old_x = this.head.x;
                let old_y = this.head.y;
                if (direction == "up") {
                    if (
                        board[this.head.y - 1][this.head.x] != boxes.empty &&
                        board[this.head.y - 1][this.head.x] != boxes.food
                    ) {
                        this.alive = false;
                    }
                    if (board[this.head.y - 1][this.head.x] == boxes.food) {
                        this.createBody(board, direction);
                    }
                    board[this.head.y][this.head.x] = boxes.empty;
                    this.head.y -= 1;
                    board[this.head.y][this.head.x] = boxes.head;
                } else if (direction == "down") {
                    if (
                        board[this.head.y + 1][this.head.x] != boxes.empty &&
                        board[this.head.y + 1][this.head.x] != boxes.food
                    ) {
                        this.alive = false;
                    }
                    if (board[this.head.y + 1][this.head.x] == boxes.food) {
                        this.createBody(board, direction);
                    }
                    board[this.head.y][this.head.x] = boxes.empty;
                    this.head.y += 1;
                    board[this.head.y][this.head.x] = boxes.head;
                } else if (direction == "right") {
                    if (
                        board[this.head.y][this.head.x + 1] != boxes.empty &&
                        board[this.head.y][this.head.x + 1] != boxes.food
                    ) {
                        this.alive = false;
                    }
                    if (board[this.head.y][this.head.x + 1] == boxes.food) {
                        this.createBody(board, direction);
                    }
                    board[this.head.y][this.head.x] = boxes.empty;
                    this.head.x += 1;
                    board[this.head.y][this.head.x] = boxes.head;
                } else if (direction == "left") {
                    if (
                        board[this.head.y][this.head.x - 1] != boxes.empty &&
                        board[this.head.y][this.head.x - 1] != boxes.food
                    ) {
                        this.alive = false;
                    }
                    if (board[this.head.y][this.head.x - 1] == boxes.food) {
                        this.createBody(board, direction);
                    }
                    board[this.head.y][this.head.x] = boxes.empty;
                    this.head.x -= 1;
                    board[this.head.y][this.head.x] = boxes.head;
                }

                if (this.body != []) {
                    for (let part of this.body) {
                        let future_x = old_x;
                        old_x = part.x;
                        let future_y = old_y;
                        old_y = part.y;
                        board[part.y][part.x] = boxes.empty;
                        part.x = future_x;
                        part.y = future_y;
                        board[part.y][part.x] = boxes.body;
                    }
                    this.getScore();
                }
            }
        }
        let player = new Player();

        let board = [];

        for (j = 0; j < 10; j++) {
            let row = [];
            for (k = 0; k < 10; k++) {
                if (j == 0 || j == 9) {
                    row.push(boxes.border);
                } else if (k == 0 || k == 9) {
                    row.push(boxes.border);
                } else {
                    row.push(boxes.empty);
                }
            }
            board.push(row);
        }
        board[player.head.y][player.head.x] = boxes.head;
        board[player.food.y][player.food.x] = boxes.food;
        let board_str = "";
        for (y in board) {
            let line = "";
            for (x in board) {
                line += board[y][x];
            }
            line += "\n";
            board_str += line;
        }
        let boardEmbed = {
            title: `Current Board\n${boxes.head} -> Head\n${boxes.body} -> Body\n${boxes.food} -> Food\n${boxes.border} -> Wall`,
            description: board_str,
        };
        async function update_board(new_board) {
            new_board[player.head.y][player.head.x] = boxes.head;
            new_board[player.food.y][player.food.x] = boxes.food;
            let new_board_str = "";
            for (y in new_board) {
                let line = "";
                for (x in new_board) {
                    line += new_board[y][x];
                }
                line += "\n";
                new_board_str += line;
            }
            let new_boardEmbed = {
                title: "Current Board",
                description: new_board_str,
            };
            await sent_board.edit({ embeds: [new_boardEmbed] });
        }
        let sent_board = await message.channel.send({ embeds: [boardEmbed] });
        await sent_board.react("⬅️");
        await sent_board.react("⬇️");
        await sent_board.react("⬆️");
        await sent_board.react("➡️");
        const filter = (reaction, user) =>
            emojiList.includes(reaction.emoji.name) &&
            !user.bot &&
            user.id == message.author.id;
        const reactionCollector = sent_board.createReactionCollector({
            filter: filter,
            time: timeout,
        });
        reactionCollector.on("collect", async (reaction) => {
            if (gameOver) {
                return;
            }
            reaction.users.remove(message.author);
            switch (reaction.emoji.name) {
                case emojiList[0]:
                    player.move(board, message, "left");
                    if (player.alive) {
                        update_board(board);
                    } else {
                        message.channel.send({
                            embeds: [
                                {
                                    title: "You lost!",
                                    fields: [
                                        {
                                            name: "Score:",
                                            value:
                                                player.getScore().toString() ||
                                                "0",
                                            inline: true,
                                        },
                                    ],
                                },
                            ],
                        });
                        gameOver = true;
                        return;
                    }
                    break;
                case emojiList[1]:
                    player.move(board, message, "down");
                    if (player.alive) {
                        update_board(board);
                    } else {
                        message.channel.send({
                            embeds: [
                                {
                                    title: "You lost!",
                                    fields: [
                                        {
                                            name: "Score:",
                                            value:
                                                player.getScore().toString() ||
                                                "0",
                                            inline: true,
                                        },
                                    ],
                                },
                            ],
                        });
                        gameOver = true;
                        return;
                    }
                    break;
                case emojiList[2]:
                    player.move(board, message, "up");
                    if (player.alive) {
                        update_board(board);
                    } else {
                        message.channel.send({
                            embeds: [
                                {
                                    title: "You lost!",
                                    fields: [
                                        {
                                            name: "Score:",
                                            value:
                                                player.getScore().toString() ||
                                                "0",
                                            inline: true,
                                        },
                                    ],
                                },
                            ],
                        });
                        gameOver = true;
                        return;
                    }
                    break;
                case emojiList[3]:
                    player.move(board, message, "right");
                    if (player.alive) {
                        update_board(board);
                    } else {
                        message.channel.send({
                            embeds: [
                                {
                                    title: "You lost!",
                                    fields: [
                                        {
                                            name: "Score:",
                                            value:
                                                player.getScore().toString() ||
                                                "0",
                                            inline: true,
                                        },
                                    ],
                                },
                            ],
                        });
                        gameOver = true;
                        return;
                    }
                    break;
                default:
                    break;
            }
        });
        reactionCollector.on("end", () => {
            sent_board.reactions.removeAll();
        });
    },
};
