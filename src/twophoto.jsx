import axios from "axios";
import { useEffect, useState } from "react";
import Webcam from "react-webcam";
import styles from "./photo.module.css";
import startbtn from "./img/start_button.png";

function Twophoto() {
  const [villager, setVillager] = useState(null);

  const fetchVillager = async () => {
    try {
      const response = await axios.get("https://api.nookipedia.com/villagers", {
        headers: {
          "X-API-KEY": "e25f17a9-12b3-4033-8f59-da299adfe32a",
          "Accept-Version": "1.0.0",
        },
      });
      const data = response.data;
      const randomVillager = data[Math.floor(Math.random() * data.length)];
      setVillager(randomVillager);
    } catch (err) {
      console.error("주민 데이터를 불러오지 못했습니다:", err);
    }
  };

  useEffect(() => {
    fetchVillager();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.webcamWrapper}>
        <Webcam
          className={styles.webcam}
          audio={false}
          videoConstraints={{ facingMode: "user" }}
        />

        {villager && (
          <div className={styles.villagerOverlay}>
            <img src={villager.image_url} alt={villager.name} />
            <p>{villager.name}</p>
          </div>
        )}
      </div>
        <br />
      <button className={styles.button}>
        <img src={startbtn} alt="Start" />
      </button>
    </div>
  );
}

export default Twophoto;