const { client } = require('tmi.js');
const bbdd = require("./bbdd.js");

const clsUser = require("../handlers/clsUser.js")
const clsCroqueta = require("../handlers/clsCroqueta.js");
const clsEstudio = require("../handlers/clsEstudio.js");

const command = async (client, target, ctx, value, args)=> {

    const conn = await bbdd.pool.getConnection();

    switch (value){
        case "croqueta": {

            const user_to = getUserFromMention(args[0]);
            console.log(user_to);
            
            if (user_to!=null){

                clsCroqueta.add(conn, ctx.username, user_to, 'add', 'twitch').then((msg) => {
                    //console.log(msg);  
                    client.say(target, `/me ${msg}`);
                });
            
            }else{ client.say(target, replace(ctx, "$author usuario NO válido (pon @ antes del nombre)")); }

            break;
        }
        case "castigo": {

            const user_to = getUserFromMention(args[0]);
            if (user_to!=null){

                clsCroqueta.add(conn, ctx.username, user_to, 'cas', 'twitch').then((msg) => {
                    //console.log(msg);  
                    client.say(target, `/me ${msg}`);
                });
                
            }else{client.say(target, replace(ctx, "/me $author usuario NO válido (pon @ antes del nombre)"));}
        
            break;
        }
        case "miscroquetas":

            clsUser.getUserId(conn, "twitch_name", ctx.username).then((idUser) => { 
                clsCroqueta.total(conn, idUser).then((num) => {
                      //console.log("Tienes " + num + " croquetas");  
                      client.say(target, `/me ${ctx.username} Tienes ${num} croquetas`);
                })
            });

        break;
        case "miscastigos":

            clsUser.getUserId(conn, "twitch_name", ctx.username).then((idUser) => { 
                clsCroqueta.totalcastigos(conn, idUser).then((num) => {
                      //console.log("Tienes " + num + " croquetas");  
                      client.say(target, `/me ${ctx.username} Tienes ${num} castigos`);
                })
            });

        break;
        case "misestudios":

            clsEstudio.total(conn, ctx.username).then((msg) => {
                //console.log(msg);  
                client.say(target, `/me ${msg}`);
            });
        break;
        case "topcroquetas":
            clsCroqueta.top(conn, client, target);
        break;
        case "topcastigos":
            clsCroqueta.topCas(conn, client, target);
        break;
        case "estudiar":
            
            clsEstudio.start(conn, ctx.username).then((msg) => {
                //console.log(msg);  
                client.say(target, `/me ${msg}`);
            });

        break;
        case "noestudiar":
            
            clsEstudio.end(conn, ctx.username).then((msg) => {
                //console.log(msg);  
                client.say(target, `/me ${msg}`);
            });

        break;
    }

    conn.end();
}


module.exports ={
    command
}


function callback(response) {
    let str = "";

    response.on("data", (chunk) => {
        str += chunk;
    });

    response.on("end", () => {
        console.log(str);
    });
}

function getUserFromMention(mention) {
    console.log(mention);

	if (!mention) return;

	if (mention.startsWith('@')) {
		let mention_cleared = mention.slice(1);

		if (mention_cleared.startsWith('!') || mention_cleared.startsWith('&')) {
			mention_cleared = mention_cleared.slice(1);
		}

        //console.log(mention_cleared);

		return mention_cleared;//client.users.cache.get(mention);
	}

    return null;
}

function replace(ctx, texto=""){

    let res = texto;

    if (res.includes("$author")) {
        res=res.replace("$author", `${ctx.username}`)
    }

    return res;
}