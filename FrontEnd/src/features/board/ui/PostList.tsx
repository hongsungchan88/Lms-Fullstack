import { boardQueries } from '@/entities/board';
import { PostCard } from '@/features/board';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

export default function PostList() {
  const params = useParams();
  const lectureId = params.id ? parseInt(params.id) : undefined;
  const { data: postList } = useSuspenseQuery(boardQueries.postList(lectureId));
  return (
    <div className="space-y-4">
      {postList.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
