"use client";

import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import { useT } from "@/i18n";
import { fallbackLng, languageDisplay, supportedLngs } from "@/i18n/config";
import { useTranslation } from "react-i18next";
import styles from "@/components/LanguageSwitcher.module.css";

export function LanguageSwitcher() {
  const t = useT();
  const { i18n } = useTranslation();

  const currentValue =
    supportedLngs.find(
      (l) => l === i18n.language || i18n.language.startsWith(`${l}-`)
    ) ?? fallbackLng;

  const currentDisplay = languageDisplay[currentValue];

  return (
    <div className={styles.wrapper}>
      <Label.Root htmlFor="language-select" className={styles.label}>
        {t("common.language")}:
      </Label.Root>
      <Select.Root
        value={currentValue}
        onValueChange={(value) => i18n.changeLanguage(value)}
      >
        <Select.Trigger
          id="language-select"
          className={styles.trigger}
          aria-label={t("common.language")}
        >
          <span className={styles.triggerValue}>
            <span className={styles.flag} aria-hidden>
              {currentDisplay.flag}
            </span>
            <Select.Value />
          </span>
          <Select.Icon className={styles.icon}>
            <span aria-hidden>▼</span>
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className={styles.content} position="popper" sideOffset={4}>
            <Select.Viewport className={styles.viewport}>
              {supportedLngs.map((lng) => {
                const { flag, nativeName } = languageDisplay[lng];
                return (
                  <Select.Item
                    key={lng}
                    value={lng}
                    className={styles.item}
                    textValue={nativeName}
                  >
                    <span className={styles.flag} aria-hidden>
                      {flag}
                    </span>
                    <Select.ItemText>{nativeName}</Select.ItemText>
                    <Select.ItemIndicator className={styles.itemIndicator}>
                      ✓
                    </Select.ItemIndicator>
                  </Select.Item>
                );
              })}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
