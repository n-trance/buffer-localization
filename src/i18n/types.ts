/**
 * Central map of all translation keys by namespace.
 * Keys follow the pattern feature.section.key (namespace is the feature).
 * Keep in sync with public/locales/{lng}/*.json
 */
export const TranslationKeys = {
  common: {
    language: null,
    languages: {
      en: null,
      de: null,
      fr: null,
      ja: null,
      ar: null,
    },
  },
  home: {
    intro: {
      title: null,
      description: null,
      descriptionBefore: null,
      descriptionMiddle: null,
      descriptionAfter: null,
      templates: null,
      learning: null,
      center: null,
    },
    ctas: {
      deploy: null,
      documentation: null,
    },
    images: {
      nextLogo: null,
      vercelLogo: null,
    },
  },
  layout: {
    title: null,
    description: null,
  },
  journey: {
    nav: { cta: null },
    hero: { title: null, subtitle: null, cta: null },
    about: { heading: null, body: null, link: null, dateLabel: null },
    stats: {
      heading: null,
      body: null,
      countriesLabel: null,
      citiesLabel: null,
      timezonesLabel: null,
      link: null,
    },
    values: {
      heading: null,
      card1Title: null,
      card1Desc: null,
      card2Title: null,
      card2Desc: null,
      card3Title: null,
      card3Desc: null,
      card4Title: null,
      card4Desc: null,
      card5Title: null,
      card5Desc: null,
      card6Title: null,
      card6Desc: null,
    },
    team: { heading: null, body: null },
    perks: {
      heading: null,
      card1Title: null,
      card1Desc: null,
      card2Title: null,
      card2Desc: null,
      card3Title: null,
      card3Desc: null,
      card4Title: null,
      card4Desc: null,
      card5Title: null,
      card5Desc: null,
      card6Title: null,
      card6Desc: null,
    },
    roles: {
      heading: null,
      engineering: null,
      roleTitle: null,
      apply: null,
      emailHeading: null,
      emailPlaceholder: null,
      emailButton: null,
    },
    footer: {
      featuresTitle: null,
      toolsTitle: null,
      resourcesTitle: null,
      supportTitle: null,
      linkCreate: null,
      linkPublish: null,
      linkCommunity: null,
      linkAnalyze: null,
      linkCollaborate: null,
      linkAIAssistant: null,
      linkStartPage: null,
      linkIntegrations: null,
      linkIOSApp: null,
      linkAndroidApp: null,
      linkBrowserExtension: null,
      linkBlog: null,
      linkTemplateLibrary: null,
      linkSocialMediaInsights: null,
      linkResourceLibrary: null,
      linkGlossary: null,
      linkFreeTools: null,
      linkAIPostGenerator: null,
      linkCompare: null,
      linkOurCommunity: null,
      linkHelpCenter: null,
      linkStatus: null,
    },
  },
  job: {
    backLink: null,
    hero: { title: null, subtitle: null },
    details: {
      heading: null,
      locationLabel: null,
      location: null,
      employmentTypeLabel: null,
      employmentType: null,
      departmentLabel: null,
      department: null,
      compensationLabel: null,
      compensation: null,
      compensationIntro: null,
      bullet1: null,
      bullet2: null,
      bullet3: null,
      bullet4: null,
      readMore: null,
    },
    aboutBuffer: { heading: null, body: null },
    aboutRole: { heading: null, body: null },
    whatYoullDo: { heading: null, item1: null, item2: null, item3: null, item4: null, item5: null, item6: null },
    skills: { heading: null, item1: null, item2: null, item3: null, item4: null, item5: null, item6: null, item7: null, item8: null, item9: null },
    techStack: { heading: null, item1: null, item2: null, item3: null, item4: null },
    interview: { heading: null, step1: null, step2: null, step3: null, step4: null, step5: null, step6: null, step7: null },
    perksHeading: null,
    perks: { item1: null, item2: null, item3: null, item4: null, item5: null, item6: null, item7: null, item8: null, item9: null },
  },
} as const;

type NestedKeyOf<Obj, Prefix extends string = ""> = Obj extends object
  ? {
      [K in keyof Obj]: K extends string
        ? Obj[K] extends object
          ? Obj[K] extends { [k: string]: null }
            ? `${Prefix}${K}` | NestedKeyOf<Obj[K], `${Prefix}${K}.`>
            : `${Prefix}${K}` | NestedKeyOf<Obj[K], `${Prefix}${K}.`>
          : `${Prefix}${K}`
        : never;
    }[keyof Obj] extends infer D
    ? D extends string
      ? D
      : never
    : never
  : never;

/** Dot-notation key for a single namespace, e.g. "home.intro.title" */
export type TranslationKey = NestedKeyOf<typeof TranslationKeys>;

/** Extract namespace (first segment) from a key */
export type NamespaceOf<K extends string> = K extends `${infer NS}.${string}`
  ? NS
  : "common";

import type { ReactNode } from "react";

export type InterpolationOptions = Record<string, string | number | boolean | ReactNode>;

export type TypedT = (
  key: TranslationKey,
  options?: InterpolationOptions & { count?: number }
) => string;
