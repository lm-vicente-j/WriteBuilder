import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LucideIcon } from "lucide-react";
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
        href: '',
        icon: BookTypeIcon,
    },
    {
        name: 'Write',
        href: 'write',
        icon: BookTypeIcon,
    },
    {
        name: 'timeline',
        href: 'timeline',
        icon: ClockFadingIcon,
    },
    {
        name: 'Settings',
        href: 'settings',
        icon: SettingsIcon,
    },
]

export default function () {
  const pathname = usePathname();

    return (
        <div  className='z-100 absolute top-[20%] flex flex-col items-center w-min h-min bg-white rounded-full ml-5'>
            {MODULES.map((item, i) => {
                const isActive = pathname === item.href;

                return (
                        <Link
                            href={item.href}
                            key={item.href}
                            className={`flex flex-col m-5 items-center justify-center w-18 h-18 rounded-full cursor-pointer transition-all shadow-md ${isActive ? 'bg-orange-400' : 'bg-gray-200'
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