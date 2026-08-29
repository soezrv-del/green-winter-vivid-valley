import type { CapacitorConfig } from "@capacitor/cli";

/**
 * RVFAX iOS shell (Capacitor → Xcode → TestFlight)
 *
 * Before syncing on your Mac:
 *   export CAP_SERVER_URL="https://YOUR-LIVE-APP.vercel.app"
 *   npm run cap:sync
 *   npm run cap:open
 *
 * Without CAP_SERVER_URL the WebView shows a local shell (no live APIs).
 * Chat, voice, VIN, ZIP tax, OSRM need the hosted app + Cloudflare worker.
 */
const serverUrl = process.env.CAP_SERVER_URL?.trim().replace(/\/$/, "");

const config: CapacitorConfig = {
  appId: "com.markclass.rvfax",
  appName: "RVFAX",
  webDir: "cap-www",
  backgroundColor: "#050508",
  loggingBehavior: "production",
  ios: {
    // never = we own safe-area in CSS. "automatic" inset the WKWebView and
    // pushed the fixed/flex dock under the home indicator in Xcode builds.
    contentInset: "never",
    preferredContentMode: "mobile",
    scheme: "RVFAX",
    allowsLinkPreview: false,
    // The suite scrolls inside .rv-scroll. If the WebView itself can scroll,
    // the dock slides off-screen into the black void on iPhone.
    scrollEnabled: false,
  },
  android: {
    allowMixedContent: false,
    backgroundColor: "#050508",
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: false,
      backgroundColor: "#050508",
      showSpinner: false,
      androidSplashResourceName: "splash",
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#050508",
    },
    Keyboard: {
      resize: "none",
      resizeOnFullScreen: true,
    },
    App: {},
  },
  ...(serverUrl
    ? {
        server: {
          url: serverUrl,
          cleartext: false,
          allowNavigation: [
            serverUrl,
            "https://*.vercel.app",
            "https://*.x.ai",
            "https://api.x.ai",
            "wss://api.x.ai",
            "https://*.workers.dev",
            "https://*.cloudflare.com",
            "https://vpic.nhtsa.dot.gov",
            "https://api.nhtsa.gov",
            "https://nominatim.openstreetmap.org",
            "https://router.project-osrm.org",
          ],
        },
      }
    : {}),
};

export default config;
