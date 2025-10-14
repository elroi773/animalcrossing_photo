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

// 이미지 프록시 추가
app.get("/image-proxy/*", async (req, res) => {
  try {
    const path = req.params[0]; // * 에 매칭된 값은 req.params[0]으로 가져와야 함
    const imageUrl = `https://dodo.ac/${path}`;
    console.log("Proxy fetching:", imageUrl);

    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

    res.set("Content-Type", response.headers["content-type"]);
    res.set("Access-Control-Allow-Origin", "*");
    res.send(response.data);
  } catch (err) {
    console.error("이미지 프록시 에러:", err.message);
    res.status(500).send("Proxy failed");
  }
});

app.listen(3000, () => console.log("Proxy server running on port 3000"));
