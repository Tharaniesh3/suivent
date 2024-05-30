'use client';
import { headerLinks, headerLinkswithoutsignin } from '@/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
const NavItemsWithoutSignIn = () => {
  const pathname = usePathname();
  return (
    <ul className="md:flex-between flex w-full flex-col items-end gap-5 md:flex-row">
      {headerLinkswithoutsignin.map((link) => {
        const isActive = pathname === link.route;
        return (
          <li
            key={link.route}
            className={`${
              isActive && 'text-primary-500'
            } flex-center p-medium-16 whitespace-nowrap`}
          >
            <Link href={link.route}>{link.label}</Link>
          </li>
        )
      })}
    </ul>
  )
}

export default NavItemsWithoutSignIn