import Image from "next/image";
import Link from "next/link";
import Logo from "../assets/logo.png";
import ProfileImage from "./ProfileImage";
import IconHoverEffects from "./IconHoverEffects";

import { useSession, signIn, signOut } from "next-auth/react";
import {
  VscHome,
  VscAccount,
  VscSignIn,
  VscSignOut,
  VscEllipsis,
} from "react-icons/vsc";
import { Select } from "./Select";

export default function SideNav() {
  const session = useSession();
  const user = session.data?.user;

  return (
    <nav className="z-100 sticky top-0 min-h-screen px-2 py-4">
      <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
        <li>
          <Link href="/">
            <Image
              src={Logo}
              alt="logo"
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
                <VscHome className="h-8 w-8" />
                <span className="hidden text-lg md:inline">Home</span>
              </span>
            </IconHoverEffects>
          </Link>
        </li>
        {user != null && (
          <li>
            <Link href={`/profiles/${user.id}`}>
              <IconHoverEffects>
                <span className="flex items-center gap-4">
                  <VscAccount className="h-8 w-8" />
                  <span className="hidden text-lg md:inline">Profile</span>
                </span>
              </IconHoverEffects>
            </Link>
          </li>
        )}
        <li className="relative">
          <Select
            options={["Connect", "Drafts", "Bookmarks"]}
            className="left-0 top-0"
            dropdowns={[
              { label: "Display", items: ["Light theme", "Dark theme"] },
              {
                label: "Settings and Support",
                items: ["Privacy", "Help Center"],
              },
            ]}
            onClick={() => console.log("heehee")}
          >
            <IconHoverEffects>
              <span className="flex items-center gap-4">
                <>
                  <span className="rounded-full border border-black">
                    <VscEllipsis className="h-8 w-8" />
                  </span>
                  <span className="hidden text-lg md:inline">More</span>
                </>
              </span>
            </IconHoverEffects>
          </Select>
        </li>

        <li>
          <button
            onClick={user != null ? () => void signOut() : () => void signIn()}
          >
            <IconHoverEffects>
              <span className="flex items-center gap-4">
                {user != null ? (
                  <>
                    <VscSignOut className="h-8 w-8 fill-red-700" />
                    <span className="hidden text-lg text-red-700 md:inline">
                      Sign Out
                    </span>
                  </>
                ) : (
                  <>
                    <VscSignIn className="h-8 w-8 fill-green-700" />
                    <span className="hidden text-lg text-green-700 md:inline">
                      Sign In
                    </span>
                  </>
                )}
              </span>
            </IconHoverEffects>
          </button>
        </li>

        {user != null && (
          <div className="mt-8 flex items-center">
            <ProfileImage src={user.image} />
            <h1 className="ml-2 hidden md:inline">{user.name}</h1>
          </div>
        )}
      </ul>
    </nav>
  );
}
