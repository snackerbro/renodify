// A template re-mounts on every navigation (unlike layout), so the entrance
// animation replays page-to-page. Wraps only the page content; the header,
// footer and bottom nav live in the layout and stay put.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-transition">{children}</div>;
}
