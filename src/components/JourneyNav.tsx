"use client";

import { useT } from "@/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import styles from "@/components/Nav.module.css";
import Link from "next/link";

export function JourneyNav() {
  const t = useT();

  return (
    <header className={styles.nav}>
      <div className={styles.navContent}>
        <Link href="/" className={styles.navLogo} aria-label="Home">
          Journey
        </Link>
        <div className={styles.navActions}>
          <LanguageSwitcher />
          <Link href="/journey/senior-engineer-growth" className={styles.navCta}>
            {t("journey.nav.cta")}
          </Link>
        </div>
      </div>
    </header>
  );
}
