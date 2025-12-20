import { boardQueries, createPost } from '@/entities/board';
import { useAuth } from '@/entities/user/hooks/useAuth';
import Editor from '@/features/board/ui/Editor';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function PostForm() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const user = useAuth();
  const queryClient = useQueryClient();
  const params = useParams();
  const lectureId = params.id ? parseInt(params.id) : undefined;

  const { mutate } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: boardQueries.postList(lectureId).queryKey,
      });
      setContent('');
      setTitle('');
      setCategory('GENERAL');
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력하세요.');
      return;
    }
    mutate({ 
      title,
      content, 
      authorId: user.id, 
      author: user.nickname,
      lectureId,
      category,
      authorRole: user.role,
    });
  };

  return (
    <form
      className="bg-white rounded-xl shadow-md p-4 mb-6"
      onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mb-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="GENERAL">일반</option>
          <option value="NOTICE">공지사항</option>
          <option value="QNA">Q&A</option>
        </select>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <Editor value={content} onChange={setContent} isEditable />
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        작성하기
      </button>
    </form>
  );
}
