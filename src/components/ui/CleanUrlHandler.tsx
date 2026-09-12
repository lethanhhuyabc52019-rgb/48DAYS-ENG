"use client";

import { useEffect } from "react";

/**
 * CleanUrlHandler removes annoying tracking query params (like Facebook's ?fbclid=...
 * or Google's ?gclid=... or UTM tags) from the browser address bar immediately
 * upon page load, keeping the URL short, clean, and professional.
 */
export function CleanUrlHandler() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const url = new URL(window.location.href);
      const trackingParams = [
        "fbclid",
        "gclid",
        "dclid",
        "msclkid",
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
      ];

      let modified = false;
      trackingParams.forEach((param) => {
        if (url.searchParams.has(param)) {
          url.searchParams.delete(param);
          modified = true;
        }
      });

      if (modified) {
        const cleanUrl =
          url.pathname + (url.search ? url.search : "") + url.hash;
        window.history.replaceState(null, "", cleanUrl);
      }
    } catch {
      // Ignore if URL parsing fails
    }
  }, []);

  return null;
}
