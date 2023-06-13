import { VscAccount } from 'react-icons/vsc';
import Image from 'next/image';

type ProfileImageProps = {
    src?: string | null;
    className?: string;
}

export default function ProfileImage({src, className=''}: ProfileImageProps) {
  return (
    <div className={`relative rounded-full h-12 w-12 overflow-hidden ${className}`}>
      {src == null ? 
        <VscAccount className="w-full h-full" /> 
        : 
        <Image
          src={src}
          alt="profile Image"
          fill
          quality={100}
        />
      }
    </div>
  );
}
