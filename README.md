# TwiCord

- An Extremely Simple Oceanic.js Wrapper That Makes It Easy To Create Analog And Slash Commands! 🌈
- NOT Actively Maintained! Last Edited On Wed, Oct 30 2024.
- Uses EXPERIMENTAL IMPORTS. Run `[node/bun/deno] --no-warnings .` To Fix!
- Bun Runtime Is Recommended.

Features:

- Slash Commands
- Analog Commands
- Component Handlers
- Command Handler
- Easy Colors/OptionTypes (Lists)
- Embed Builder

index.js:

```js
import { Client } from "oceanic.js";
import { Twi } from "twicord.js";

const client = new Client({ auth: `Bot ${process.env.token}`, gateway: { intents: [...] } });
const twi = new Twi(client);

twi.cmdhandler("./cmds");
export { twi };
```

cmds/ping.js:

```js
import { twi } from "../index.js";

twi.slashcmd({
    name: "ping",
    description: "Pong!",
    run: async function(interaction) {
        interaction.createMessage({ content: "Pong!" });
    }
});

twi.analogcmd({
    name: "!ping",
    run: function(message) {
        //twi.message() = client.rest.channels.createMessage()
        twi.message(message.channel.id, { content: "Pong!" });
    }
});
```

showcase:

```js
import { twi } from "../index.js";

//Slash Command
twi.slashcmd({
    name: "cuckoo",
    description: "Repeats!",
    options: [
        {
            type: twi.optiontype("string"),
            name: "message",
            description: "Message To Repeat",
            required: true
        }
    ],
    run: async function(interaction) {
        const msg = interaction.data.options.getString("message");

        //Embed Builder
        const response = twi.embed()
        .title("Repeat")
        .description(msg)
        .color(twi.color("blurple")) //twi.x(...) Lists
        .build();

        //Components
        interaction.createMessage({ 
            embeds: [response],
            components: [
                {
                    type: twi.componenttype("actionrow"),
                    components: [
                        {
                            type: twi.componenttype("button"),
                            style: 1,
                            customID: "info",
                            label: "Information"
                        }
                    ]
                }
            ]
        });
    }
});

//Handle Components
twi.handlecomponents({
    customid: "info",
    run: async function(interaction) {
        await interaction.createMessage({ content: "Made With Twicord.js + Oceanic.js" });
    }
});
```

NPM: https://npmjs.com/package/twicord.js,

JSR: https://jsr.io/@twicordjs/core