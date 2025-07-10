const { zokou } = require(__dirname + "/../framework/zokou");
const conf = require(__dirname + "/../set");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

zokou({
  nomCom: "menu",
  categorie: "General"
}, async (_msg, sock, data) => {
  let { ms, repondre, prefixe, nomAuteurMessage } = data;
  let { cm } = require(__dirname + "/../framework/zokou");

  // Bot mode
  let mode = s.MODE.toLowerCase() === "yes" ? "Public" : "Private";

  // Group commands
  let grouped = {};
  for (const command of cm) {
    if (!grouped[command.categorie]) grouped[command.categorie] = [];
    grouped[command.categorie].push(command.nomCom);
  }

  // Timezone and Date
  moment.tz.setDefault("Africa/Dar_es_Salaam");
  const time = moment().format("HH:mm:ss");
  const date = moment().format("DD/MM/YYYY");

  // Menu header
  let header = `╭─「 *RAHEEM XMD* 」
│👤 *User:* ${nomAuteurMessage || "Guest"}
│📆 *Date:* ${date}
│⏰ *Time:* ${time}
│📟 *Mode:* ${mode}
│🔢 *Total Commands:* ${cm.length}
│💻 *Platform:* Linux
╰───────────────⬣\n\n`;

  // Build command list
  let commandText = "";
  for (const category in grouped) {
    commandText += `┌─「 *${category.toUpperCase()}* 」\n`;
    for (const name of grouped[category]) {
      commandText += `│ ➤ ${prefixe}${name}\n`;
    }
    commandText += `└─────────────⬣\n\n`;
  }

  const fullMenu = header + readmore + commandText + "> 🤖 *RAHEEM XMD – Smart Assistant Ready to Help You!*";

  const chatId = ms?.key?.remoteJid;
  if (!chatId) return repondre("❌ Failed to load menu: Unable to get chat ID.");

  try {
    // 2. Send video (menu with commands)
    await sock.sendMessage(chatId, {
      video: { url: "https://files.catbox.moe/hsubai.mp4" },
      mimetype: 'gif/mp4',
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

    // 3. Send audio (music)
    await sock.sendMessage(chatId, {
      audio: { url: "https://files.catbox.moe/1uc1ha.mp3" },
      mimetype: "audio/mpeg",
      ptt: false,
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
    repondre("❌ Failed to load menu. Error: " + err.message);
  }
});
