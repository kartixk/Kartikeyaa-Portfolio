'use client';

import Link from 'next/link';
import { ComponentProps, MouseEvent } from 'react';
import { useRouteTransition } from '@/components/RouteTransition';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

/** Drop-in <Link> that routes through the page-wipe transition. */
export const TransitionLink = ({ href, onClick, children, ...rest }: Props) => {
  const { go } = useRouteTransition();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    const modified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
    const external = /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
    if (modified || external || rest.target === '_blank') return;
    e.preventDefault();
    go(href);
  };

  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
};

export default TransitionLink;
