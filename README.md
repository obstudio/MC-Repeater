# MC-Repeater

<p align="center"><img src="https://user-images.githubusercontent.com/20534082/69478424-119c6200-0e2d-11ea-979b-cafd2d1daf49.png"/></p>

A chat relay between Minecraft server and IRC with no mods.

## Features

+ No mods needed
+ Support vanilla and paper servers
+ Can be run on Windows, Linux and macOS

## Usage

1. Install [NodeJS](https://nodejs.org/)
1. Clone this repository
2. Create `config.json` and write configurations in it
3. Run `index.js` using `node .`

## Configurations

Here's an example `config.json` for Koishi bot:

```json
{
  "logFile": "/path/to/mc-server/logs/latest.log",
  "serverType": "java",
  "botHost": "bot.your-host.com",
  "botPath": "/bot/request/path",
  "key": "your-secret-key",
  "language": "enUS"
}
```

### Parameters

+ **logFile:** Path to your Minecraft server latest log file.
+ **serverType:** Type of your server. Can be `java` or `paper`.
+ **botHost:** Hostname of your bot server.
+ **botPath:** Your request path to send information to. For Koishi, it's usually `/webhook/channel/your-channel`.
+ **key:** Your secret key to sign the information. Usually provided by your bot.
+ **language:** Your language. Currently support `en-us` and `zh-cn`.