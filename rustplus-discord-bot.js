// rustplus-discord-bot.js
const { RustPlus } = require('@liamcottle/rustplus.js');
const { Client, GatewayIntentBits } = require('discord.js');

const discordToken = process.env.DISCORD_BOT_TOKEN;
const discordChannelId = process.env.DISCORD_CHANNEL_ID;

const playerId = process.env.PLAYER_ID;
const playerToken = process.env.PLAYER_TOKEN;
const serverIp = process.env.SERVER_IP;
const serverPort = Number(process.env.SERVER_PORT);

const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

discordClient.once('ready', () => {
  console.log('Discord bot logged in!');
});

discordClient.login(discordToken);

const rustplus = new RustPlus(serverIp, serverPort, playerId, playerToken);

rustplus.connect();

rustplus.on('connected', () => {
  console.log('Connected to Rust+ server!');
});

rustplus.on('event', (event) => {
  if (event.type === 'SmartAlarmTriggered') {
    const channel = discordClient.channels.cache.get(discordChannelId);
    if (channel) {
      const msg = `🚨 RAID ALERT! Smart Alarm triggered in zone **${event.zone}** at ${new Date(event.time).toLocaleTimeString()}`;
      channel.send(msg);
    }
  }
});

rustplus.on('disconnected', () => {
  console.log('Disconnected from Rust+ server.');
});
