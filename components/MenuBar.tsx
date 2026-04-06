"use client"
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BookIcon, LucideIcon } from "lucide-react";
import { 
    BookTypeIcon,
    ClockFadingIcon,
    SettingsIcon,

 } from "lucide-react";

interface NavModule {
    name: string;
    href: string;
    icon: LucideIcon;
}



const MODULES: NavModule[] = [
    {
        name: 'Dashboard',
        href: '/',
        icon: BookIcon,
    },
    {
        name: 'Write',
        href: '/write',
        icon: BookTypeIcon,
    },
    {
        name: 'timeline',
        href: '/timeline',
        icon: ClockFadingIcon,
    },
    {
        name: 'Settings',
        href: '/settings',
        icon: SettingsIcon,
    },
]

export default function MenuBar() {
  const pathname = usePathname();
  

    return (
        <div  className='z-100 absolute top-1/2 -translate-y-1/2 flex flex-col items-center w-min h-min  border-b border-neutral-800 bg-neutral-900 rounded-full ml-5'>
            {MODULES.map((item, i) => {

                const isActive = pathname === item.href;

                
                return (
                        <Link
                            href={item.href}
                            key={item.href}
                            className={`flex flex-col m-5 items-center justify-center w-18 h-18 rounded-full cursor-pointer transition-all border shadow-md ${isActive ? 'bg-neutral-700 border-neutral-600 text-neutral-200' : 'bg-transparent border-neutral-700 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600'
                                }`}
                        >
                            <item.icon size={25} className='mb-1' />
                            <p className='text-[10px] leading-tight font-medium text-center wrap-break-word w-full '>{item.name}</p>
                        </Link>
                    );

            })}
        </div>
    );
}