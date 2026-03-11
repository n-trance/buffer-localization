/**
 * Type-safe CSS module declarations.
 * Ensures styles.typo and missing keys are caught by TypeScript.
 */

declare module "@/app/page.module.css" {
  const classes: {
    page: string;
    main: string;
    section: string;
    sectionInner: string;
    sectionTitle: string;
    sectionBody: string;
    hero: string;
    heroInner: string;
    heroTitle: string;
    heroSubtitle: string;
    heroCta: string;
    heroCtaIcon: string;
    statRow: string;
    statCard: string;
    statIcon: string;
    statIconOrange: string;
    statIconGreen: string;
    statIconPurple: string;
    statLabel: string;
    statsCta: string;
    statsCtaIcon: string;
    valuesGrid: string;
    valueCard: string;
    valueCardIcon: string;
    valueCardIconBg1: string;
    valueCardIconBg2: string;
    valueCardIconBg3: string;
    valueCardIconBg4: string;
    valueCardIconBg5: string;
    valueCardIconBg6: string;
    valueCardTitle: string;
    valueCardText: string;
    perksGrid: string;
    perkCard: string;
    perkCardIcon: string;
    perkCardTitle: string;
    perkCardDesc: string;
    rolesBlock: string;
    roleTitle: string;
    rolesApply: string;
    rolesApplyIcon: string;
    emailRow: string;
    emailInput: string;
    emailButton: string;
    footer: string;
    footerGrid: string;
    footerColumn: string;
    footerColumnTitle: string;
    footerLinks: string;
    footerLink: string;
    sectionLink: string;
    footerBlock: string;
  };
  export default classes;
}

declare module "@/app/journey/[slug]/page.module.css" {
  const classes: {
    page: string;
    main: string;
    backLink: string;
    hero: string;
    heroTitle: string;
    heroSubtitle: string;
    heroCta: string;
    detailsCard: string;
    detailsHeading: string;
    detailsRow: string;
    detailsLabel: string;
    detailsValue: string;
    compensationIntro: string;
    detailsList: string;
    readMore: string;
    backLinkIcon: string;
    secondaryButton: string;
    secondaryButtonIcon: string;
    section: string;
    sectionTitle: string;
    sectionBody: string;
    sectionList: string;
    interviewList: string;
    perksHeading: string;
    perksGrid: string;
    perkItem: string;
    perkIcon: string;
  };
  export default classes;
}

declare module "@/components/Nav.module.css" {
  const classes: {
    nav: string;
    navContent: string;
    navLogo: string;
    navActions: string;
    navCta: string;
  };
  export default classes;
}

declare module "@/components/LanguageSwitcher.module.css" {
  const classes: {
    wrapper: string;
    label: string;
    trigger: string;
    triggerValue: string;
    flag: string;
    icon: string;
    content: string;
    viewport: string;
    item: string;
    itemIndicator: string;
  };
  export default classes;
}

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}
