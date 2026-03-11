"use client";

import styles from "@/app/journey/[slug]/page.module.css";
import { useT } from "@/i18n";
import Link from "next/link";

const PERK_ICONS = ["💰", "🏝", "🗓", "💪", "🏠", "⛺️", "💵", "📈", "🍼"];

export function JobPageContent() {
  const t = useT();

  return (
    <main className={styles.main}>
      <Link href="/#roles" className={styles.backLink}>
        {t("job.backLink")}
        <span className={styles.backLinkIcon} aria-hidden>←</span>
      </Link>

      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>{t("job.hero.title")}</h1>
        <p className={styles.heroSubtitle}>{t("job.hero.subtitle")}</p>
      </header>

      <section className={styles.detailsCard}>
        <h2 className={styles.detailsHeading}>{t("job.details.heading")}</h2>
        <div className={styles.detailsRow}>
          <span className={styles.detailsLabel}>
            {t("job.details.locationLabel")}
          </span>
          <span className={styles.detailsValue}>
            {t("job.details.location")}
          </span>
        </div>
        <div className={styles.detailsRow}>
          <span className={styles.detailsLabel}>
            {t("job.details.employmentTypeLabel")}
          </span>
          <span className={styles.detailsValue}>
            {t("job.details.employmentType")}
          </span>
        </div>
        <div className={styles.detailsRow}>
          <span className={styles.detailsLabel}>
            {t("job.details.departmentLabel")}
          </span>
          <span className={styles.detailsValue}>
            {t("job.details.department")}
          </span>
        </div>
        <div className={styles.detailsRow}>
          <span className={styles.detailsLabel}>
            {t("job.details.compensationLabel")}
          </span>
          <span className={styles.detailsValue}>
            {t("job.details.compensation")}
          </span>
        </div>
        <p className={styles.compensationIntro}>
          {t("job.details.compensationIntro")}
        </p>
        <ul className={styles.detailsList}>
          <li>{t("job.details.bullet1")}</li>
          <li>{t("job.details.bullet2")}</li>
          <li>{t("job.details.bullet3")}</li>
          <li>{t("job.details.bullet4")}</li>
        </ul>
        <a href="#" className={styles.secondaryButton}>
          {t("job.details.readMore")}
          <span className={styles.secondaryButtonIcon} aria-hidden>→</span>
        </a>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t("job.aboutBuffer.heading")}</h2>
        <p className={styles.sectionBody}>{t("job.aboutBuffer.body")}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t("job.aboutRole.heading")}</h2>
        <p className={styles.sectionBody}>{t("job.aboutRole.body")}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t("job.whatYoullDo.heading")}</h2>
        <ul className={styles.sectionList}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <li key={i}>
              {t(`job.whatYoullDo.item${i}` as "job.whatYoullDo.item1")}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t("job.skills.heading")}</h2>
        <ul className={styles.sectionList}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <li key={i}>{t(`job.skills.item${i}` as "job.skills.item1")}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t("job.techStack.heading")}</h2>
        <ul className={styles.sectionList}>
          {[1, 2, 3, 4].map((i) => (
            <li key={i}>
              {t(`job.techStack.item${i}` as "job.techStack.item1")}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t("job.interview.heading")}</h2>
        <ul className={styles.interviewList}>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <li key={i} data-step={`${i}.`}>
              {t(`job.interview.step${i}` as "job.interview.step1")}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.perksHeading}>{t("job.perksHeading")}</h2>
        <div className={styles.perksGrid}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className={styles.perkItem}>
              <span className={styles.perkIcon}>{PERK_ICONS[i - 1]}</span>
              <span>{t(`job.perks.item${i}` as "job.perks.item1")}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
