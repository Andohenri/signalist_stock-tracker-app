'use client';
import { NAV_ITEMS } from '@/lib/contants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const NavItems = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <ul className='flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium'>
      {NAV_ITEMS.map(({ label, href }) => (
        <li key={label}>
          <Link className={`hover:text-yellow-500 transition-colors ${isActive(href) ? 'text-gray-100' : '*:'}`} href={href}>{label}</Link>
        </li>
      ))}
    </ul>
  )
}

export default NavItems