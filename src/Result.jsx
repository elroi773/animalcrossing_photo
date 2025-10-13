import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Result.module.css";

export default function Result() {
	const location = useLocation();
	const navigate = useNavigate();

	const villager = location.state?.villager;
	const images = location.state?.images;
	const cuts = location.state?.cuts;

	if (!villager || !images || !cuts) {
		return (
			<div className={styles.container}>
				<p>촬영 정보를 찾을 수 없습니다.</p>
				<button onClick={() => navigate("/")} className={styles.homeButton}>
					홈으로
				</button>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<div className={styles.resultWrapper}>
				<h1 className={styles.title}>촬영 완료!</h1>

				<div className={styles.imageGrid}>
					{images.map((image, index) => (
						<div key={index} className={styles.imageItem}>
							<img 
								src={image} 
								alt={`촬영 ${index + 1}`} 
								className={styles.photo}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}