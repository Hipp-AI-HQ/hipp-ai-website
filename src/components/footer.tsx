const links = [
  {
    group: "Product",
    items: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    group: "Company",
    items: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
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
              AI automation systems that run your business.
            </p>
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
            © 2025 Hipp AI. All rights reserved.
          </span>
          <span className="text-[#b4bcd066] text-[13px]">
            Built for businesses that move fast.
          </span>
        </div>
      </div>
    </footer>
  );
}
