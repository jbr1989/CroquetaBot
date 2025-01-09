const z = require("zod")

const envSchema = z.object({
    BOT_USERNAME: z.string(),
    BOT_OAUTH: z.string(),

    CHANNEL_NAME: z.string(),
    CHANNEL_USER_ID: z.string(),

    BBDD_HOST: z.string(),
    BBDD_USER: z.string(),
    BBDD_PASSWORD: z.string(),
    BBDD_DATABASE: z.string(),
    BBDD_CONNECTION_LIMIT: z.string(),

    COMMAND_PREFIX: z.string()
});

const { success, error, data } = envSchema.safeParse(process.env);

if (!success) {
    console.error("Error en las variables de entorno", error.format());
    process.exit(1);
}else{
    console.log("Variables de entorno cargadas correctamente");
}

const env = data;

// export const {
//     BOT_USERNAME,
//     BOT_OAUTH,
//     CHANNEL_NAME,
//     CHANNEL_USER_ID,
//     COMMAND_PREFIX
// } = data;

module.exports ={
    env
}