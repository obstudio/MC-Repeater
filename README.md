# MC-Repeater

<p align="center"><img src="https://user-images.githubusercontent.com/20534082/69478424-119c6200-0e2d-11ea-979b-cafd2d1daf49.png"/></p>

A chat relay between Minecraft server and IRC with no mods.

## Features

+ No mods needed
+ Support Java and Bedrock servers, vanilla and modded servers
+ Can be run on Windows, Linux and macOS

### Minecraft server support

Java Edition:
+ [Vanilla Server](https://www.minecraft.net/download/server)
+ [Paper](https://papermc.io/)

Bedrock Edition:
+ [Bedrock Dedicated Server](https://www.minecraft.net/download/server/bedrock) (Only server start up / shutdown and player join / leave messages)

### Chat bot support

+ [Koishi](https://koishi.js.org/) (for QQ)

### Messages can be forwarded

+ Chat
+ `/say` message
+ Server start up / shutdown
+ Player join / leave
+ Player death
+ Achievement

## Usage

1. Install [NodeJS](https://nodejs.org/).
2. Install MC-Repeater globally using `npm install -g mcrepeater`.
3. In your Minecraft server directory, create a bash / batch file (e.g. `start.sh` or `start.bat`), then write your Minecraft start command in it. For Java servers, it looks like:
    ```
    java -Xmx1024M -Xms1024M -jar server.jar nogui
    ```
    For Bedrock servers, it's usually:
    ```
    LD_LIBRARY_PATH=. ./bedrock_server
    ```
4. Create `config.json` in the same directory and write [configurations](#configurations) in it.
5. Run MC-Repeater using the command `mcrepeater`. You don't need to start Minecraft server manually because it's automatically started by MC-Repeater.

## Configurations

Here's a simple example `config.json` for Zulip:

```json
{
  "serverStart": "start.sh",
  "serverType": "java",
  "botType": "zulip",
  "zulip": {
    "apiKey": "YOUR-BOT-API-KEY",
    "username": "YOUR-BOT@example.com",
    "realm": "https://example-org.example.com/",
    "stream": "example-stream",
    "topic": "example-topic"
  },
  "language": "en-us"
}
```

### Parameters

#### Minecraft server configurations:

+ **serverStart:** Path to your Minecraft server starting bash / batch file.
+ **serverType:** Type of your server. Can be `java`, `paper` or `bedrock`.
+ **autoRestart (optional):** A boolean value which determine whether the MC-Repeater will auto restart your server after your server crashed (default: `false`).

#### Chat bot configurations:

+ **botType:** Your bot type which determines how the message will be sent. Can be `zulip` or `koishi` or `local` (for debugging).
+ **koishi** bot configurations:
  + **botHost:** Hostname of your bot server.
  + **botPath:** Your request path to send information to. For Koishi, it's usually `/webhook/channel/your-channel`.
  + **key:** Your secret key to sign the information. Usually provided by your bot.
+ **zulip** bot configurations:
  + **username** Bot email
  + **apiKey** Bot API key
  + **realm** Your orgnization zulip site url.
  + **stream** The stream where you want your bot to send.
  + **topic** The topic where you want your bot to send.
+ **language:** Your language. Currently support `en-us` and `zh-cn`.

#### Network optimization:

+ **throttleInterval (optional):** The minimum interval at which messages are sent (default: `0`).
+ **offlineTimeout (optional):** The minimum time to determine a player is offline (default: `0`).

#### Custom messages:

+ **customMessage (optional):** Custom messages to override original messages

  Example of `customMessage`:

  ```json
  "customMessage": {
    "join": "Ob $1 joined the game.",
    "leave": "Ob $1 left the game.",
    "advancements": {
      "Diamonds!": "Diorites!"
    },
    "deathReasons": {
      "magic": "$1 was killed by mogic!",
    },
    "mobs": {
      "Ender Dragon": "Dragon Bro"
    }
  }
  ```

#### Message mask:

+ **messageMask (optional):** Block certain type of messages. 

  | Message Type | Description                                     |
  |--------------|-------------------------------------------------|
  | join         | The message of a player joined the game         |
  | leave        | The message of a player left the game           |
  | start        | Server start message                            |
  | stop         | Server stop message                             |
  | chat         | Chat message from players                       |
  | server       | Chat message from the server                    |
  | advancement  | The message of a player achieved an advancement |
  | death        | Player death message                            |

  Example of `messageMask`:

  ```json
  messageMask: ["join", "leave", "death"]
  ```

## License

Licensed under the [MIT](https://github.com/obstudio/MC-Repeater/blob/master/LICENSE) License.