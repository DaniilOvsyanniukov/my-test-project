import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient, QueryClient, hydrate, dehydrate } from 'react-query';
import axios, { AxiosError } from 'axios';
import './components.css';

interface Comment {
  id: number;
  title: string;
  body: string;
}

const postComment = async (comment: Comment): Promise<Comment> => {
  return new Promise((resolve) => setTimeout(() => resolve(comment), 500));
};

const EventsTab: React.FC = () => {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    // hydrate state from localStorage
    const dehydratedState = localStorage.getItem('queryClientState')
    if (dehydratedState) {
      const state = JSON.parse(dehydratedState);
      hydrate(queryClient, state);
    }
  }, [queryClient])

  useEffect(() => {
    // listen for changes in the queryCache and save them to localStorage
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      const state = dehydrate(queryClient);
      localStorage.setItem('queryClientState', JSON.stringify(state));
    });

    return unsubscribe;
  }, [queryClient]);

  const { isLoading, isError, error, data } = useQuery('eventsData', async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    return response.data.slice(0, 4);
  }, {
    // Enable page caching
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const mutation = useMutation(postComment, {
    onSuccess: (newComment: Comment) => {
      const oldData = queryClient.getQueryData<Comment[]>('eventsData') || [];
      const newData = [newComment, ...oldData];
      queryClient.setQueryData<Comment[]>('eventsData', newData);
    }
  });

  const handleCommentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({ id: Date.now(), title: 'Comment', body: commentText });
    setCommentText('');
  };

  if (isLoading) return <div>Loading...</div>;

  if (isError) {
    const axiosError = error as AxiosError;
    return (
      <div>{`An error has occurred: ${axiosError.response?.data || 'Unknown error'}`}</div>
    );
  }

  return (
    <div>
      <div className="container">
        {data?.map((item: any) => (
          <div key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        ))}
      </div>
        <form onSubmit={handleCommentSubmit} className="inputContainer">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Додайте коментар"
          />
          <button type="submit">Додати</button>
        </form>
    </div>
  );
};

export default EventsTab;