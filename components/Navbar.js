"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "होम", href: "/" },
    { name: "जयपुर", href: "/jaipur" },
    { name: "नगर-डगर", href: "/nagar-dagar" },    
    { name: "दुनिया-जहान", href: "/duniya-jahan" },
    { name: "फोटो फीचर", href: "/photo-feature" },
    { name: "खेल संसार", href: "/khel-sansar" },
    { name: "Sangopang English", href: "/english" },
  ];

  return (
    <nav className="bg-zinc-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            <Link href="/">
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={150}
                height={50}
                className="object-contain drop-shadow-2xl"
                style={{
                  filter:
                    "drop-shadow(0 10px 15px rgba(0,0,0,0.5)) drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
                }}
              />
            </Link>
          </div>

          <h1
            className="text-center text-pink-600 text-6xl font-black tracking-wide"
            style={{
              textShadow:
                "4px 4px 8px rgba(0,0,0,0.7), 2px 2px 4px rgba(0,0,0,0.5), 0 0 30px rgba(236,72,153,0.4)",
              fontWeight: "900",
              WebkitTextStroke: "1px rgba(0,0,0,0.2)",
            }}
          >
            सांगोपांग
          </h1>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {isOpen && (
            <ul className="space-y-2 text-sm">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block py-2 hover:text-pink-500 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
