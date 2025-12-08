 // Import necessary modules
const { zokou } = require(__dirname + "/../framework/zokou");
const conf = require(__dirname + "/../set");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

// Define a command named "menu"
zokou({
  nomCom: "menu",
  categorie: "General",
  reaction: "📋"
}, async (_msg, sock, data) => {
  try {
    let { ms, repondre, prefixe, nomAuteurMessage } = data;
    let { cm } = require(__dirname + "/../framework/zokou");

    // Validate required data
    if (!ms || !repondre || !prefixe) {
      return repondre("❌ *Error:* Invalid command data received.");
    }

    if (!cm || !Array.isArray(cm) || cm.length === 0) {
      return repondre("❌ *Error:* No commands found in the system.");
    }

    // Get bot mode
    const mode = s && s.MODE ? 
      (s.MODE.toString().toLowerCase() === "yes" ? "Public 🌐" : "Private 🔒") : 
      "Unknown";

    // Group commands by category
    const grouped = {};
    cm.forEach(command => {
      if (command && command.categorie && command.nomCom) {
        const category = command.categorie.trim();
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(command.nomCom.trim());
      }
    });

    if (Object.keys(grouped).length === 0) {
      return repondre("❌ *Error:* No valid commands to display.");
    }

    // Set timezone and get current time
    try {
      moment.tz.setDefault("Africa/Dar_es_Salaam");
    } catch (tzError) {
      console.warn("Timezone setting failed, using default:", tzError.message);
    }
    
    const time = moment().format("HH:mm:ss");
    const date = moment().format("DD/MM/YYYY");

    // Construct the menu header
    let header = `
╭─「 *RAHEEM XMD* 」
│👤 *User:* ${nomAuteurMessage || "Guest"}
│📆 *Date:* ${date}
│⏰ *Time:* ${time}
│📟 *Mode:* ${mode}
│🔢 *Total Commands:* ${cm.length}
│💻 *Platform:* Linux
╰───────────────⬣\n\n`;

    // Use Unicode character for "read more" function
    const readmore = String.fromCharCode(8206).repeat(4001);
    
    // Build the list of commands
    let commandText = "";
    const sortedCategories = Object.keys(grouped).sort();
    
    sortedCategories.forEach(category => {
      const commands = grouped[category];
      if (commands && commands.length > 0) {
        commandText += `╭─「 *${category.toUpperCase()}* 」\n`;
        commands.forEach(name => {
          commandText += `│ • ${prefixe}${name}\n`;
        });
        commandText += `╰─────────────────⬣\n\n`;
      }
    });
    
    // Combine all parts
    const fullMenu = header + readmore + commandText + 
                    "> 🤖 *RAHEEM XMD – Smart WhatsApp Bot*\n" +
                    "> 📍 Type " + prefixe + "help <command> for details";

    const chatId = ms.key?.remoteJid || ms?.from;
    if (!chatId) {
      return repondre("❌ *Error:* Could not identify chat.");
    }

    // Send menu as text first (fallback)
    await repondre("📋 *Loading RAHEEM XMD Menu...*");

    try {
      // Send video with menu caption
      await sock.sendMessage(chatId, {
        video: { 
          url: "https://files.catbox.moe/hsubai.mp4" 
        },
        mimetype: 'video/mp4',
        caption: fullMenu,
        gifPlayback: false,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: "RAHEEM XMD BOT",
            body: "Version 2.0 • All Commands Available",
            sourceUrl: "https://whatsapp.com/channel/0029VbAffhD2ZjChG9DX922r",
            mediaType: 2,
            renderLargerThumbnail: true,
            thumbnailUrl: "https://files.catbox.moe/hsubai.mp4",
            mediaUrl: "https://whatsapp.com/channel/0029VbAffhD2ZjChG9DX922r"
          }
        }
      }, { 
        quoted: ms,
        ephemeralExpiration: 86400
      });

      // Send audio separately (optional)
      setTimeout(async () => {
        try {
          await sock.sendMessage(chatId, {
            audio: { 
              url: "https://files.catbox.moe/1uc1ha.mp3" 
            },
            mimetype: "audio/mpeg",
            ptt: false,
            fileName: "raheem-xmd-intro.mp3"
          });
        } catch (audioError) {
          console.log("Audio send failed (non-critical):", audioError.message);
        }
      }, 1000);

      console.log(`✅ Menu sent successfully to ${chatId}`);
      
    } catch (mediaError) {
      console.error("Media send failed, sending text menu:", mediaError);
      
      // Fallback to text-only menu
      const textMenu = `
╔═══「 *RAHEEM XMD MENU* 」═══╗
║ 👤 User: ${nomAuteurMessage || "Guest"}
║ 📆 Date: ${date}
║ ⏰ Time: ${time}
║ 📟 Mode: ${mode}
║ 🔢 Commands: ${cm.length}
╚══════════════════════╝

${commandText}

📌 *Usage:* ${prefixe}<command>
📞 *Support:* Contact developer
🤖 *Bot Status:* Active & Running

*Powered by Raheem-cm*
      `;
      
      await sock.sendMessage(chatId, {
        text: textMenu,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true
        }
      }, { quoted: ms });
    }

  } catch (mainError) {
    console.error("❌ CRITICAL MENU ERROR:", mainError);
    
    // Try to send basic error message
    try {
      if (repondre) {
        await repondre("❌ *System Error:* Failed to load menu.\n" +
                      "📞 Please contact admin for support.\n" +
                      "⚠️ Error: " + mainError.message.substring(0, 100));
      }
    } catch (finalError) {
      console.error("Failed to send error message:", finalError);
    }
  }
});

// Alternative menu command (simpler version)
zokou({
  nomCom: "help",
  categorie: "General",
  reaction: "❓"
}, async (_msg, sock, data) => {
  try {
    const { ms, repondre, prefixe } = data;
    
    const helpText = `
╭─「 *QUICK HELP* 」─╮
│ ${prefixe}menu - Full command list
│ ${prefixe}help - This message
│ ${prefixe}ping - Check bot status
│ ${prefixe}owner - Contact developer
│ ${prefixe}info - Bot information
╰─────────────────╯

📌 *Need more help?*
Type: ${prefixe}menu for complete list
    `;
    
    await sock.sendMessage(ms.key.remoteJid, {
      text: helpText,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true
      }
    }, { quoted: ms });
    
  } catch (error) {
    console.error("Help command error:", error);
  }
});

module.exports = {
  // Export if needed
};
