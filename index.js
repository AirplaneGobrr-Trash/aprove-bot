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

var webhook_channel = config.webhookChannel // 1003339397107830894
var role_id = config.roleID // 1001043585099112448
var update_channel = config.updateChannel // 1001035225180147783

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
        var embed = msgReact.message.embeds[0].data.fields
        console.log(embed)
        // var user = usr // read the msg and get the embed and get the user
        var user = await search.searchMember(msgReact.message, embed[0].value)
        var mcName = embed[2].value
        
        
        switch (msgReact.emoji.name) {
            case "✅": {
                let fail = false
                if (user) await user.send("Välkommen till Montoria...").catch((e)=>{
                    console.log(e)
                    fail = true
                })

                var role = msgReact.message.guild.roles.cache.get(role_id)
                if (role && user) user.roles.add(role)

                var channel = msgReact.message.guild.channels.cache.get(update_channel)
                if (channel && user) channel.send(`Välkommen <@${user.id ?? null}> till Montoria SMP!!!`)
                await pteroly.Client.sendCommand(config.pteroID, `whitelist add ${mcName}`).catch((e)=>{
                    console.log(e)
                    fail = true
                })

                if (!fail && role && channel && user) {
                    msgReact.message.reply("All good!")
                } else {
                    msgReact.message.reply(`Something went wrong! Whitelist or DM: ${fail}\nRole: ${!!role}\nChannel: ${!!channel}\nUser: ${!!user}`)
                }
                break
            }
            case "❌": {
                if (user) user.send("Tyvärr så kom du inte in...")
                break
            }
        }

    }
})

client.on(Events.ClientReady, () => {
    console.log("Ready!")
})

client.login(config.token)