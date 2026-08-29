import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { resolveShareHost } from "@/lib/og/shareHost";

export const Route = createRootRoute({
  head: () => {
    const host = resolveShareHost();
    const xBanner = host ? `https://${host}/x-banner.jpg` : undefined;
    return {
      meta: [
        { charSet: "utf-8" },
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, interactive-widget=resizes-content",
        },
        {
          title: "RV Fox · Mark Class Premium",
        },
        {
          name: "description",
          content:
            "RvGrok — professional RV intelligence powered by xAI Grok. Specs, pricing, recalls, financing, and multi-step Agent research.",
        },
        { name: "theme-color", content: "#050505" },
        { name: "color-scheme", content: "dark" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "black-translucent",
        },
        ...(xBanner
          ? [
              { property: "x:game:image", content: xBanner },
              { property: "x:game:image:width", content: "1200" },
              { property: "x:game:image:height", content: "264" },
            ]
          : []),
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "stylesheet", href: "/dock-visible.css" },
        { rel: "icon", href: "/assets/brand/icon-rvfax.png" },
        { rel: "apple-touch-icon", href: "/assets/brand/icon-rvfax.png" },
      ],
    };
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-white antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var vv=window.visualViewport;var h=Math.min.apply(null,[vv&&vv.height,document.documentElement.clientHeight,window.innerHeight].filter(function(n){return typeof n==="number"&&n>50}));if(h){var r=document.documentElement;r.style.setProperty("--app-height",h+"px");r.style.setProperty("--vv-height",h+"px");}}catch(e){}})();`,
          }}
        />
        {children}
        <Scripts />
      </body>
    </html>
  );
}
