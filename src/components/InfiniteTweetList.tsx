import Link from 'next/link';
import ProfileImage from './ProfileImage';
import InfiniteScroll from 'react-infinite-scroll-component';
import { VscHeart, VscHeartFilled } from 'react-icons/vsc';
import { useSession } from 'next-auth/react';
import IconHoverEffects from './IconHoverEffects';
import { api } from '~/utils/api';
import { LoadingSpinner } from './LoadingSpinner';

type Tweet = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  user: {
    image: string | null;
    id: string;
    name: string | null;
  };
  likedByMe: boolean;
}

type InfiniteTweetListProps = {
  tweets?: Tweet[];
  isError: boolean;
  isLoading: boolean;
  hasMore?: boolean;
  fetchNewTweets: ()=> Promise<unknown>;
}

export default function InfiniteTweetList(
  {tweets, isError, isLoading, hasMore = false, fetchNewTweets }: InfiniteTweetListProps
) {
  if(isLoading) return <LoadingSpinner />;
  if(isError)return <h1>Log in to see tweets</h1>;

  if(tweets == null || tweets.length === 0){
    return <h2 className="my-4 text-2xl text-center text-gray-500">No Tweets</h2>;
  }

  return (
    <ul>
      <InfiniteScroll
        dataLength={tweets.length}
        next={fetchNewTweets}
        hasMore={hasMore}
        loader={<LoadingSpinner />}
      >
        {tweets.map(tweet=> (
          <TweetCard key={tweet.id} {...tweet}/>
        ))}
      </InfiniteScroll>
    </ul>
  );
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'short',
});

function TweetCard({id, user, content, createdAt, likeCount, likedByMe}: Tweet){
  
  const trpcUtils = api.useContext();
  const toggleLike = api.tweet.toggleLike.useMutation({
    onSuccess: ({ addedLike })=> {
      const updateData : Parameters<typeof trpcUtils.tweet.infiniteFeed.setInfiniteData>[1] = (oldData) => {
        if(oldData == null) return;
        const countModifier = addedLike ? 1 : -1;

        return {
          ...oldData,
          pages: oldData.pages.map(page=> {
            return {
              ...page,
              tweets: page.tweets.map(tweet => {
                if(tweet.id === id){
                  return {
                    ...tweet,
                    likeCount: tweet.likeCount + countModifier,
                    likedByMe: addedLike
                  };
                }
                
                return tweet;
              })
            };
          })
        };
      };
      // invalidate data
      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, updateData); // Recent tweets feed
      trpcUtils.tweet.infiniteFeed.setInfiniteData({onlyFollowing: true}, updateData); // Only follwing feed
      trpcUtils.tweet.infiniteProfileFeed.setInfiniteData({userId: user.id}, updateData); // User profile feed
    }
  });

  const handleToggleLike = ()=> {
    toggleLike.mutate({ id });
  };

  return <li className="flex gap-4 p-4 border-b-2">
    <Link href={`/profiles/${user.id}`}>
      <ProfileImage src={user.image}/>
    </Link>
    <div className="flex flex-col flex-grow">
      <div className="flex gap-1">
        <Link 
          href={`/profiles/${user.id}`} 
          className="font-bold outline-none hover:underline focus-visible:underline"
        >
          {user.name}
        </Link>
        <span className="text-gray-500">-</span>
        <span className="text-gray-500">
          {dateTimeFormatter.format(createdAt)}
        </span>
      </div>
      <p className="whitespace-pre-wrap">
        {content}
      </p>
      <HeartButton
        likedByMe={likedByMe}
        likeCount={likeCount}
        onClick={handleToggleLike}
        isLoading={toggleLike.isLoading}
      />
    </div>
  </li>;
}

type HeartButtonProps = {
  likedByMe: boolean;
  likeCount: number;
  isLoading: boolean;
  onClick: () => void;
}

function HeartButton({likedByMe, likeCount, onClick, isLoading}: HeartButtonProps){
  const HeartIcon = likedByMe ? VscHeartFilled : VscHeart;
  const session = useSession();

  if(session.status != 'authenticated') {
    return (
      <div className="flex items-center self-start gap-3 mt-1 mb-1 text-gray-500">
        <HeartIcon />
        <span>{likeCount}</span>
      </div>
    );
  }
  return (
    <button
      disabled={isLoading}
      className={`group flex items-center gap-1 self-start transition-colors -ml-2 duration-200 ${likedByMe ? 'text-red-500' : 'text-gray-500 hover:text-red-500 focus-visible:text-red-500'}`}
      onClick={onClick}
    >
      <IconHoverEffects red={true}>
        <HeartIcon />
      </IconHoverEffects>
      <span>{likeCount}</span>
    </button>
  );
}