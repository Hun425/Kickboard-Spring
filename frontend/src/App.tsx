import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
<<<<<<< HEAD

import { useAuthStore } from './store/authStore';
=======
import './index.css';
// 핸드폰 사이즈 조절
>>>>>>> frontend
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
<<<<<<< HEAD
=======
import MainContainer from './components/MainContainer';
import ReportMapPage from './pages/user/ReportMapPage';
import MainContainer1 from './components/MainContainer1';
import InfoWritePage from './pages/admin/InfoWrite';
import InfoEditPage from './pages/admin/InfoEdit';
import AccountSignUp from './pages/admin/AccountSignUp';
import CompanyIdMagage from './pages/admin/CompanyIdManage';
import AdminIdManage from './pages/admin/AdminIdManage';
import ReportPage1 from './pages/user/ReportPage1';
import ReportMapPage1 from './pages/user/ReportMapPage1';
>>>>>>> frontend

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
              <ReportPage />
              <Navbar />
            </PhoneScreenContainer>
          }
        />

        <Route
          path="/list"
          element={
            <PhoneScreenContainer>
              <Header />
              <ReportListPage />
              <Navbar />
            </PhoneScreenContainer>
          }
        />

        <Route
          path="/notice"
          element={
            <PhoneScreenContainer>
              <Header />
              <NoticePage />
              <Navbar />
            </PhoneScreenContainer>
          }
        />
<<<<<<< HEAD
=======

        <Route
          path="/map"
          element={
            <PhoneScreenContainer>
              <Header />
              <MainContainer1>
                <ReportMapPage />
              </MainContainer1>
            </PhoneScreenContainer>
          }
        />

        <Route
          path="/list/:id/map"
          element={
            <PhoneScreenContainer>
              <Header />
              <MainContainer1>
                <ReportMapPage1 />
              </MainContainer1>
            </PhoneScreenContainer>
          }
        />
>>>>>>> frontend
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
