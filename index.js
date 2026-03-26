const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// TikTok'tan Veri Çekme Fonksiyonu
async function getTikTokProfile(user) {
    try {
        const response = await axios.get(`https://www.tiktok.com/@${user}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
            },
            timeout: 10000
        });

        const html = response.data;
        const regex = /<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">([\s\S]*?)<\/script>/;
        const match = html.match(regex);

        if (!match) return null;

        const fullData = JSON.parse(match[1]);
        const info = fullData.__DEFAULT_SCOPE__?.["webapp.user-detail"]?.userInfo;

        if (info) {
            return {
                username: info.user.uniqueId,
                nickname: info.user.nickname,
                followers: info.stats.followerCount,
                following: info.stats.followingCount,
                likes: info.stats.heartCount,
                bio: info.user.signature,
                avatar: info.user.avatarLarger,
                verified: info.user.verified
            };
        }
    } catch (err) {
        return { error: err.message };
    }
    return null;
}

// API Endpoint: Kullanıcı adını alıp sonucu döndürür
app.post('/api/fetch-profile', async (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Kullanıcı adı gerekli" });

    const data = await getTikTokProfile(username.replace('@', ''));
    
    if (data && !data.error) {
        res.json(data);
    } else {
        res.status(404).json({ error: "Profil bulunamadı veya TikTok engelledi." });
    }
});

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda aktif!`);
});
