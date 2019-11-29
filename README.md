# MC-Repeater

<p align="center"><img src="https://user-images.githubusercontent.com/20534082/69478424-119c6200-0e2d-11ea-979b-cafd2d1daf49.png"/></p>

A chat relay between Minecraft server and IRC with no mods.

## Features

+ No mods needed
+ Support vanilla and paper servers
+ Can be run on Windows, Linux and macOS

### Chat bot support

+ Koishi bot (for QQ)

### Messages can be forwarded

+ Chat
+ `/say` message
+ Server start up / shutdown
+ Player join / leave
+ Player death
+ Achievement

## Usage

1. Install [NodeJS](https://nodejs.org/)
2. Clone this repository
3. Create `config.json` and write configurations in it
4. Run `index.js` in your server directory using `node`.

## Configurations

Here's an example `config.json` for Koishi bot:

```json
{
  "serverStartFile": "/path/to/mc-server/start-server.sh",
  "autoRestart": true,
  "serverType": "java",
  "botType": "koishi",
  "botHost": "bot.your-host.com",
  "botPath": "/bot/request/path",
  "key": "your-secret-key",
  "language": "en-us",
  "throttleInterval": 5000
}
```

### Parameters

Parameters with default values are optional.

+ **serverStartFile:** Path to your Minecraft server starting bash/batch file.
+ **autoRestart:** A boolean value which determine whether the MC-Repeater will auto restart your server after your server stopped (default: `false`).
+ **serverType:** Type of your server. Can be `java` or `paper`.
+ **botType:** Your bot type which determines how the message will be sent. Can be `koishi` or `local` (default: `koishi`)
+ **botHost:** Hostname of your bot server.
+ **botPath:** Your request path to send information to. For Koishi, it's usually `/webhook/channel/your-channel`.
+ **key:** Your secret key to sign the information. Usually provided by your bot.
+ **language:** Your language. Currently support `en-us` and `zh-cn`.
+ **throttleInterval:** The minimum interval at which messages are sent (default: `0`).
