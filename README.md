# TwiCord

An extremely simple oceanic.js wrapper that makes it easy to create analog and slash commands! 🌈

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