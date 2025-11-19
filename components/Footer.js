"use client";

import Link from "next/link";

export default function Footer() {
  const footerLinks = [
    { name: "हमारे बारे में", href: "/hamare-bare-mein" },
    { name: "सहयोग करें", href: "/sahyog-karen" },
    { name: "आपकी राय", href: "/aapki-raay" },
    { name: "संपर्क करें", href: "/sampark-karen" },
  ];

  return (
    <footer className="bg-cyan-500 text-black mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4">
          {/* LINE 1 */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
            {footerLinks.map((link, index) => (
              <div key={link.href} className="flex items-center gap-4">
                <Link
                  href={link.href}
                  className="hover:text-black transition-colors duration-300"
                >
                  {link.name}
                </Link>
                {index < footerLinks.length - 1 && <span>|</span>}
              </div>
            ))}

            <span>|</span>
            <p>© {new Date().getFullYear()} सर्वाधिकार सुरक्षित</p>
          </div>

          {/* LINE 2 */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
            <span>वेब डेवलपर:</span>
            <a
              href="https://www.web-developer-kp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-700 transition-colors duration-300"
            >
              क्रिएटिव सॉल्यूशंस
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
