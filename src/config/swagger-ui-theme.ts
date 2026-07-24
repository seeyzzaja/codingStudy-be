const swaggerUiOptions = {
  explorer: true,
  customCssUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js",
  ],
  customCss: `
    :root {
      --docs-bg: #f4f7fb;
      --docs-surface: #ffffff;
      --docs-surface-2: #eef4ff;
      --docs-border: #d7dfeb;
      --docs-text: #14213d;
      --docs-muted: #54657e;
      --docs-accent: #2c7be5;
      --docs-accent-strong: #1c5fd4;
      --docs-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
    }

    body[data-theme="dark"] {
      --docs-bg: #0b1020;
      --docs-surface: #111827;
      --docs-surface-2: #172033;
      --docs-border: #263043;
      --docs-text: #e5eefc;
      --docs-muted: #9eb0cc;
      --docs-accent: #7dd3fc;
      --docs-accent-strong: #38bdf8;
      --docs-shadow: 0 18px 50px rgba(0, 0, 0, 0.4);
    }

    html, body {
      background: var(--docs-bg) !important;
      color: var(--docs-text) !important;
    }

    .swagger-ui {
      color: var(--docs-text);
    }

    .swagger-ui .topbar {
      display: none;
    }

    .swagger-ui .information-container,
    .swagger-ui .scheme-container,
    .swagger-ui .opblock,
    .swagger-ui .model-box,
    .swagger-ui .models,
    .swagger-ui .opblock-summary,
    .swagger-ui .auth-wrapper {
      background: var(--docs-surface) !important;
      border-color: var(--docs-border) !important;
      box-shadow: var(--docs-shadow) !important;
    }

    .swagger-ui .wrapper {
      max-width: 1180px;
    }

    .swagger-ui .information-container {
      border-radius: 24px;
      margin-top: 24px;
      padding: 28px 28px 18px;
    }

    .swagger-ui .info .title,
    .swagger-ui .info .title small {
      color: var(--docs-text) !important;
    }

    .swagger-ui .info .description,
    .swagger-ui .opblock-description-wrapper p,
    .swagger-ui .opblock-summary-description,
    .swagger-ui .parameter__name,
    .swagger-ui .parameter__type,
    .swagger-ui .parameter__in,
    .swagger-ui .response-col_description,
    .swagger-ui .response-col_status,
    .swagger-ui .model,
    .swagger-ui .prop-type,
    .swagger-ui .renderedMarkdown {
      color: var(--docs-muted) !important;
    }

    .swagger-ui .scheme-container {
      border-radius: 20px;
      margin: 20px 0;
      padding: 16px 20px;
    }

    .swagger-ui .btn.authorize,
    .swagger-ui .btn.try-out__btn,
    .swagger-ui .btn.execute {
      border-radius: 12px !important;
    }

    .swagger-ui .opblock {
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 14px;
    }

    .swagger-ui .opblock-summary {
      padding: 10px 14px;
    }

    .swagger-ui .opblock .opblock-summary-method {
      border-radius: 10px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .swagger-ui .opblock.opblock-get .opblock-summary-method {
      background: #3b82f6 !important;
    }

    .swagger-ui .opblock.opblock-post .opblock-summary-method {
      background: #22c55e !important;
    }

    .swagger-ui .opblock.opblock-patch .opblock-summary-method {
      background: #14b8a6 !important;
    }

    .swagger-ui .opblock.opblock-delete .opblock-summary-method {
      background: #ef4444 !important;
    }

    .swagger-ui .opblock-summary-path,
    .swagger-ui .opblock-summary-path__deprecated {
      color: var(--docs-text) !important;
    }

    .swagger-ui .opblock-control-arrow svg,
    .swagger-ui .expand-operation svg {
      fill: var(--docs-muted);
    }

    .swagger-ui .dialog-ux .modal-ux,
    .swagger-ui .modal-ux-content,
    .swagger-ui .modal-ux-header {
      background: var(--docs-surface) !important;
      color: var(--docs-text) !important;
    }

    .swagger-ui .modal-ux-header h3,
    .swagger-ui label,
    .swagger-ui .renderedMarkdown h1,
    .swagger-ui .renderedMarkdown h2,
    .swagger-ui .renderedMarkdown h3,
    .swagger-ui .renderedMarkdown h4,
    .swagger-ui .renderedMarkdown h5 {
      color: var(--docs-text) !important;
    }

    .swagger-ui .information-container::before {
      content: "coding_study";
      display: inline-flex;
      align-items: center;
      padding: 6px 12px;
      border-radius: 999px;
      margin-bottom: 18px;
      background: var(--docs-surface-2);
      color: var(--docs-accent-strong);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    #theme-toggle {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 9999;
      border: 1px solid var(--docs-border);
      background: var(--docs-surface);
      color: var(--docs-text);
      border-radius: 999px;
      padding: 10px 14px;
      font-weight: 700;
      box-shadow: var(--docs-shadow);
      cursor: pointer;
    }

    #theme-toggle:hover {
      border-color: var(--docs-accent);
    }
  `,
  customJsStr: `
    (function () {
      const themeKey = "swagger-ui-theme";

      function applyTheme(theme) {
        document.body.setAttribute("data-theme", theme);
        localStorage.setItem(themeKey, theme);
        const button = document.getElementById("theme-toggle");
        if (button) {
          button.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
        }
      }

      function initToggle() {
        if (document.getElementById("theme-toggle")) return;

        const button = document.createElement("button");
        button.id = "theme-toggle";
        button.type = "button";
        button.addEventListener("click", function () {
          const current = document.body.getAttribute("data-theme") || "light";
          applyTheme(current === "dark" ? "light" : "dark");
        });
        document.body.appendChild(button);

        const savedTheme = localStorage.getItem(themeKey);
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        applyTheme(savedTheme || (prefersDark ? "dark" : "light"));
      }

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initToggle);
      } else {
        initToggle();
      }
    })();
  `,
};

export default swaggerUiOptions;
