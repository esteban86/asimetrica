/// <reference types="astro/client" />

interface Window {
  // GTM/GA4: cola de eventos. La rellena el snippet de GTM en Layout.astro.
  dataLayer: Record<string, unknown>[];
}
