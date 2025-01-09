const getUserId = async (conn, source, userName) => {
    //let conn;

    try {
      //conn = await bbdd.pool.getConnection();
      campo = (source === "discord" ?  "discord_name" : "twitch_name");
    
      const rows = await conn.query(`SELECT id_user FROM users WHERE ${campo}='${userName}'`);
      if (rows.length === 1) return rows[0].id_user;

      const result = await conn.query(`INSERT INTO users (${campo}) VALUES ('${userName}')`);
      const idUser = result.insertId;
      console.log(result);

      return idUser;

    } catch (err) {
      throw err;
    }
  }

module.exports ={
  getUserId
}