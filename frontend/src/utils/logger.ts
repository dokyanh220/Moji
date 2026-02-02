/* eslint no-console: ["error", { allow: ["log", "info", "warn"] }] */

const isDev = import.meta.env.DEV;

export const logger = {
  banner() {
    if (!isDev) return;

    const v = import.meta.env.VITE_APP_VERSION
      ? `v${import.meta.env.VITE_APP_VERSION}`
      : '';

    console.log(
      `\n%cDO KY ANH ${v} 🚀`,
      `
        color:#22d3ee;
        background:#020617;
        font-size:1.6rem;
        padding:0.3rem 0.6rem;
        margin: 1rem auto;
        font-family: monospace;
        border: 2px solid #22d3ee;
        border-radius: 8px;
        font-weight: bold;
        text-shadow: 0 0 8px #22d3ee88;
      `
    );

    console.log(
      `%cGitHub: dokyanh220\n%cEmail: kyanhdubo2107@gmail.com`,
      "color:#a5f3fc; font-weight:bold; font-family: monospace;",
      "color:#e5e7eb; font-family: monospace;"
    );
  },

  info(title: string, msg: string) {
    if (!isDev) return;
    console.log(
      `%c${title}\n%c${msg}`,
      "font-weight:bold; color:#22d3ee; text-decoration: underline;",
      "color:#e5e7eb;"
    );
  },

  success(title: string, msg: string) {
    if (!isDev) return;
    console.log(
      `%c${title}\n%c${msg}`,
      "font-weight:bold; color:#22c55e;",
      "color:#bbf7d0;"
    );
  },

  warn(title: string, msg: string) {
    if (!isDev) return;
    console.warn(
      `%c${title}\n%c${msg}`,
      "font-weight:bold; color:#facc15;",
      "color:#fde68a;"
    );
  },

  error(title: string, msg: string, stack?: any) {
    if (!isDev) return;
    console.log(
      `%c${title}\n%c${msg}`,
      "font-weight:bold; color:#ef4444;",
      "color:#fecaca;"
    );
    if (stack) console.warn(stack);
  },
};
