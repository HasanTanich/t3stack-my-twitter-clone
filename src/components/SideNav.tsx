import Image from 'next/image';
import Link from 'next/link';
import Logo from '../assets/logo.png';
import ProfileImage from './ProfileImage';
import IconHoverEffects from './IconHoverEffects';

import { useSession, signIn, signOut } from 'next-auth/react';
import { VscHome, VscAccount, VscSignIn, VscSignOut } from 'react-icons/vsc';

export default function SideNav() {

  const session = useSession();
  const user = session.data?.user;

  return (
    <nav className="sticky top-0 min-h-screen px-2 py-4">
      <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
        <li>
          <Link href="/">
            <Image
              src={Logo}
              alt='logo'
              width={70}
              height={70}
              priority={true}
            />
          </Link>
        </li>
        <li>
          <Link href="/">
            <IconHoverEffects>
              <span className="flex items-center gap-4">
                <VscHome className="w-8 h-8"/>
                <span className="hidden text-lg md:inline">
                  Home
                </span>
              </span>
            </IconHoverEffects>
          </Link>
        </li>
        {user != null &&
          <li>
            <Link href={`/profiles/${user.id}`}>
              <IconHoverEffects>
                <span className="flex items-center gap-4">
                  <VscAccount className="w-8 h-8"/>
                  <span className="hidden text-lg md:inline">
                    Profile
                  </span>
                </span>
              </IconHoverEffects>
            </Link>
          </li>
        }
        <li>
          <button
            onClick={user != null ? () => void signOut() : () => void signIn()}
          >
            <IconHoverEffects>
              <span className="flex items-center gap-4">
                {user != null ? 
                  <>
                    <VscSignOut className="w-8 h-8 fill-red-700"/>
                    <span className="hidden text-lg text-red-700 md:inline">
                      Sign Out
                    </span>
                  </> : 
                  <>
                    <VscSignIn className="w-8 h-8 fill-green-700"/>
                    <span className="hidden text-lg text-green-700 md:inline">
                      Sign In
                    </span>
                  </>
                }
              </span>
            </IconHoverEffects>
          </button>
        </li>
        
        {user != null &&
          <div className="flex items-center self-stretch mt-52">
            <ProfileImage src={user.image}/>
            <h1 className="hidden ml-2 md:inline">{user.name}</h1>
          </div>
        }
      </ul>
    </nav>
  );
}
