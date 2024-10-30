/*
    TwiCord (Twilight Discord)
    The Easiest Way To Create Modern Discord Bots

    Made By Penguins184
*/
import * as lists from "./lists/lists.js";

import path from "path";
import fs from "fs";
import url from "url";
import { InteractionTypes } from "oceanic.js";

export class Twi {
    constructor(client) {
        if(!client) return console.log(`Twicord: No client provided`);

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
                import(url.pathToFileURL(path.resolve(dir, file)).href);
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

    color(string) {
        if(!lists.colors.hasOwnProperty(string)) return console.log(`Twicord: Invalid color specified`);
        
        return parseInt(lists.colors[string], 16);
    } 

    optiontype(string) {
        if(!lists.optiontypes.hasOwnProperty(string)) return console.log(`Twicord: Invalid optiontype specified`);
        
        return lists.optiontypes[string];
    } 

    componenttype(string) {
        if(!lists.componenttypes.hasOwnProperty(string)) return console.log(`Twicord: Invalid componenttype specified`);
        
        return lists.componenttypes[string];
    } 

    embed() {
        return new Embed();
    }
};

class Embed {
    constructor() {
        this.embed = {
            title: null,
            description: null,
            color: null,
            image: {
                url: null
            },
            footer: {
                text: null
            }
        };
    }

    title(text) {
        this.embed.title = text;
        return this;
    }

    description(text) {
        this.embed.description = text;
        return this;
    }

    color(value) {
        this.embed.color = value;
        return this;
    }

    image(url) {
        this.embed.image.url = url;
        return this;
    }

    footer(text) {
        this.embed.footer.text = text;
        return this;
    }

    build() {
        return this.embed;
    }
}
