'use client';
import { NAV_ITEMS } from '@/lib/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import SearchCommand from './SearchCommand';

const NavItems = ({ initialStocks }: { initialStocks: StockWithWatchlistStatus[] }) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <ul className='flex md:items-center flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium'>
      {NAV_ITEMS.map(({ label, href, icon }) => {
        if (href === '/search' ) {
          return (
            <li key='search-trigger'>
              <SearchCommand
                label={'Search...'} 
                initialStocks={initialStocks}
              />
            </li>
          )
        }
        return (
          <li key={label}>
            <Link
              className={`hover:text-yellow-500 transition-colors flex items-center gap-2 ${
                isActive(href) ? 'text-gray-100' : 'text-gray-400'
              }`}
              href={href}
            >
              {icon && React.createElement(icon)} {label}
            </Link>
          </li>
        );
      })}
    </ul>
  )
}

export default NavItems