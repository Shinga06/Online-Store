import { ZodType } from "zod";
// Compatibility patch for TanStack Start Plugin using Zod v4 prefault in a Zod v3 environment
if (ZodType && !(ZodType.prototype as any).prefault) {
  (ZodType.prototype as any).prefault = function (val: any) {
    return this.default(val);
  };
}

import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  cloudflare: false,
  vite: {
    plugins: [
      nitro({
        preset: "vercel",
      }),
    ],
  },
});
