const bbdd = require("../cls/bbdd.js");

const clsUser = require("./clsUser.js")


const add = async (conn, userFrom, userTo, action, source)=> {
    //let conn;
    let msg="";

    try {
        //conn = await bbdd.pool.getConnection();

        // TO DO Si el usuario final NO existe
        const [idUserFrom, idUserTo] = await Promise.all([
            clsUser.getUserId(conn, "twitch_name", userFrom),
            clsUser.getUserId(conn, "twitch_name", userTo)
        ]);

        const campo = (action==='add' ? 'total' : 'castigos');

        const [existe, info] = await Promise.all([
            exists(conn, idUserTo, userTo),
            addInfo(conn, idUserFrom, userFrom, idUserTo, userTo, action, source)
        ]);

        // Esperar que inserte
        const [actualizado] = await Promise.all([
          update(conn, idUserTo, campo, action)
        ]);

        if (action==='add'){ // ADD CROQUETA

          const [numCroquetas] = await Promise.all([
              total(conn, idUserTo)
          ]);

          msg += `${userTo}, ${userFrom} te da su última croqueta, ÑAM! Tienes ${numCroquetas} croquetas`;

        }else if (action=='cas'){ // ADD CASTIGO

          const [numCas] = await Promise.all([
            totalcastigos(conn, idUserTo)
          ]);

          msg += `${userTo}, ${userFrom} te ha castigado con un mes sin croquetas. Tienes ${numCas} castigos`;
        }

        return msg;


    } catch (err) {
      throw err;
    }
  }

  

  async function addInfo(conn, idUserFrom, userFrom, idUserTo, userTo, action, source){

    try {
        //conn = await bbdd.pool.getConnection();
        const result = await conn.query(`INSERT INTO croquetas_info (id_user_from, user_from, id_user_to, user_to, action, source) VALUES (${idUserFrom}, '${userFrom}', ${idUserTo}, '${userTo}', '${action}', '${source}')`);

        return (result.affectedRows===1);

    } catch (err) {
      throw err;
    }

  }

  async function update(conn, idUserTo, campo, action){

    try {
        //conn = await bbdd.pool.getConnection();
        const result = await conn.query(`UPDATE \`croquetas\` SET ${campo}=(SELECT count(*) FROM croquetas_info WHERE croquetas_info.action='${action}' AND croquetas.id_user=croquetas_info.id_user_to) WHERE id_user=${idUserTo}`);

        return (result.affectedRows===1);

    } catch (err) {
      throw err;
    }

  }

  async function exists(conn, idUserTo, userTo){
    try {
      //conn = await bbdd.pool.getConnection();

      let result;

      result = await conn.query(`SELECT id_user FROM croquetas WHERE id_user=${idUserTo}`);
      if (result.length>0) return true; // Ya existe el usuario

      result = await conn.query(`INSERT INTO croquetas(id_user, user, total, castigos) VALUES (${idUserTo}, '${userTo}', 0, 0)`);
      return (result.affectedRows===1); // Insertar el nuevo usuario

  } catch (err) {
    throw err;
  }
  }

const total = async (conn, idUser)=> {
    //let conn;

    try {
        //conn = await bbdd.pool.getConnection();
        const rows = await conn.query("SELECT total FROM `croquetas` WHERE id_user="+idUser);
        //conn.end();

        if (rows.length===1) return rows[0].total;
        else return null;

    } catch (err) {
      throw err;
    }
  }

const totalcastigos = async (conn, idUser)=> {
    //let conn;

    try {
        //conn = await bbdd.pool.getConnection();
        const rows = await conn.query(`SELECT castigos FROM "croquetas" WHERE id_user=${idUser}`);
        //conn.end();

        if (rows.length===1) return rows[0].castigos;
        else return null;

    } catch (err) {
      throw err;
    }
  }

const top = async (conn, client, target)=> {
    //let conn;

    try {
        //conn = await bbdd.pool.getConnection();
        const rows = await conn.query("SELECT * FROM `croquetas` ORDER BY total DESC LIMIT 10");
        //conn.end();

        //Print list of contacts
        let num=1;
        while(num<rows.length+1){
            //console.log(num + ". " + rows[num-1].user + " (" + rows[num-1].total + " croquetas)");
            client.say(target, `/me ${num}. ${rows[num-1].user} (${rows[num-1].total} croquetas)`);
            num++;
        }

        if (rows.length===1) return rows[0].id_user;
        else return null;

    } catch (err) {
      throw err;
    }
  }

const topCas = async (conn, client, target)=> {
    //let conn;

    try {
        //conn = await bbdd.pool.getConnection();
        const rows = await conn.query("SELECT * FROM croquetas ORDER BY castigos DESC LIMIT 10");
        //conn.end();

        //Print list of contacts
        let num=1;
        while(num<rows.length+1){
            //console.log(num + ". " + rows[num-1].user + " (" + rows[num-1].castigos + " castigos)");
            client.say(target, `/me ${num}. ${rows[num-1].user} (${rows[num-1].castigos} castigos)` );
            num++;
        }

        if (rows.length===1) return rows[0].id_user;
        else return null;

    } catch (err) {
        throw err;
    }
  }



module.exports = {
    add, total, totalcastigos, top, topCas
}