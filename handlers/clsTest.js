const bbdd = require("../cls/bbdd.js");
const clsCroqueta = require("./clsCroqueta.js");
const clsUser = require("./clsUser.js");
const clsEstudio = require("./clsEstudio.js");



const addUser = async (user)=> {

    const conn = await bbdd.pool.getConnection();
    clsUser.getUserId(conn, "twitch", user);
    conn.end();

};

const add = async (userFrom, userTo, action)=> {

    const conn = await bbdd.pool.getConnection();

    clsCroqueta.add(conn, userFrom, userTo, action, 'twitch').then((msg) => {
        console.log(msg);  
    });

    conn.end();

};

const estudiar = async (user)=> {

    const conn = await bbdd.pool.getConnection();

    const inicio = await clsEstudio.start(conn, user);
    console.log(inicio);

    await new Promise(resolve => setTimeout(resolve, 5000));

    const fin = await clsEstudio.end(conn, user);
    console.log(fin);

    const total = await clsEstudio.total(conn, user);
    console.log(total);

    conn.end();

};

const topCroquetas = async ()=> {

    const conn = await bbdd.pool.getConnection();

    clsCroqueta.top(conn, null, null);

    conn.end();
};



module.exports = {
    addUser, add, estudiar, topCroquetas
}