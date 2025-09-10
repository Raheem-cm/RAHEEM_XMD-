// Import necessary modules
const { zokou } = require(__dirname + "/../framework/zokou");
const conf = require(__dirname + "/../set");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

// Define a command named "menu"
zokou({
  nomCom: "menu",
  categorie: "General"
}, async (_msg, sock, data) => {
  let { ms, repondre, prefixe, nomAuteurMessage } = data;
  let { cm } = require(__dirname + "/../framework/zokou");

  // Get bot mode (Public/Private)
  const mode = s.MODE.toLowerCase() === "yes" ? "Public" : "Private";

  // Group commands by category
  const grouped = {};
  for (const command of cm) {
    if (!grouped[command.categorie]) {
      grouped[command.categorie] = [];
    }
    grouped[command.categorie].push(command.nomCom);
  }

  // Set timezone and get current time and date
  moment.tz.setDefault("Africa/Dar_es_Salaam");
  const time = moment().format("HH:mm:ss");
  const date = moment().format("DD/MM/YYYY");

  // Construct the menu header
  let header = `╭─「 *RAHEEM XMD* 」
│👤 *User:* ${nomAuteurMessage || "Guest"}
│📆 *Date:* ${date}
│⏰ *Time:* ${time}
│📟 *Mode:* ${mode}
│🔢 *Total Commands:* ${cm.length}
│💻 *Platform:* Linux
╰───────────────⬣\n\n`;

  // Use Unicode character for the "read more" function
  const readmore = String.fromCharCode(8206).repeat(4001);
  
  // Build the list of commands
  let commandText = "";
  for (const category in grouped) {
    commandText += `┌─「 *${category.toUpperCase()}* 」\n`;
    for (const name of grouped[category]) {
      commandText += `│ ➤ ${prefixe}${name}\n`;
    }
    commandText += `└─────────────⬣\n\n`;
  }
  
  // Combine all parts of the menu
  const fullMenu = header + readmore + commandText + "> 🤖 *RAHEEM XMD – Smart Assistant Ready to Help You!*";

  const chatId = ms?.key?.remoteJid;
  if (!chatId) {
    return repondre("❌ Failed to load menu: Unable to get chat ID.");
  }

  try {
    // Send a video with the menu as the caption
    await sock.sendMessage(chatId, {
      video: { url: "https://files.catbox.moe/hsubai.mp4" },
      mimetype: 'video/mp4', // Corrected mimetype
      caption: fullMenu,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "RAHEEM XMD MENU",
          body: "Full List of Commands Below",
          sourceUrl: "https://whatsapp.com/channel/0029VbAffhD2ZjChG9DX922r",
          mediaType: 2,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: ms });

    // Send a separate audio message
    await sock.sendMessage(chatId, {
      audio: { url: "https://files.catbox.moe/1uc1ha.mp3" },
      mimetype: "audio/mpeg",
      ptt: false, // Set to false to prevent it from being a voice note
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "RAHEEM XMD Music",
          body: "Enjoy the intro music",
          sourceUrl: "https://whatsapp.com/channel/0029VbAffhD2ZjChG9DX922r",
          mediaType: 2
        }
      }
    }, { quoted: ms });

  } catch (err) {
    console.error("❌ Menu Error:", err);
    repondre("❌ Failed to load menu. Please try again later.");
  }
});
