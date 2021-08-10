// Dependencies & variables

const Discord = require("discord.js");
const sleep = require("../../utils/sleep");

// Dependencies & variables end

// Error Message Template

const SendErrorMessage = require("../../utils/SendErrorMessage");

// Error Message Template

function prepare_coords(coords) {
    let prepd_coords = [];
    for (let coord of coords) {
        let coord_split = coord.split(",");
        let x = parseInt(coord_split[0]);
        let y = parseInt(coord_split[1]);

        if (x > 78) {
            x = 78;
        }
        if (x < 0) {
            x = 0;
        }
        if (y > 24) {
            y = 24;
        }
        if (y < 0) {
            y = 0;
        }
        prepd_coords.push({
            x: x,
            y: y,
        });
    }
    return prepd_coords;
}

class GameOfLife {
    constructor(first_position) {
        this.steps = 0;
        this.first_position = first_position;
        this.current_position = [];
    }
    generate_board() {
        let generated = [];
        for (let j = 0; j < 25; j++) {
            let row = [];
            for (let k = 0; k < 79; k++) {
                row.push({
                    state: "dead",
                    neighbours: [],
                    x: k,
                    y: j,
                });
            }
            generated.push(row);
        }
        this.first_position.forEach((cell) => {
            generated[cell.y][cell.x].state = "live";
        });
        this.current_position = generated;
    }

    init() {
        this.generate_board();
        this.set_neighbours();
    }

    is_border(cell) {
        let result = "no";
        switch (cell.x) {
            case 0:
                result = "l";
                break;
            case 78:
                result = "r";
                break;
            default:
                result = "no";
                break;
        }
        if (result !== "no") return result;
        switch (cell.y) {
            case 0:
                result = "t";
                break;
            case 24:
                result = "b";
                break;
            default:
                result = "no";
                break;
        }
        return result;
    }

    is_corner(cell) {
        let result = "no";
        if (cell.x == 0 && cell.y == 0) {
            result = "tl";
        } else if (cell.x == 78 && cell.y == 0) {
            result = "tr";
        } else if (cell.x == 0 && cell.y == 24) {
            result = "bl";
        } else if (cell.x == 78 && cell.y == 24) {
            result = "br";
        }
        return result;
    }

    get_neighbours(cell) {
        let is_corner_result = this.is_corner(cell);
        let is_border_result = this.is_border(cell);
        let neighbours = [];
        if (is_corner_result !== "no") {
            switch (is_corner_result) {
                case "tl":
                    neighbours.push(this.current_position[0][1]);
                    neighbours.push(this.current_position[1][1]);
                    neighbours.push(this.current_position[1][0]);
                    break;
                case "tr":
                    neighbours.push(this.current_position[0][77]);
                    neighbours.push(this.current_position[1][77]);
                    neighbours.push(this.current_position[1][78]);
                    break;
                case "bl":
                    neighbours.push(this.current_position[24][1]);
                    neighbours.push(this.current_position[23][1]);
                    neighbours.push(this.current_position[23][0]);
                    break;
                case "br":
                    neighbours.push(this.current_position[24][77]);
                    neighbours.push(this.current_position[23][77]);
                    neighbours.push(this.current_position[23][78]);
                    break;
            }
        } else if (is_border_result !== "no") {
            switch (is_border_result) {
                case "l":
                    neighbours.push(this.current_position[cell.y - 1][cell.x]);
                    neighbours.push(
                        this.current_position[cell.y - 1][cell.x + 1]
                    );
                    neighbours.push(this.current_position[cell.y][cell.x + 1]);
                    neighbours.push(
                        this.current_position[cell.y + 1][cell.x + 1]
                    );
                    neighbours.push(this.current_position[cell.y + 1][cell.x]);
                    break;
                case "r":
                    neighbours.push(this.current_position[cell.y - 1][cell.x]);
                    neighbours.push(
                        this.current_position[cell.y - 1][cell.x - 1]
                    );
                    neighbours.push(this.current_position[cell.y][cell.x - 1]);
                    neighbours.push(
                        this.current_position[cell.y + 1][cell.x - 1]
                    );
                    neighbours.push(this.current_position[cell.y + 1][cell.x]);
                    break;
                case "t":
                    neighbours.push(this.current_position[cell.y][cell.x - 1]);
                    neighbours.push(
                        this.current_position[cell.y + 1][cell.x - 1]
                    );
                    neighbours.push(this.current_position[cell.y + 1][cell.x]);
                    neighbours.push(
                        this.current_position[cell.y + 1][cell.x + 1]
                    );
                    neighbours.push(this.current_position[cell.y][cell.x + 1]);
                    break;
                case "b":
                    neighbours.push(this.current_position[cell.y][cell.x - 1]);
                    neighbours.push(
                        this.current_position[cell.y - 1][cell.x - 1]
                    );
                    neighbours.push(this.current_position[cell.y - 1][cell.x]);
                    neighbours.push(
                        this.current_position[cell.y - 1][cell.x + 1]
                    );
                    neighbours.push(this.current_position[cell.y][cell.x + 1]);
                    break;
            }
        } else {
            neighbours.push(this.current_position[cell.y + 1][cell.x]);
            neighbours.push(this.current_position[cell.y - 1][cell.x]);
            neighbours.push(this.current_position[cell.y][cell.x + 1]);
            neighbours.push(this.current_position[cell.y][cell.x - 1]);
            neighbours.push(this.current_position[cell.y + 1][cell.x + 1]);
            neighbours.push(this.current_position[cell.y + 1][cell.x - 1]);
            neighbours.push(this.current_position[cell.y - 1][cell.x + 1]);
            neighbours.push(this.current_position[cell.y - 1][cell.x - 1]);
            // neighbours.push(this.current_position[cell.y + 1][cell.x]);
            // neighbours.push(this.current_position[cell.y + 1][cell.x + 1]);
            // neighbours.push(this.current_position[cell.y + 1][cell.x - 1]);
            // neighbours.push(this.current_position[cell.y][cell.x + 1]);
            // neighbours.push(this.current_position[cell.y][cell.x - 1]);
            // neighbours.push(this.current_position[cell.y - 1][cell.x + 1]);
            // neighbours.push(this.current_position[cell.y - 1][cell.x - 1]);
            // neighbours.push(this.current_position[cell.y - 1][cell.x]);
        }
        return neighbours;
    }

    set_neighbours() {
        this.current_position.forEach((row) => {
            row.forEach((cell) => {
                cell.neighbours = this.get_neighbours(cell);
            });
        });
    }

    get_live_neighbours(cell) {
        let live_neighbours_count = 0;
        this.get_neighbours(cell).forEach((neighbour) => {
            if (neighbour.state === "live") {
                ++live_neighbours_count;
            }
        });
        return live_neighbours_count;
    }

    /*
    At each step in time, the following transitions occur:
        1.Any live cell with fewer than two live neighbours dies, as if by underpopulation.
        2.Any live cell with two or three live neighbours lives on to the next generation.
        3.Any live cell with more than three live neighbours dies, as if by overpopulation.
        4.Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    
    These rules, which compare the behavior of the automaton to real life, can be condensed into the following:
        1.Any live cell with two or three live neighbours survives.
        2.Any dead cell with three live neighbours becomes a live cell.
        3.All other live cells die in the next generation. Similarly, all other dead cells stay dead.
    
    - Wikipedia (https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Rules)
    */

    advance() {
        let new_pos = [];
        this.current_position.forEach((row) => {
            let new_row = [];
            row.forEach((cell) => {
                let live_neighbours = this.get_live_neighbours(cell);
                if (cell.state === "live") {
                    if (live_neighbours === 2 || live_neighbours === 3) {
                        new_row.push(cell);
                    } else {
                        let new_cell = {
                            state: "dead",
                            neighbours: cell.neighbours,
                            x: cell.x,
                            y: cell.y,
                        };
                        new_row.push(new_cell);
                    }
                } else {
                    live_neighbours === 3
                        ? new_row.push({
                              state: "live",
                              neighbours: cell.neighbours,
                              x: cell.x,
                              y: cell.y,
                          })
                        : new_row.push(cell);
                }
            });
            new_pos.push(new_row);
        });
        this.current_position = new_pos;
    }

    check_game_over() {
        let live_cells = 0;
        this.current_position.forEach((row) => {
            row.forEach((cell) => {
                if (cell.state === "live") {
                    ++live_cells;
                }
            });
        });
        return live_cells === 0;
    }

    visualize(position) {
        let visual = "";
        position.forEach((row) => {
            row.forEach((cell) => {
                visual += cell.state == "live" ? "❑" : "X";
            });
            visual += "\n";
        });
        return visual;
    }
}

module.exports = {
    name: "gameoflife",
    description: "Convay's Game of Life, but scuffed and in Discord.",
    category: "Game",
    usage: "gameoflife (starting positions split with | )",
    cooldown: 1,
    aliases: ["Convay"],
    async execute(client, message, args) {
        if (!args[0] || args[0] == "") {
            return SendErrorMessage(
                message,
                "You need to give at least one coordinate to populate."
            );
        }
        let prepd = prepare_coords(args.join(" ").split(" | "));
        console.log(prepd);
        let game = new GameOfLife(prepd);
        game.init();
        let sent_game = await message.channel.send(
            game.visualize(game.current_position)
        );
        for (let i = 0; i < 60; i++) {
            if (game.check_game_over()) {
                message.reply("Game over!");
                return sent_game.edit(game.visualize(game.current_position));
            }
            await sleep(1500);
            game.advance();
            sent_game.edit(game.visualize(game.current_position));
        }
    },
};
