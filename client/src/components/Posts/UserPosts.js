import { useEffect, Fragment } from 'react';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { useOutletContext } from 'react-router-dom';

import axios from '../../utils/axios';

import Spinner from '../Spinner';
import Post from './Post';
import Repost from './Repost';

import useInView from '../../hooks/useInView';
import { API_BASE_URL } from '../../utils/config';

const UserPosts = () => {
  const { userId } = useOutletContext();
  const queryClient = useQueryClient();
  const { inView: lastPostInView, ref } = useInView({
    threshold: 0.2,
  });

  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useInfiniteQuery(
      ['posts', userId],
      async ({ pageParam = 1 }) => {
        try {
          // eslint-disable-next-line prettier/prettier
          const response = await axios.get(`${API_BASE_URL}/api/users/${userId}/posts`, {
              params: {
                page: pageParam,
                limit: 5,
              },
            }
          );
          return response.data;
        } catch (error) {
          return error;
        }
      },
      {
        getNextPageParam: (lastPage) => {
          const { nextPage } = lastPage.info;
          if (nextPage) return nextPage;
          return false;
        },
      }
    );

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries('posts');
    };
  }, [queryClient]);

  useEffect(() => {
    if (lastPostInView && hasNextPage) {
      fetchNextPage();
    }
  }, [lastPostInView, hasNextPage, fetchNextPage]);

  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );

  if (isError) return <div>Something went wrong.</div>;

  return (
    <div className="pb-8">
      {data.pages[0].info.total === 0 && (
        <div>
          <h1 className="text-lg text-on-surface font-bold">
            This user doesn&apos;t have any posts yet.
          </h1>
        </div>
      )}
      {data.pages.map((group, i) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={i}>
            {group.results.map((post) =>
              post.post ? (
                <Repost key={`${post.id}${post.post.id}`} repost={post} />
              ) : (
                <Post post={post} key={post.id} />
              )
            )}
          </Fragment>
        );
      })}
      {hasNextPage && (
        <div ref={ref} className="h-2 text-center">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default UserPosts;
