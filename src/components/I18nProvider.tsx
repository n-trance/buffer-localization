"use client";

import { isRtl } from "@/i18n/config";
import { useEffect, useState } from "react";

export function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    import("@/i18n")
      .then((m) => m.initI18n())
      .then((i18n) => {
        const updateLangAndDir = () => {
          if (typeof document !== "undefined") {
            const lng = i18n.language;
            document.documentElement.lang = lng;
            document.documentElement.dir = isRtl(lng) ? "rtl" : "ltr";
          }
        };
        updateLangAndDir();
        i18n.on("languageChanged", updateLangAndDir);
        setReady(true);
      });
  }, []);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}
