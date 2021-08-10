// Dependencies & variables

const Discord = require("discord.js");
const light_opens = [
    "<:light_empty:839847118776172625>",
    "<:light_1:839847118847737906>",
    "<:light_2:839847118436171848>",
    "<:light_3:839847118805401620>",
    "<:light_4:839847118835154985>",
    "<:light_5:839847118922973184>",
    "<:light_6:839847118604730379>",
    "<:light_7:839847118789410867>",
    "<:light_8:839847118948401152>",
];
const dark_opens = [
    "<:dark_empty:839847118679834645>",
    "<:dark_1:839847118772502558>",
    "<:dark_2:839847118835548196>",
    "<:dark_3:839847118558330881>",
    "<:dark_4:839847118679572481>",
    "<:dark_5:839847118898331648>",
    "<:dark_6:839847118776696872>",
    "<:dark_7:839847118553219090>",
    "<:dark_8:839847118445215785>",
];
const dark_closed = "<:dark_green:839847118750744599>";
const light_closed = "<:light_green:839847119430090792>";
const light_flag = "<:light_green_flag:839851098017234995>";
const dark_flag = "<:dark_green_flag:839851098059571230>";
const dark_mine = "<:dark_mine:839940484998627429>";
const light_mine = "<:light_mine:839940485523308564>";
const col_numbers7 = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"];
const col_numbers5 = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];
const time_limit = 13 * 60 * 1000;

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

class minesweeper {
    constructor(difficulty) {
        this.difficulty = difficulty;
        this.rows = difficulty === "hard" ? 7 : 5;
        this.columns = this.rows;
        this.start_time = new Date().getTime();
        this.moves = 0;
        this.state = {
            squares: [],
            bombs: {
                amount: difficulty === "hard" ? 15 : 7,
                where: [],
            },
            dead: false,
        };
        this.init();
    }

    visualize() {
        const squares = this.state.squares;
        let board_string = "";
        let dark_next = false;
        const row_numbers =
            this.difficulty === "hard" ? col_numbers7 : col_numbers5;
        const col_numbers =
            this.difficulty === "hard" ? col_numbers7 : col_numbers5;
        for (let j in squares) {
            board_string += row_numbers[j];
            for (let k in squares[j]) {
                let square = squares[j][k];
                if (square.isBomb && this.state.dead) {
                    squares[j][k].text = dark_next ? dark_mine : light_mine;
                    board_string += squares[j][k].text;
                    dark_next = !dark_next;
                } else if (!square.isOpen && !square.isFlagged) {
                    squares[j][k].text = dark_next ? dark_closed : light_closed;
                    board_string += squares[j][k].text;
                    dark_next = !dark_next;
                } else if (!square.isOpen && square.isFlagged) {
                    squares[j][k].text = dark_next ? dark_flag : light_flag;
                    board_string += squares[j][k].text;
                    dark_next = !dark_next;
                } else if (square.isOpen) {
                    switch (square.value) {
                        case null:
                            squares[j][k].text = dark_next
                                ? dark_opens[0]
                                : light_opens[0];
                            board_string += squares[j][k].text;
                            dark_next = !dark_next;
                            break;
                        case 0:
                            squares[j][k].text = dark_next
                                ? dark_opens[square.value]
                                : light_opens[square.value];
                            board_string += squares[j][k].text;
                            dark_next = !dark_next;
                            break;
                        case 1:
                            squares[j][k].text = dark_next
                                ? dark_opens[square.value]
                                : light_opens[square.value];
                            board_string += squares[j][k].text;
                            dark_next = !dark_next;
                            break;
                        case 2:
                            squares[j][k].text = dark_next
                                ? dark_opens[square.value]
                                : light_opens[square.value];
                            board_string += squares[j][k].text;
                            dark_next = !dark_next;
                            break;
                        case 3:
                            squares[j][k].text = dark_next
                                ? dark_opens[square.value]
                                : light_opens[square.value];
                            board_string += squares[j][k].text;
                            dark_next = !dark_next;
                            break;
                        case 4:
                            squares[j][k].text = dark_next
                                ? dark_opens[square.value]
                                : light_opens[square.value];
                            board_string += squares[j][k].text;
                            dark_next = !dark_next;
                            break;
                        case 5:
                            squares[j][k].text = dark_next
                                ? dark_opens[square.value]
                                : light_opens[square.value];
                            board_string += squares[j][k].text;
                            dark_next = !dark_next;
                            break;
                        case 6:
                            squares[j][k].text = dark_next
                                ? dark_opens[square.value]
                                : light_opens[square.value];
                            board_string += squares[j][k].text;
                            dark_next = !dark_next;
                            break;
                        case 7:
                            squares[j][k].text = dark_next
                                ? dark_opens[square.value]
                                : light_opens[square.value];
                            board_string += squares[j][k].text;
                            dark_next = !dark_next;
                            break;
                        case 8:
                            squares[j][k].text = dark_next
                                ? dark_opens[square.value]
                                : light_opens[square.value];
                            board_string += squares[j][k].text;
                            dark_next = !dark_next;
                            break;
                    }
                }
            }
            board_string += "\n";
        }
        board_string += `:black_large_square:${col_numbers.join("")}`;
        const visual = {
            title: "Mine😳sweeper",
            description: board_string,
            footer: {
                text: `Type a move like row,column,flag`,
            },
        };
        return visual;
    }

    init() {
        let _squares = this.state.squares;
        for (let j = 0; j < this.rows; j++) {
            let row = [];
            for (let k = 0; k < this.columns; k++) {
                row.push({
                    text: "",
                    value: 0,
                    isOpen: false,
                    isFlagged: false,
                    isBomb: false,
                    row: j,
                    col: k,
                });
            }
            _squares.push(row);
        }
        this.state.squares = _squares;
    }

    generateBombs(board_row, board_col) {
        const squares = this.state.squares;
        const adj = this.getAdjacent(board_row, board_col);
        let adj_coord = [];
        adj.forEach((sqr) => {
            adj_coord.push([sqr.row, sqr.col]);
        });
        for (let i = 0; i < this.state.bombs.amount; i++) {
            let found = false;
            while (!found) {
                let rand_1 = Math.floor(Math.random() * squares.length);
                let rand_2 = Math.floor(Math.random() * squares.length);
                if (
                    squares[rand_1][rand_2].isBomb === false &&
                    squares[rand_1][rand_2].isOpen === false &&
                    !adj_coord.some((elem) => elem === [rand_1, rand_2])
                ) {
                    this.state.bombs.where.push([rand_1, rand_2]);
                    squares[rand_1][rand_2].isBomb = true;
                    found = true;
                    console.log("found");
                }
            }
        }
        const bomb_places = this.state.bombs.where;
        bomb_places.forEach((bomb) => {
            //t-left
            if (bomb[0] - 1 >= 0 && bomb[1] - 1 >= 0) {
                squares[bomb[0] - 1][bomb[1] - 1].value++;
            }
            //top
            if (bomb[0] - 1 >= 0) {
                squares[bomb[0] - 1][bomb[1]].value++;
            }
            //t-right
            if (bomb[0] - 1 >= 0 && bomb[1] + 1 < squares.length) {
                squares[bomb[0] - 1][bomb[1] + 1].value++;
            }
            //right
            if (bomb[1] + 1 < squares.length) {
                squares[bomb[0]][bomb[1] + 1].value++;
            }
            //b-right
            if (bomb[0] + 1 < squares.length && bomb[1] + 1 < squares.length) {
                squares[bomb[0] + 1][bomb[1] + 1].value++;
            }
            //bottom
            if (bomb[0] + 1 < squares.length) {
                squares[bomb[0] + 1][bomb[1]].value++;
            }
            //b-left
            if (bomb[1] - 1 >= 0 && bomb[0] + 1 < squares.length) {
                squares[bomb[0] + 1][bomb[1] - 1].value++;
            }
            //left
            if (bomb[1] - 1 >= 0) {
                squares[bomb[0]][bomb[1] - 1].value++;
            }
        });
        this.state.squares = squares;
    }
    flag(row, col) {
        const squares = this.state.squares;
        const board_row = row - 1;
        const board_col = col - 1;
        const square = squares[board_row][board_col];
        if (
            board_row > this.rows ||
            board_row < 0 ||
            board_col > this.columns ||
            board_col < 0
        ) {
            return;
        }
        if (!square.isOpen)
            this.state.squares[board_row][board_col].isFlagged =
                !this.state.squares[board_row][board_col].isFlagged;
    }
    move(row, col, message) {
        const squares = this.state.squares;
        const board_row = row - 1;
        const board_col = col - 1;
        if (
            board_row > this.rows ||
            board_row < 0 ||
            board_col > this.columns ||
            board_col < 0
        ) {
            return;
        }

        let chosen_one = squares[board_row][board_col];
        if (this.moves === 0) {
            console.log("first move");
            this.state.squares[board_row][board_col].isOpen = true;
            this.generateBombs(board_row, board_col);
            this.openEmpty(board_row, board_col);
        }
        this.moves++;
        if (chosen_one.isBomb) {
            this.state.dead = true;
            const now = new Date().getTime();
            const death_embed = {
                title: "You died :(",
                fields: [
                    {
                        name: "Time",
                        value: `${(now - this.start_time) / 1000} seconds`,
                        inline: true,
                    },
                    {
                        name: "Score",
                        value: this.moves.toString(),
                    },
                ],
            };
            return message.channel.send({ embeds: [death_embed] });
        }
        if (chosen_one.isOpen) {
            return;
        }
        if (chosen_one.isFlagged) {
            return;
        }
        if (chosen_one.value === 0) {
            this.openEmpty(board_row, board_col);
        }
        this.state.squares[board_row][board_col].isOpen = true;
    }
    openEmpty(board_row, board_col) {
        const adj = this.getAdjacent([board_row, board_col]);
        adj.forEach((sqr) => {
            if (!sqr.isOpen && !sqr.isBomb && !sqr.isFlagged) {
                sqr.isOpen = true;
                sqr.value === 0 ? this.openEmpty(sqr.row, sqr.col) : null;
            }
        });
    }
    getAdjacent(sqr) {
        const squares = this.state.squares;
        let adjacents = [];
        //t-left
        if (sqr[0] - 1 >= 0 && sqr[1] - 1 >= 0) {
            adjacents.push(squares[sqr[0] - 1][sqr[1] - 1]);
        }
        //top
        if (sqr[0] - 1 >= 0) {
            adjacents.push(squares[sqr[0] - 1][sqr[1]]);
        }
        //t-right
        if (sqr[0] - 1 >= 0 && sqr[1] + 1 < squares.length) {
            adjacents.push(squares[sqr[0] - 1][sqr[1] + 1]);
        }
        //right
        if (sqr[1] + 1 < squares.length) {
            adjacents.push(squares[sqr[0]][sqr[1] + 1]);
        }
        //b-right
        if (sqr[0] + 1 < squares.length && sqr[1] + 1 < squares.length) {
            adjacents.push(squares[sqr[0] + 1][sqr[1] + 1]);
        }
        //bottom
        if (sqr[0] + 1 < squares.length) {
            adjacents.push(squares[sqr[0] + 1][sqr[1]]);
        }
        //b-left
        if (sqr[1] - 1 >= 0 && sqr[0] + 1 < squares.length) {
            adjacents.push(squares[sqr[0] + 1][sqr[1] - 1]);
        }
        //left
        if (sqr[1] - 1 >= 0) {
            adjacents.push(squares[sqr[0]][sqr[1] - 1]);
        }
        return adjacents;
    }
}

module.exports = {
    name: "minesweeper",
    description: "Play a game of minesweeper.",
    options: [
        {
            name: "Difficulty",
            type: "STRING",
            description: "Minesweeper difficulty",
            required: false,
            choices: [
                {
                    name: "Normal",
                    value: "normal",
                },
                {
                    name: "Hard",
                    value: "hard",
                },
            ],
        },
    ],
    category: "Game",
    usage: "minesweeper (optional: hard)",
    cooldown: 1,
    aliases: ["ms"],
    async execute(client, message, args) {
        let diff = "normal";
        if (!args[0]) {
            diff = "normal";
        } else if (args[0].toLowerCase() === "hard") {
            diff = "hard";
        }
        let game = new minesweeper(diff);
        const update_board = async () => {
            await sent_board.edit({ embeds: [game.visualize()] });
        };
        const sent_board = await message.channel.send({
            embeds: [game.visualize()],
        });
        const filter = (m) =>
            m.content.includes(",") &&
            m.author.id === message.author.id &&
            !game.state.dead;
        const messageCollector = sent_board.channel.createMessageCollector({
            filter: filter,
            time: time_limit,
        });
        messageCollector.on("collect", (msg) => {
            const move_args = msg.content.trim().replace(" ", "").split(",");
            if (move_args.length < 2) return;
            if (game.state.dead) return;
            if (move_args.length === 2) {
                msg.delete();
                game.move(move_args[1], move_args[0], message);
            } else if (
                move_args.length === 3 &&
                move_args[2].toLowerCase() === "flag"
            ) {
                msg.delete();
                game.flag(move_args[1], move_args[0]);
            }
            update_board();
        });
        messageCollector.on("end", (collected) => {
            console.log("done");
        });
    },
};
