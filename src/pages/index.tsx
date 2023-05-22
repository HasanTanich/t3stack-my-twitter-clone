import { type NextPage } from 'next';
import InfiniteTweetList from '~/components/InfiniteTweetList';
import NewTweetForm from '~/components/NewTweetForm';
import { api } from '~/utils/api';

const Home: NextPage = () => {
  return (
    <>
      <header className="sticky top-0 z-10 p-2 bg-white border-b">
        <h1 className="px-4 mb-2 text-lg font-bold">Home</h1>
      </header>

      <NewTweetForm />
      <RecentTweets />
    </>
  );
};

function RecentTweets() {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
    {},
    {getNextPageParam: (lastPage)=> lastPage.nextCursor}
  );
  
  return (
    <InfiniteTweetList
      tweets={tweets.data?.pages.flatMap((page)=> page.tweets)}
      isError={tweets.isError}
      isLoading={tweets.isLoading}
      hasMore={tweets.hasNextPage}
      fetchNewTweets={tweets.fetchNextPage}
    />
  );
}

export default Home;