import type React from "react";

// Allow the <rdf-icon> custom element (used by the Icon component) in JSX/TS.
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "rdf-icon": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & { name?: string };
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "rdf-icon": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & { name?: string };
    }
  }
}

export {};
