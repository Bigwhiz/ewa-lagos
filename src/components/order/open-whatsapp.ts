/**
 * Open the WhatsApp link in a new tab. If a popup blocker stops it (some mobile browsers do),
 * fall back to opening it in this tab, so the order is never silently lost.
 */
export function openWhatsApp(url: string) {
  const win = window.open(url, "_blank");
  if (win) win.opener = null; // the new tab can't reach back into our page
  else window.location.href = url;
}
