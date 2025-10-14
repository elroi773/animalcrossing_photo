import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

app.get("/api/villagers", async (req, res) => {
  try {
    const response = await axios.get("https://api.nookipedia.com/villagers", {
      headers: {
        "X-API-KEY": process.env.NOOKIPEDIA_API_KEY,
        "Accept-Version": "1.0.0",
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error("프록시 서버 에러:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// 이미지 프록시
app.get(/^\/image-proxy\/(.+)/, async (req, res) => {
  const path = req.params[0]; // 정규식 캡처 그룹
  const imageUrl = `https://dodo.ac/np/images/${path}`;

  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    res.set("Content-Type", response.headers["content-type"]);
    res.send(response.data);
  } catch (err) {
    console.error("이미지 로드 실패:", err.message);
    res.status(500).send("이미지 로드 실패");
  }
});

app.listen(3000, () => console.log("Proxy server running on port 3000"));
