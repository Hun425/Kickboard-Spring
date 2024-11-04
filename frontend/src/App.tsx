import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';

import { useAuthStore } from './store/authStore';
import PhoneScreenContainer from './components/phoneScreenContainer';
import Login from './pages/collector/login';
import CollectList from './pages/collector/collectList';
import Header from './components/basic/Header';
import Navbar from './components/basic/Navbar';
import AdminMainPage from './pages/admin/AdminMainPage';
import AdminInfoPage from './pages/admin/AdminInfoPage';
import AdminMapPage from './pages/admin/AdminMap';
import AccountManagePage from './pages/admin/AccountManage';
import AdminLoginPage from './pages/admin/AdminLogin';
import ReportPage from './pages/user/ReportPage';
import ReportListPage from './pages/user/ReportListPage';
import NoticePage from './pages/user/NoticePage';
import MainContainer from './components/MainContainer';

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <Router>
      <Routes>
        <Route
          path="/collectors"
          element={
            <PhoneScreenContainer>
              <Navigate
                to={isLoggedIn ? '/collectlist' : '/collector-login'}
                replace
              />
            </PhoneScreenContainer>
          }
        />
        <Route
          path="/collector-login"
          element={
            <PhoneScreenContainer>
              <Login />
            </PhoneScreenContainer>
          }
        />
        <Route
          path="/collectlist"
          element={
            <PhoneScreenContainer>
              <CollectList />
            </PhoneScreenContainer>
          }
        />
        {/* 사용자 페이지 -------------------------------------*/}
        <Route
          path="/"
          element={
            <PhoneScreenContainer>
              <Header />
              <MainContainer>
                <ReportPage />
              </MainContainer>
              <Navbar />
            </PhoneScreenContainer>
          }
        />

        <Route
          path="/list"
          element={
            <PhoneScreenContainer>
              <Header />
              <MainContainer>
                <ReportListPage />
              </MainContainer>
              <Navbar />
            </PhoneScreenContainer>
          }
        />

        <Route
          path="/notice"
          element={
            <PhoneScreenContainer>
              <Header />
              <MainContainer>
                <NoticePage />
              </MainContainer>
              <Navbar />
            </PhoneScreenContainer>
          }
        />
        {/* 사용자 페이지 -------------------------------------*/}
        <Route path="/adminMainPage" element={<AdminMainPage />} />
        <Route path="/admininfo" element={<AdminInfoPage />} />
        <Route path="/adminmap" element={<AdminMapPage />} />
        <Route path="/accountmanage" element={<AccountManagePage />} />
        <Route path="/adminlogin" element={<AdminLoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
