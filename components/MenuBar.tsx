"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  BookIcon,
  BookTypeIcon,
  ClockFadingIcon,
  SettingsIcon,
  UsersRoundIcon,
  type LucideIcon,
} from "lucide-react"

interface NavModule {
  name: string
  href: string
  icon: LucideIcon
}

const MODULES: NavModule[] = [
  {
    name: "Dashboard",
    href: "/app",
    icon: BookIcon,
  },
  {
    name: "Write",
    href: "/app/write",
    icon: BookTypeIcon,
  },
  {
    name: "Timeline",
    href: "/app/timeline",
    icon: ClockFadingIcon,
  },
  {
    name: "Characters",
    href: "/app//characters",
    icon: UsersRoundIcon,
  },
  {
    name: "Settings",
    href: "/app/settings",
    icon: SettingsIcon,
  },
]

export default function MenuBar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-5 top-1/2 z-50 flex w-18 -translate-y-1/2 flex-col items-center rounded-2xl border border-zinc-800/80 bg-zinc-950/95 py-3 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-sm">
      {MODULES.map((item) => {
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className="group relative flex w-full flex-col items-center justify-center py-2.5 outline-none transition-colors duration-200"
          >
            <span
              className={`absolute top-1/2 left-0 h-7 w-0.75 -translate-y-1/2 rounded-full transition-all duration-200 ${
                isActive
                  ? "bg-amber-700/90 opacity-100"
                  : "bg-transparent opacity-0 group-hover:bg-zinc-600 group-hover:opacity-60"
              }`}
            />

            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-zinc-800/90 text-zinc-100 shadow-inner"
                  : "bg-transparent text-zinc-500 group-hover:bg-zinc-900/60 group-hover:text-zinc-300"
              }`}
            >
              <item.icon
                size={22}
                strokeWidth={isActive ? 1.75 : 1.5}
                className="transition-transform duration-200 group-hover:scale-[1.04]"
              />
            </div>

            <span
              className={`mt-1.5 text-center text-[10px] leading-none font-medium tracking-wide transition-colors duration-200 ${
                isActive ? "text-zinc-200" : "text-zinc-500 group-hover:text-zinc-400"
              }`}
            >
              {item.name}
            </span>
          </Link>
        )
      })}
    </div>
  )
}