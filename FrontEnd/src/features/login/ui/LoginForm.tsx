import {
  LoginButton,
  AutoLoginToggle,
  FindPasswordButton,
  GoToRegisterLink,
  PasswordInput,
  IdInput,
  useLogin,
} from '@features/login';
import { useState } from 'react';

export default function LoginForm() {
  const { handleMutate } = useLogin();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'TEACHER' | 'ADMIN'>('STUDENT');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleMutate({ id, password, role });
  };

  return (
    <form className="flex flex-col w-full">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          역할 선택
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="STUDENT"
              checked={role === 'STUDENT'}
              onChange={(e) => setRole(e.target.value as 'STUDENT' | 'TEACHER' | 'ADMIN')}
              className="mr-2"
            />
            학생
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="TEACHER"
              checked={role === 'TEACHER'}
              onChange={(e) => setRole(e.target.value as 'STUDENT' | 'TEACHER' | 'ADMIN')}
              className="mr-2"
            />
            교사
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="ADMIN"
              checked={role === 'ADMIN'}
              onChange={(e) => setRole(e.target.value as 'STUDENT' | 'TEACHER' | 'ADMIN')}
              className="mr-2"
            />
            관리자
          </label>
        </div>
      </div>
      <IdInput onChange={e => setId(e.target.value)} value={id} />
      <div className="mt-9" />
      <PasswordInput
        onChange={e => setPassword(e.target.value)}
        value={password}
      />
      <div className="flex justify-between items-center mt-8 mb-18">
        <AutoLoginToggle />
        <FindPasswordButton />
      </div>
      <LoginButton onClick={handleSubmit} />
      <div className="mt-5.5 flex justify-center">
        <GoToRegisterLink />
      </div>
    </form>
  );
}
