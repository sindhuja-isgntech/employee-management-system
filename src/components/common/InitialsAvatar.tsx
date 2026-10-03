import React, { useState } from 'react';
import { cn } from '@/lib/utils';

// Soft background / strong foreground pairs, picked deterministically per name
const AVATAR_COLORS = [
  'bg-sky-100 text-sky-800',
  'bg-blue-100 text-blue-800',
  'bg-sky-100 text-sky-700',
  'bg-blue-100 text-blue-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-sky-100 text-sky-700',
];

const SIZE_CLASSES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-24 w-24 text-3xl',
} as const;

interface InitialsAvatarProps {
  name: string;
  src?: string;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}

const getInitials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || '?';

const getColor = (name: string): string => {
  let hash = 0;
  for (const char of name) hash = (hash + char.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[hash];
};

// Shows the image when it loads, otherwise falls back to colored initials
export const InitialsAvatar: React.FC<InitialsAvatarProps> = ({ name, src, size = 'md', className }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const base = cn('shrink-0 rounded-full ring-2 ring-white', SIZE_CLASSES[size], className);

  if (src && !imageFailed) {
    return <img src={src} alt={name} className={cn(base, 'object-cover')} onError={() => setImageFailed(true)} />;
  }

  return (
    <div className={cn(base, 'flex items-center justify-center font-semibold', getColor(name))} aria-label={name}>
      {getInitials(name)}
    </div>
  );
};

export default InitialsAvatar;
