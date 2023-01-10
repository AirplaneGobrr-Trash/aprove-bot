const Discord = require("discord.js")
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const search = require("discord.js-search");
const pteroly = require("pteroly")
const config = require("./config.json")

pteroly.Client.login(config.url, config.auth, (stat,msg)=>{
    console.log(stat, msg)
})
// sendCommand(serverId, command)
console.log(GatewayIntentBits)
const client = new Client({
    intents: [
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent
    ]
});

var webhook_channel = "1003339397107830894" // 1003339397107830894
var role_id = "1001043585099112448" // 1001043585099112448
var update_channel = "1001035225180147783" // 1001035225180147783

// console.log(Events, GatewayIntentBits)

client.on(Events.MessageCreate, async (msg) => {
    if (msg.channel.id == webhook_channel && msg.embeds.length > 0) {
        await msg.react("✅")
        await msg.react("❌")
    }
})

client.on(Events.MessageReactionAdd, async (msgReact, usr) => {
    console.log(msgReact, usr, msgReact.message)
    if (msgReact.count == 2) {
        var embed = msgReact.message.embeds[0].fields
        console.log(embed)
        // var user = usr // read the msg and get the embed and get the user
        var user = await search.searchMember(msgReact.message, embed[0].value)
        var mcName = embed[2].value
        
        
        switch (msgReact.emoji.name) {
            case "✅": {
                user.send("Välkommen till Montoria...")

                var role = msgReact.message.guild.roles.cache.get(role_id)
                user.roles.add(role)

                var channel = msgReact.message.guild.channels.cache.get(update_channel)
                channel.send(`Välkommen <@${user.id}> till Montoria SMP!!!`)
                pteroly.Client.sendCommand("700575f4", `whitelist add ${mcName}`)
                break
            }
            case "❌": {
                user.send("Tyvärr så kom du inte in...")
                break
            }
        }
    }
})

client.on(Events.ClientReady, () => {
    console.log("Ready!")
})

client.login(config.token)