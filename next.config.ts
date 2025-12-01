import type { NextConfig } from "next";
import nextra from "nextra";

const withNextra = nextra({});

const nextConfig: NextConfig = withNextra({
  turbopack: {
    resolveAlias: {
      "next-mdx-import-source-file": "./src/components/mdx-components.tsx",
    },
  },
});

export default nextConfig;
