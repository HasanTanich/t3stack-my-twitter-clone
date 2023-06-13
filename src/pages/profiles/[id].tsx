import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import ErrorPage from "next/error";
import Link from "next/link";
import IconHoverEffects from "~/components/IconHoverEffects";
import ProfileImage from "~/components/ProfileImage";
import InfiniteTweetList from "~/components/InfiniteTweetList";
import Button from "~/components/Button";

import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { ssgHelper } from "~/server/api/ssgHelper";
import { VscArrowLeft } from "react-icons/vsc";

type ProfilePageProps = {
  id: string;
};

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
}: ProfilePageProps) => {
  const { data: profile } = api.profile.getById.useQuery({ id });

  if (profile == null || profile.name == null) {
    return <ErrorPage statusCode={404} />;
  }

  const trpcUtils = api.useContext();
  const toggleFollow = api.profile.toggleFollow.useMutation({
    onSuccess: ({ addedFollow }) => {
      trpcUtils.profile.getById.setData({ id }, (oldData) => {
        if (oldData == null) return;
        const countModifier = addedFollow ? 1 : -1;

        return {
          ...oldData,
          followersCount: oldData.followersCount + countModifier,
          isFollowing: addedFollow,
        };
      });
    },
  });

  const handleFollowButton = () => {
    toggleFollow.mutate({ userId: id });
  };

  return (
    <>
      <Head>
        <title>{`Twitter Clone ${profile.name}`}</title>
      </Head>

      <header className="sticky top-0 z-50">
        <div className="flex items-center border-b bg-white px-4 py-2">
          <Link href=".." className="mr-2">
            <IconHoverEffects>
              <VscArrowLeft className="h-6 w-6" />
            </IconHoverEffects>
          </Link>
          <ProfileImage src={profile.image} className="flex-shrink-0" />
          <div className="ml-2 flex-grow">
            <h1 className="text-lg font-bold">{profile.name}</h1>
            <div className="text-gray-500">
              {profile.tweetsCount}{" "}
              {getPlural(profile.tweetsCount, "Tweet", "Tweets")} {"- "}
              {profile.followersCount}{" "}
              {getPlural(profile.followersCount, "Followers", "Followers")}{" "}
              {"- "}
              {profile.followsCount} Following
            </div>
          </div>
          <FollowButton
            isFollowing={profile.isFollowing}
            isLoading={toggleFollow.isLoading}
            userId={id}
            onClick={handleFollowButton}
          />
        </div>
        <div className="mb-10 h-52 w-full border-b bg-gray-300"></div>
      </header>
      <main>
        <ProfileTweets userId={id} />
      </main>
    </>
  );
};

type FollowButtonProps = {
  isFollowing: boolean;
  isLoading: boolean;
  userId: string;
  onClick: () => void;
};

function FollowButton({
  isFollowing,
  isLoading,
  userId,
  onClick,
}: FollowButtonProps) {
  const session = useSession();
  if (session.status != "authenticated" || session.data.user.id === userId)
    return null;

  return (
    <Button onClick={onClick} small gray={isFollowing} disabled={isLoading}>
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}

type ProfileTweetsProps = {
  userId: string;
};

function ProfileTweets({ userId }: ProfileTweetsProps) {
  const tweets = api.tweet.infiniteProfileFeed.useInfiniteQuery(
    { userId },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <InfiniteTweetList
      tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
      isError={tweets.isError}
      isLoading={tweets.isLoading}
      hasMore={tweets.hasNextPage}
      fetchNewTweets={tweets.fetchNextPage}
    />
  );
}

const pluralRules = new Intl.PluralRules();
function getPlural(number: number, singular: string, plural: string) {
  return pluralRules.select(number) === "one" ? singular : plural;
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const id = context.params?.id;
  if (id == null) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const ssg = ssgHelper();
  await ssg.profile.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default ProfilePage;
