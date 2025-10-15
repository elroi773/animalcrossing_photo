// 사진 url api
app.get("/photos", async (req, res) => {
    const [rows] = await db.execute("SELECT * FROM photos ORDER BY created_at DESC");
    res.json(rows);
});

// 삭제 api
app.delete("/photos/:id", async (req, res) => {
    const { id } = req.params;

    // DB에서 URL 가져오기
    const [rows] = await db.execute("SELECT url FROM photos WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Photo not found" });

    const url = rows[0].url;
    const filename = url.split("/").pop();

    // 파일 삭제
    fs.unlinkSync(`uploads/${filename}`);

    // DB에서 삭제
    await db.execute("DELETE FROM photos WHERE id = ?", [id]);

    res.json({ success: true });
});