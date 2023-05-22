import { type ReactNode } from 'react';

type IconHoverEffectsProps = {
  children: ReactNode;
  red?: boolean;
}

export default function IconHoverEffects({children, red=false} : IconHoverEffectsProps) {

  const colorClasses = red ? 'hover:bg-red-200 outline-red-400 group-hover-bg-red-200 group-focus-visible:bg-red-200 focus-visible:bg-red-200' : 
    'hover:bg-gray-200 outline-gray-400 group-hover-bg-gray-200 group-focus-visible:bg-gray-200 focus-visible:bg-gray-200';

  return (
    <div className={`rounded-full p-2 transition-colors duration-200 ${colorClasses}`}>
      {children}
    </div>
  );
}
