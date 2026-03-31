declare module "next-pwa" {
  import type { NextConfig } from "next";

  type WithPWAOptions = {
    dest: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    fallbacks?: {
      document?: string;
    };
  };

  export default function withPWAInit(options: WithPWAOptions): (config: NextConfig) => NextConfig;
}
