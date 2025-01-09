//#region IMPORTS

global.config = require("./config.js")
const tmi = require('tmi.js');

const commands = require("./cls/commands.js");
// const follow = require("./cls/follow.js");

//#endregion


//#region CONFIGURACION

const options = {
    options: {
        debug: true,
        messagesLogLevel: "info"
    },
    connection: {
        cluster: "aws",
        reconnect: true
    },
    identity:{
        username: config.env.BOT_USERNAME,
        password: config.env.BOT_OAUTH
    },
    channels :  [config.env.CHANNEL_NAME]
}

console.log(options);

global.client = new tmi.client(options);
global.channel;

client.connect();

//#endregion


//#region EVENTOS


//#region CONNEXION

client.on('ready', () => {
    //client.user.setActivity('bot en heroku', {type: 'WATCHING'});
    console.log('Listo!');
});

// Connected to server.
client.on('connected', (address, port) => {
    console.log(`Conectado a ${address}:${port}`);
    client.say(config.env.CHANNEL_NAME, "/me Hola soy el CroquetaBot uWu");
});


// Disconnected from server.
client.on('disconnected', (reason) => {
    console.log('disconnected', reason);
});

//#endregion


//#region RAID o HOST
/*
// Channel is now being raided by another broadcaster.
client.on("raided", (channel, username, viewers) => {
    console.log("RAIDED");
    console.log('raided', { channel, username, viewers });
    client.say(channel, `/me Gracias por la raid de ${viewers} personitas. Id a dejarle unas croquetillas a https://www.twitch.tv/${username}`);
});

// Channel is now hosted by another broadcaster.
client.on("hosted", (channel, username, viewers, autohost) => {
    console.log("HOSTED");
    console.log('hosted', { channel, username, viewers, autohost });
    global.channel=channel;
    client.say(channel, `/me Gracias por el host de ${viewers} personitas. Id a dejarle unas croquetillas a https://www.twitch.tv/${username.username}`);
});

// Channel is now hosting another channel.
client.on("hosting", (channel, target, viewers) => {
    console.log("HOSTING");
    console.log('hosting', { channel, target, viewers });
    //global.channel=channel;
    client.say(channel, `/me Hosteando a ${target} con ${viewers} croquetillas.`);
});
*/
//#endregion


//#region REGALOS

// Username has subscribed to a channel.
client.on("subscription", (channel, username, method, message, userstate) => {
    console.log("SUBSCRIPTION");
    console.log('subscription', { channel, username, method, message, userstate });
    global.channel=channel;
    client.say(channel, `/me Gracias por la suscripción @${username}.`);
});

// Username has resubbed on a channel.
client.on("resub", (channel, username, _months, message, userstate, methods) => {
    console.log("RESUB");
    console.log('resub', { channel, username, _months, message, userstate, methods });
    global.channel=channel;
    client.say(channel, `/me Gracias por la resuscripción @${username}.`);
});

// Username has cheered to a channel.
client.on("cheer", (channel, userstate, message) => {
    console.log("CHEERS");
    console.log('cheers', { channel, userstate, message });
    global.channel=channel;
    client.say(channel, `/me Gracias por los ${userstate.bits} bits @${userstate.username}`);
});

 /*
// Username gifted a subscription to recipient in a channel.
client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
    console.log("SUBGIFT");
    console.log('subgift', { channel, username, streakMonths, recipient, methods, userstate });
    global.channel=channel;

    let totalGift = ~~userstate["msg-param-sender-count"];
    client.say(channel, `/me @${username} ha regalado una subscripción a ${recipient}.`);
    if (totalGift > 1) {
        client.say(channel, `/me @${username} lleva un total de ${totalGift} subcripciones regaladas.`);
    }
    
});

// Username is gifting a subscription to someone in a channel.
client.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
    // Do your stuff.
    console.log("SUBMYSTERYGIFT");
    console.log('submysterygift', { channel, username, numbOfSubs, methods, userstate });
    global.channel=channel;

    let totalGift = ~~userstate["msg-param-sender-count"];
    client.say(channel, `/me @${username} ha regalado @${numbOfSubs} subscripciones.`);
    if (totalGift > 1) {
        client.say(channel, `/me @${username} lleva un total de ${totalGift} subcripciones anónimas regaladas.`);   
    }
});
*/

//#endregion


//#region MENSAJES

// Received a message.
client.on('message', (channel, tags, message, self) => {
	if(self) return;
    //console.log("MESSAGE");
    //console.log('message', { channel, tags, message, self });
    //global.channel=channel;
});

// Received message on channel.
client.on('chat', (target, ctx, message, self) => {
    //console.log("CHAT");
    //console.log('chat', { target, ctx, message, self });

    if(self) return;

    // COMANDOS
    if (message.startsWith(config.env.COMMAND_PREFIX)) {
        const commandBody = message.slice(config.env.COMMAND_PREFIX.length);
        const args = commandBody.split(' ');
        const command = args.shift().toLowerCase();

        commands.command(client, target, ctx, command, args);
    }
    else
    {
        //console.log("Comprobando spam");
        // Spam detectado

        let spam = false;
        if (!spam) spam=checkSpam(message, /[⣿]/);

        //spam=(ctx.username == "dizo_89");
        console.log(`SPAM? ${spam}`);

        if (spam) {
            console.log(`spam detected: ${message}`);
            try{
                client.deletemessage(config.channel, ctx.id);
            } catch (error) {
                console.log("ERROR al eliminar mensaje");
                console.error(error);
            }
        }

    }

});

function checkSpam(message, regex){
    return regex.test(message);
}


//#endregion


//#region OTROS

// Chat of a channel got cleared.
client.on('clearchat', (channel, username) => {
    console.log('clearchat', { channel, username });
});


// Received the emote-sets from Twitch.
/*client.on("emotesets", (sets, obj) => {
    console.log("EMOTESETS");
    console.log('emotesets', { sets, obj });
});*/

//#endregion


//#region EXPERIMENTALES

// Message was deleted/removed.
client.on("messagedeleted", (channel, username, deletedMessage, userstate) => {
    // Do your stuff.
    console.log("MESSAGEDELETED");
    console.log('messagedeleted', { channel, username, deletedMessage, userstate });
});


client.on('error', (error) => {
    console.log("ERROR");
    console.log('error', error);
});

//#endregion


//#endregion