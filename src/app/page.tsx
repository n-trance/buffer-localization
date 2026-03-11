import { HomeContent } from "@/app/HomeContent";
import styles from "@/app/page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <HomeContent />
      </main>
    </div>
  );
}
