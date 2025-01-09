const bbdd = require("../cls/bbdd.js");

const clsUser = require("./clsUser.js")

const start = async (conn, user)=> {
    //let conn;
    const msg="";

    try {
        // TO DO Si el usuario final NO existe
        const [idUser] = await Promise.all([
            clsUser.getUserId(conn, "twitch_name", user)
        ]);

        const [estudioInfo] = await Promise.all([
            get(conn, idUser)
        ]);

        if (estudioInfo!=null) return `${user} ya estas estudiando!!!`;

        const result = await conn.query(`INSERT INTO estudios_info (id_user, user) VALUES (${idUser}, '${user}')`);
        if (result.affectedRows!==1) return false;
        return `${user} empieza a estudiar!!!`;


    } catch (err) {
      throw err;
    }
  }

  const end = async (conn, user)=> {
    //let conn;
    const msg="";

    try {
        // TO DO Si el usuario final NO existe
        const [idUser] = await Promise.all([
            clsUser.getUserId(conn, "twitch_name", user)
        ]);

        const [estudioInfo] = await Promise.all([
            get(conn, idUser)
        ]);

        if (estudioInfo==null) return `${user} NO estabas estudiando!!!`;


        const inicio = estudioInfo.start.getTime();
        const fin = new Date().getTime();
        const diff = Math.abs( (inicio - fin) / 1000 );

        const result = await conn.query(`UPDATE estudios_info SET end=NOW(), total=${diff} WHERE id_estudio_info=${estudioInfo.id_estudio_info}`);
        if (result.affectedRows!==1) return false;

        return `${user} deja de estudiar. Has estudiado ${diffToString(diff)}`;

    
    } catch (err) {
      throw err;
    }
  }

  const total = async (conn, user)=> {
    //let conn;
    const msg="";

    try {
        // TO DO Si el usuario final NO existe
        const [idUser] = await Promise.all([
            clsUser.getUserId(conn, "twitch_name", user)
        ]);

        const rows = await conn.query(`SELECT SUM(total) as sumatorio FROM estudios_info WHERE id_user=${idUser}`);
        if (rows.length!==1) return false;

        return `${user} en total has estudiado ${diffToString(rows[0].sumatorio)}`;

    
    } catch (err) {
      throw err;
    }
  }

  async function get(conn, idUser){

    const rows = await conn.query(`SELECT * FROM estudios_info WHERE id_user=${idUser} AND end is NULL`);
    if (rows.length>0) return rows[0];

    return null;
  }


  function diffToString(diff){

    //diff=diff/1000;

    hours = Math.floor(diff / (60*60));
    diff -= (hours * (60*60));

    minutes = Math.floor(diff / 60);
    diff -= (minutes * 60);

    seconds = Math.floor(diff);

    tiempo="";

    if (hours>0) tiempo= `${hours} horas, `;

    return `${tiempo + minutes} minutos y ${seconds} segundos.`;
}

module.exports = {
    start, end, total
}