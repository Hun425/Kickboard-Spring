import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import './index.css'; 
// 핸드폰 사이즈 조절
import PhoneScreenContainer from './components/phoneScreenContainer';

// 수거업체 관련
import ProtectedRoute from './components/ProtectedRoute';
import { useCollectorAuthStore } from './store/CollectorAuthStore';
import CollectorLoginPage from './pages/collector/CollectorLoginPage';
import CollectList from './pages/collector/CollectListPage';

// import AdminMainPage from './pages/admin/adminMainPage';
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
import ReportMapPage from './pages/user/ReportMapPage';
import MainContainer1 from './components/MainContainer1';
import InfoWritePage from './pages/admin/InfoWrite';
import InfoEditPage from './pages/admin/InfoEdit';
import AccountSignUp from './pages/admin/AccountSignUp';
import CompanyIdMagage from './pages/admin/CompanyIdManage';
import AdminIdManage from './pages/admin/AdminIdManage';
import ReportPage1 from './pages/user/ReportPage1';

function App() {
  const isLoggedIn = useCollectorAuthStore((state) => state.isLoggedIn);

  return (
    <Router>
      <Routes>
        {/* 수거업체 관련 */}
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
              <CollectorLoginPage />
            </PhoneScreenContainer>
          }
        />
        <Route
          path="/collectlist"
          element={
            <PhoneScreenContainer>
              <ProtectedRoute>
                <CollectList />
              </ProtectedRoute>
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
          path="/list/:id"
          element={
            <PhoneScreenContainer>
              <Header />
              <MainContainer>
                <ReportPage1 />
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
        {/* 사용자 페이지 -------------------------------------*/}
        <Route path="/adminMainPage" element={<AdminMainPage />} />
        <Route path="/admininfo" element={<AdminInfoPage />} />
        <Route path="/adminmap" element={<AdminMapPage />} />
        <Route path="/accountmanage" element={<AccountManagePage />} />
        <Route path="/adminlogin" element={<AdminLoginPage />} />
        <Route path="/infowrite" element={<InfoWritePage />} />
        <Route path="/infoedit" element={<InfoEditPage />} />
        <Route path="/accountsignup" element={<AccountSignUp />} />
        <Route path="/companyID" element={<CompanyIdMagage />} />
        <Route path="/adminID" element={<AdminIdManage />} />
      </Routes>
    </Router>
  );
}

export default App;
