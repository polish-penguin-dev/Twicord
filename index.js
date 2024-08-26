/*
    TwiCord (Twilight Discord)
    The Easiest Way To Create Modern Discord Bots

    Made By Penguins184
*/

import path from "path";
import fs from "fs";
import { InteractionTypes } from "oceanic.js";

export class Twi {
    constructor(client) {
        this.client = client;
        this.slashcmds = new Map();
        this.analogcmds = new Map();
        this.componenthandlers = new Map();

        // Basic Setup
        client.connect();

        client.on("ready", () => {
            console.log(`Twicord: Ready as ${client.user.tag}`);
        });

        client.on("interactionCreate", (interaction) => {
            if (interaction.type === InteractionTypes.APPLICATION_COMMAND) {
                const command = this.slashcmds.get(interaction.data.name);
                command(interaction);
            } else if (interaction.type === InteractionTypes.MESSAGE_COMPONENT) {
                const handler = this.componenthandlers.get(interaction.data.customID);
                handler(interaction);
            }
        });

        client.on("messageCreate", (message) => {
            const command = this.analogcmds.get(message.content.split(" ")[0]);
            if (command) command(message);
        });
    }

    cmdhandler(dir) {
        this.client.on("ready", () => {
            const files = fs.readdirSync(dir).filter(file => file.endsWith(".js"));
            console.log(`Twicord: Loading commands - ${files.join(", ")}`);
        
            for (const file of files) {
                import(path.resolve(dir, file));
            }
        });
    }

    analogcmd(opts = {}) {
        this.analogcmds.set(opts.name, opts.run);
    }

    async slashcmd(opts = {}) {
        const { run, ...options } = opts;
        this.slashcmds.set(opts.name, opts.run);

        await this.client.application.createGlobalCommand(options);
    }

    handlecomponents(opts = {}) {
        this.componenthandlers.set(opts.customid, opts.run);
    }

    message(id, content) {
        this.client.rest.channels.createMessage(id, content);
    }
};
