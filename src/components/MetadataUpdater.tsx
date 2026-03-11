"use client";

import { useT } from "@/i18n";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

/**
 * Updates document.title and meta description from layout namespace.
 * Runs after mount and whenever language changes.
 */
export function MetadataUpdater() {
  const t = useT();
  const { i18n: i18nInstance } = useTranslation();

  useEffect(() => {
    const title = t("layout.title");
    const description = t("layout.description");
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", description);
    }
  }, [t, i18nInstance.language]);

  return null;
}
