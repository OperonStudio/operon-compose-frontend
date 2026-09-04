/**
 * Shared page padding.
 *
 * The app shell only pads the content area below 768px, so every full-width
 * page supplies its own. They had each picked a different value — 40px here,
 * `32px 40px 64px` there, `0 48px 48px` on API keys, which left that page with
 * no gap at all between the header and the first card. These two constants are
 * the one rhythm.
 *
 * Split layouts that run edge to edge, such as a page with its own sidebar, opt
 * out and pad their panes instead.
 */
export const PAGE_PADDING = "24px 32px 64px";
export const PAGE_PADDING_MOBILE = "20px 16px 48px";

/** Breakpoint above which a page uses its desktop layout. */
export const DESKTOP_QUERY = "@media (min-width: 769px)";
