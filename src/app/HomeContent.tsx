"use client";

import styles from "@/app/page.module.css";
import { useT } from "@/i18n";

const VALUE_ICONS = ["📖", "⬆️", "⛵", "💛", "🥛", "🪞"];
const PERK_ICONS = ["💰", "🏝", "🗓", "💪", "🏠", "⛺️"];

export function HomeContent() {
  const t = useT();

  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroInner}>
          <h1 id="hero-title" className={styles.heroTitle}>
            {t("journey.hero.title")}
          </h1>
          <p className={styles.heroSubtitle}>{t("journey.hero.subtitle")}</p>
          <a href="/journey/senior-engineer-growth" className={styles.heroCta}>
            {t("journey.hero.cta")}
            <span className={styles.heroCtaIcon} aria-hidden>↓</span>
          </a>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="intro-description">
        <div className={styles.sectionInner}>
          <p id="intro-description" className={styles.sectionBody}>
            {t("home.intro.description", {
              templates: t("home.intro.templates"),
              learning: t("home.intro.learning"),
            })}
          </p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="about-heading">
        <div className={styles.sectionInner}>
          <h2 id="about-heading" className={styles.sectionTitle}>
            {t("journey.about.heading")}
          </h2>
          <p className={styles.sectionBody}>{t("journey.about.body")}</p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="stats-heading">
        <div className={styles.sectionInner}>
          <h2 id="stats-heading" className={styles.sectionTitle}>
            {t("journey.stats.heading")}
          </h2>
          <p className={styles.sectionBody}>{t("journey.stats.body")}</p>
          <div className={styles.statRow}>
            <div className={styles.statCard}>
              <span className={`${styles.statIcon} ${styles.statIconOrange}`} aria-hidden>22</span>
              <span className={styles.statLabel}>
                {t("journey.stats.countriesLabel")}
              </span>
            </div>
            <div className={styles.statCard}>
              <span className={`${styles.statIcon} ${styles.statIconGreen}`} aria-hidden>🌆</span>
              <span className={styles.statLabel}>{t("journey.stats.citiesLabel")}</span>
            </div>
            <div className={styles.statCard}>
              <span className={`${styles.statIcon} ${styles.statIconPurple}`} aria-hidden>🕐</span>
              <span className={styles.statLabel}>{t("journey.stats.timezonesLabel")}</span>
            </div>
          </div>
          <a href="#" className={styles.statsCta}>
            {t("journey.stats.link")}
            <span className={styles.statsCtaIcon} aria-hidden>→</span>
          </a>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="values-heading">
        <div className={styles.sectionInner}>
          <h2 id="values-heading" className={styles.sectionTitle}>
            {t("journey.values.heading")}
          </h2>
          <div className={styles.valuesGrid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={styles.valueCard}>
                <div className={`${styles.valueCardIcon} ${styles[`valueCardIconBg${i}` as keyof typeof styles]}`}>{VALUE_ICONS[i - 1]}</div>
                <h3 className={styles.valueCardTitle}>
                  {t(`journey.values.card${i}Title` as "journey.values.card1Title")}
                </h3>
                <p className={styles.valueCardText}>
                  {t(`journey.values.card${i}Desc` as "journey.values.card1Desc")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="team-heading">
        <div className={styles.sectionInner}>
          <h2 id="team-heading" className={styles.sectionTitle}>
            {t("journey.team.heading")}
          </h2>
          <p className={styles.sectionBody}>{t("journey.team.body")}</p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="perks-heading">
        <div className={styles.sectionInner}>
          <h2 id="perks-heading" className={styles.sectionTitle}>
            {t("journey.perks.heading")}
          </h2>
          <div className={styles.perksGrid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={styles.perkCard}>
                <div className={styles.perkCardIcon}>{PERK_ICONS[i - 1]}</div>
                <h3 className={styles.perkCardTitle}>
                  {t(`journey.perks.card${i}Title` as "journey.perks.card1Title")}
                </h3>
                <p className={styles.perkCardDesc}>
                  {t(`journey.perks.card${i}Desc` as "journey.perks.card1Desc")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="roles"
        className={styles.section}
        aria-labelledby="roles-heading"
      >
        <div className={styles.sectionInner}>
          <h2 id="roles-heading" className={styles.sectionTitle}>
            {t("journey.roles.heading")}
          </h2>
          <a href="/journey/senior-engineer-growth" className={styles.rolesBlock}>
            <span className={styles.roleTitle}>{t("journey.roles.roleTitle")}</span>
            <span className={styles.rolesApply}>
              {t("journey.roles.apply")}
              <span className={styles.rolesApplyIcon} aria-hidden>→</span>
            </span>
          </a>
          <p className={styles.sectionBody} style={{ marginTop: "1.5rem" }}>
            {t("journey.roles.emailHeading")}
          </p>
          <div className={styles.emailRow}>
            <input
              type="email"
              placeholder={t("journey.roles.emailPlaceholder")}
              className={styles.emailInput}
              aria-label={t("journey.roles.emailPlaceholder")}
            />
            <button type="button" className={styles.emailButton}>
              {t("journey.roles.emailButton")}
            </button>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerColumn}>
            <div className={styles.footerBlock}>
              <h3 className={styles.footerColumnTitle}>
                {t("journey.footer.featuresTitle")}
              </h3>
              <nav className={styles.footerLinks} aria-label="Features">
                <a href="https://buffer.com/product/create" className={styles.footerLink}>{t("journey.footer.linkCreate")}</a>
                <a href="https://buffer.com/product/publish" className={styles.footerLink}>{t("journey.footer.linkPublish")}</a>
                <a href="https://buffer.com/product/community" className={styles.footerLink}>{t("journey.footer.linkCommunity")}</a>
                <a href="https://buffer.com/product/analyze" className={styles.footerLink}>{t("journey.footer.linkAnalyze")}</a>
                <a href="https://buffer.com/product/collaborate" className={styles.footerLink}>{t("journey.footer.linkCollaborate")}</a>
              </nav>
            </div>
            <div className={styles.footerBlock}>
              <h3 className={styles.footerColumnTitle}>
                {t("journey.footer.toolsTitle")}
              </h3>
              <nav className={styles.footerLinks} aria-label="Tools">
                <a href="https://buffer.com/ai-assistant" className={styles.footerLink}>{t("journey.footer.linkAIAssistant")}</a>
                <a href="https://buffer.com/start-page" className={styles.footerLink}>{t("journey.footer.linkStartPage")}</a>
                <a href="https://buffer.com/integrations" className={styles.footerLink}>{t("journey.footer.linkIntegrations")}</a>
                <a href="https://buffer.com/ios" className={styles.footerLink}>{t("journey.footer.linkIOSApp")}</a>
                <a href="https://buffer.com/android" className={styles.footerLink}>{t("journey.footer.linkAndroidApp")}</a>
                <a href="https://buffer.com/extension" className={styles.footerLink}>{t("journey.footer.linkBrowserExtension")}</a>
              </nav>
            </div>
          </div>
          <div className={styles.footerColumn}>
            <div className={styles.footerBlock}>
              <h3 className={styles.footerColumnTitle}>
                {t("journey.footer.resourcesTitle")}
              </h3>
              <nav className={styles.footerLinks} aria-label="Resources">
                <a href="https://buffer.com/resources" className={styles.footerLink}>{t("journey.footer.linkBlog")}</a>
                <a href="https://buffer.com/templates" className={styles.footerLink}>{t("journey.footer.linkTemplateLibrary")}</a>
                <a href="https://buffer.com/state-of-social" className={styles.footerLink}>{t("journey.footer.linkSocialMediaInsights")}</a>
                <a href="https://buffer.com/library" className={styles.footerLink}>{t("journey.footer.linkResourceLibrary")}</a>
                <a href="https://buffer.com/glossary" className={styles.footerLink}>{t("journey.footer.linkGlossary")}</a>
                <a href="https://buffer.com/free-tools" className={styles.footerLink}>{t("journey.footer.linkFreeTools")}</a>
                <a href="https://buffer.com/ai-post-generator" className={styles.footerLink}>{t("journey.footer.linkAIPostGenerator")}</a>
                <a href="https://buffer.com/compare" className={styles.footerLink}>{t("journey.footer.linkCompare")}</a>
                <a href="https://buffer.com/community" className={styles.footerLink}>{t("journey.footer.linkOurCommunity")}</a>
              </nav>
            </div>
            <div className={styles.footerBlock}>
              <h3 className={styles.footerColumnTitle}>
                {t("journey.footer.supportTitle")}
              </h3>
              <nav className={styles.footerLinks} aria-label="Support">
                <a href="https://buffer.com/help" className={styles.footerLink}>{t("journey.footer.linkHelpCenter")}</a>
                <a href="https://status.buffer.com" className={styles.footerLink}>{t("journey.footer.linkStatus")}</a>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
