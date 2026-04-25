import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

// Pin the workspace root to this directory. Otherwise Next walks up the tree
// and selects the parent `coalesce-freelance/package-lock.json`, which
// belongs to a different project.
const ROOT = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: ROOT,
  },
};

export default nextConfig;
