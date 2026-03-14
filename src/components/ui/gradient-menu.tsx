import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  IoHomeOutline,
  IoPersonOutline,
  IoCodeSlashOutline,
  IoFlashOutline,
  IoBriefcaseOutline,
  IoSchoolOutline,
  IoChatbubbleOutline,
} from 'react-icons/io5';

const navItems = [
  { label: 'Home',       path: '/',           icon: <IoHomeOutline /> },
  { label: 'About',      path: '/about',       icon: <IoPersonOutline /> },
  { label: 'Projects',   path: '/projects',    icon: <IoCodeSlashOutline /> },
  { label: 'Skills',     path: '/skills',      icon: <IoFlashOutline /> },
  { label: 'Experience', path: '/experience',  icon: <IoBriefcaseOutline /> },
  { label: 'Education',  path: '/education',   icon: <IoSchoolOutline /> },
  { label: 'Contact',    path: '/contact',     icon: <IoChatbubbleOutline /> },
];

// Site theme: cyan → secondary-blue (matches --primary and --secondary in index.css)
const GRADIENT_FROM = '#00f0ff'; // hsl(187,100%,50%)
const GRADIENT_TO   = '#0ea5d4'; // hsl(195,80%,46%)

export default function GradientMenu() {
  const location = useLocation();

  return (
    <ul className="flex items-center gap-2">
      {navItems.map(({ label, path, icon }) => {
        const isActive = location.pathname === path;
        return (
          <li key={path} className="relative">
            <Link
              to={path}
              style={
                {
                  '--gradient-from': GRADIENT_FROM,
                  '--gradient-to': GRADIENT_TO,
                } as React.CSSProperties
              }
              className={`
                relative flex items-center justify-center
                h-[42px] rounded-full
                transition-all duration-500 ease-in-out
                overflow-hidden cursor-pointer
                ${isActive
                  ? 'w-[120px] shadow-none'
                  : 'w-[42px] bg-white/10 shadow-md hover:w-[120px] hover:shadow-none'}
                group
              `}
            >
              {/* Gradient background — visible when active or hovered */}
              <span
                className={`
                  absolute inset-0 rounded-full
                  bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))]
                  transition-opacity duration-500
                  ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                `}
              />

              {/* Glow */}
              <span
                className={`
                  absolute top-[6px] inset-x-0 h-full rounded-full
                  bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))]
                  blur-[12px] -z-10
                  transition-opacity duration-500
                  ${isActive ? 'opacity-40' : 'opacity-0 group-hover:opacity-40'}
                `}
              />

              {/* Icon — collapses when pill expands */}
              <span
                className={`
                  relative z-10 text-xl
                  transition-all duration-300
                  ${isActive
                    ? 'scale-0 w-0 opacity-0'
                    : 'text-muted-foreground group-hover:scale-0 group-hover:w-0 group-hover:opacity-0'}
                `}
              >
                {icon}
              </span>

              {/* Label — appears when expanded */}
              <span
                className={`
                  absolute z-10 font-semibold uppercase tracking-wider text-xs
                  transition-all duration-300 whitespace-nowrap delay-100
                  ${isActive
                    ? 'scale-100 opacity-100 text-black'
                    : 'scale-0 opacity-0 text-black group-hover:scale-100 group-hover:opacity-100'}
                `}
              >
                {label}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
