import type { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType, NextPage } from 'next';
import Head from 'next/head';
import { ssgHelper } from '~/server/api/ssgHelper';
import { api } from '~/utils/api';
import ErrorPage from 'next/error';
import Link from 'next/link';
import IconHoverEffects from '~/components/IconHoverEffects';
import { VscArrowLeft } from 'react-icons/vsc';
import ProfileImage from '~/components/ProfileImage';

type ProfilePageProps = {
  id: string;
}

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps  >> = ({ id } : ProfilePageProps) => {
  const {data: profile } = api.profile.getById.useQuery({ id });

  if(profile == null || profile.name == null){
    return <ErrorPage statusCode={404}/>;
  }

  return <>
    <Head>
      <title>{`Twitter Clone ${profile.name}`}</title>
    </Head>

    <header className="sticky top-0 z-10 flex items-center border-b bg-white px-4 py-2">
      <Link href=".." className="mr-2">
        <IconHoverEffects>
          <VscArrowLeft className="h-6 w-6" />
        </IconHoverEffects>
      </Link>
      <ProfileImage src={profile.image} className="flex-shrink-0" />
      <div className="ml-2 flex-grow">
        <h1 className="text-lg font-bold">
          {profile.name}
        </h1>
        <div className="text-gray-500">
          {profile.tweetsCount} {' '}
          {getPlural(profile.tweetsCount, 'Tweet', 'Tweets')} -{' '}
          {profile.follwersCount} {' '}
          {getPlural(profile.follwersCount, 'Followers', 'Followers')} -{' '}
          {profile.followsCount} Following
        </div>
        <FollowButton isFollowing={profile.isFollowing} userId={id} onClick={()=> null}/>
      </div>
    </header>
    <main>
        Hello 
    </main>
  </>;
};

type FollowButtonProps = {
  isFollowing: boolean;
  userId: string;
  onClick: () => void;
}

function FollowButton({isFollowing, userId, onClick}: FollowButtonProps){
  return <button onClick={onClick}>
    {isFollowing ? 'Unfollow' : 'Follow'}
  </button>;
}

const pluralRules = new Intl.PluralRules();
function getPlural(number: number, singular: string, plural: string){
  return pluralRules.select(number) === 'one' ? singular : plural;
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking'
  };
};

export async function getStaticProps(context: GetStaticPropsContext<{id: string}>){
  const id = context.params?.id;
  if(id == null){
    return {
      redirect: {
        destination: '/'
      }
    };
  }

  const ssg = ssgHelper();
  await ssg.profile.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    }
  };
}

export default ProfilePage;