import express from "express"; // express 프레임 워크, 서버 구축
import fs from "fs"; // 파일 시스템 모듈, 파일 읽고 쓰기
import mysql from "mysql2/promise"; // 디비 연결 및 쿼리 실행
import cors from "cors"; // 미들웨어, 다른 출처의 요청 허용

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static("uploads"));

// uploads 파일 생성
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1111",
    database: "photos_db"
});

// db api
app.post("/upload", async (req, res) => {
    const { image } = req.body;
    const base64 = image.replace(/^data:image\/w+;base64,/, "");
    const filename = `photo_${Date.now()}.png`;
    fs.writeFileSync(`uploads/${filename}`, base64, "base64");
    const url = `http://localhost:5173/uploads/${filename}`;
    await db.execute("INSERT INTO photos (url, created_at) VALUES (?, NOW())", [url]);


    res.json({ success: true, url });

});

app.listen(5173, () => console.log("Server running on http://localhost:5173"));
