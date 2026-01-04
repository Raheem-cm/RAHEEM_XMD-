const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
const path = require("path");

// Load env variables if set.env exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

// Environment variables
const DATABASE_URL = process.env.DATABASE_URL || "postgres://db_user:db_password@host:port/db_name";

// Export configuration
module.exports = {
    session: process.env.SESSION_ID || 'zokk',
    PREFIXE: process.env.PREFIX || "+",
    OWNER_NAME: process.env.OWNER_NAME || "Raheem-cm",
    NUMERO_OWNER: process.env.NUMERO_OWNER || "255763111390",
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "non",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    BOT: process.env.BOT_NAME || 'RAHEEM XMD',
    URL: process.env.BOT_MENU_LINKS || 'https://files.catbox.moe/ety154.jpg',
    MODE: process.env.PUBLIC_MODE || "no",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY: process.env.HEROKU_APY_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    ETAT: process.env.PRESENCE || '1',
    CHATBOT: process.env.PM_CHATBOT || 'no',
    DP: process.env.STARTING_BOT_MESSAGE || "yes",
    ADM: process.env.ANTI_DELETE_MESSAGE || 'yes',

    // Database
    DATABASE_URL,
    DATABASE: new Sequelize(DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
    }),
};

// Hot reload for local development only
if (process.env.NODE_ENV !== "production") {
    let fichier = require.resolve(__filename);
    fs.watchFile(fichier, () => {
        fs.unwatchFile(fichier);
        console.log(`mise à jour ${__filename}`);
        delete require.cache[fichier];
        require(fichier);
    });
}
