// 킥보드 브레이커
import { useEffect, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import BlueButton from '../../components/BlueButton';
import { collectorLogin } from '../../services/Api';
import kickboardCollector from '../../assets/kickboard_collector.webp';
import { useCollectorAuthStore } from '../../store/CollectorAuthStore';
import { useNavigate } from 'react-router-dom';
import CollectList from './CollectListPage';

const CollectorLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useCollectorAuthStore();

  // 로그인 함수
  const onClick = async () => {
    try {
      const response = await collectorLogin(email, password);
      if (response.success) {
        const { accessToken, role, area } = response.data;
        useCollectorAuthStore.getState().setAuthData(accessToken, role, area);
        login();
        navigate('/collectlist');
      } else {
        setErrorMessage(response.error.message);
      }
    } catch (error) {
      console.error('로그인 실패: ', error);
      setErrorMessage(
        '로그인에 실패했습니다. 아이디나 패스워드를 다시 확인해주세요'
      );
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onClick(); // Trigger the login function when Enter key is pressed
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onClick();
  };

  useEffect(() => {
    console.log(CollectList);
  }, [CollectList]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">
      <img
        src={kickboardCollector}
        alt="kickboardcollector"
        className="absolute left-0 top-0 z-0 mb-12 h-full w-full object-cover opacity-30"
      />

      <div className="z-10 mb-12 text-center font-bold text-[#264471]">
        <p className="text-2xl [text-shadow:_1px_1px_2px_white,-1px_-1px_2px_white]">
          수거업체신가요?
        </p>
        <p className="text-2xl [text-shadow:_1px_1px_2px_white,-1px_-1px_2px_white]">
          로그인을 먼저 해주세요.
        </p>
      </div>

      {/* Error message container */}
      {errorMessage && (
        <div className="z-10 mb-4 text-center font-bold text-red-600">
          <div className="mb-4 text-center font-bold text-red-600">
            <span>로그인에 실패했습니다.</span>
            <br />
            <span>아이디나 패스워드를 다시 확인해주세요.</span>
          </div>
        </div>
      )}

      <div className="z-10 flex w-full max-w-xs flex-col items-center rounded-md border border-black bg-[#f9f9f9e0] p-5">
        <div className="w-full sm:max-w-sm">
          <form className="w-full space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-900"
              >
                아이디
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email" // Changed autocomplete to match a generic username
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-gray-900"
                >
                  비밀번호
                </label>
                {/* <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    비밀번호를 잊으셨나요?
                  </a>
                </div> */}
              </div>
              <div className="relative mt-2">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600"
                  aria-label="Toggle password visibility"
                >
                  {!showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" /> // Closed eye icon for "hide"
                  ) : (
                    <EyeIcon className="h-5 w-5" /> // Open eye icon for "show"
                  )}
                </button>
              </div>
            </div>
          </form>

          <div className="z-10 mt-6">
            <BlueButton
              width="100%"
              height="36px"
              text="로그인"
              onClick={onClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectorLoginPage;
