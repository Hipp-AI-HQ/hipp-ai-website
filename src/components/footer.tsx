const links = [
  {
    group: "Product",
    items: [
      { label: "Lead System", href: "#features" },
      { label: "Intelligence", href: "#how-it-works" },
      { label: "Implementation", href: "#pricing" },
    ],
  },
  {
    group: "Company",
    items: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "tel:+17177027833" },
    ],
  },
  {
    group: "Legal",
    items: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className="relative py-16 overflow-hidden"
      style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="max-w-[1100px] mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-14">
          {/* Logo column */}
          <div>
            <a href="/" className="flex items-center gap-2.5 no-underline mb-4">
              <div className="w-7 h-7 rounded-[7px] bg-[#53FC18] flex items-center justify-center shadow-[0_0_10px_rgba(83,252,24,0.3)]">
                <span
                  className="text-[#000212] font-extrabold text-[11px]"
                  style={{ fontFamily: "var(--font-sora)" }}
                >
                  H
                </span>
              </div>
              <span
                className="text-[#f7f8f8] font-semibold text-[15px] tracking-[-0.01em]"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                Hipp AI
              </span>
            </a>
            <p className="text-[#b4bcd066] text-[13px] leading-[1.6] max-w-[180px]">
              AI automation systems for service businesses.
            </p>
            <a
              href="tel:+17177027833"
              className="mt-5 flex items-center gap-2 no-underline group"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M11.917 9.438v1.625A1.083 1.083 0 0 1 10.786 12.1a10.646 10.646 0 0 1-4.638-1.65A10.483 10.483 0 0 1 2.94 7.242a10.646 10.646 0 0 1-1.65-4.659A1.083 1.083 0 0 1 2.37 1.5H3.99a1.083 1.083 0 0 1 1.083.933c.069.542.195 1.076.379 1.59a1.083 1.083 0 0 1-.244 1.143l-.683.683a8.667 8.667 0 0 0 3.25 3.25l.683-.683a1.083 1.083 0 0 1 1.144-.244c.513.184 1.047.31 1.589.379a1.083 1.083 0 0 1 .926 1.099Z"
                  stroke="#53FC18"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[#53FC18] text-[13px] group-hover:opacity-80 transition-opacity duration-150">
                +1 (717) 702-7833
              </span>
            </a>
          </div>

          {/* Link columns */}
          {links.map((group) => (
            <div key={group.group}>
              <div className="text-[#f7f8f8] text-[13px] font-medium mb-4">
                {group.group}
              </div>
              <ul className="space-y-3">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-[#b4bcd066] text-[13px] hover:text-[#b4bcd0] transition-colors duration-150 no-underline"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="text-[#b4bcd066] text-[13px]">
            © 2026 Hipp AI. All rights reserved.
          </span>
          <span className="text-[#b4bcd066] text-[13px]">
            Built for businesses that move fast.
          </span>
        </div>
      </div>
    </footer>
  );
}
