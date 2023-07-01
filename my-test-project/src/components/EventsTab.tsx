import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios, { AxiosError } from 'axios';
import './components.css';

interface Comment {
  id: number;
  title: string;
  body: string;
}

const postComment = async (comment: Comment): Promise<Comment> => {
  // Симуляція POST-запиту
  return new Promise((resolve) => setTimeout(() => resolve(comment), 500));
};

const EventsTab: React.FC = () => {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');

  const { isLoading, isError, error, data } = useQuery('eventsData', () =>
    axios.get('https://jsonplaceholder.typicode.com/posts').then((res) => res.data)
  );

  const mutation = useMutation(postComment, {
    onSuccess: (newComment: Comment) => {
      queryClient.setQueryData<Comment[]>('eventsData', (oldData = []) => [
        newComment,
        ...oldData
      ]);
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
        {data?.slice(0, 4).map((item: any) => (
          <div key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        ))}
      </div>
      <div className="inputContainer">
        <form onSubmit={handleCommentSubmit}>
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default EventsTab;