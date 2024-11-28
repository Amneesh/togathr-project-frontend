import { useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useParams,
} from "react-router-dom";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { HomePage } from "./pages/HomePage";
import { PageNotFound } from "./pages/PageNotFound";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { RefreshHandler } from "./pages/RefreshHandler";
import EmailInvitationForm from "./components/EmailInvitationForm";
// import { GuestInvitation} from './pages/GuestInvitation';
import { JoinWorkspace } from "./components/JoinWorkspace";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import { TaskList } from "./components/TaskList";
import { EventDetail } from "./components/EventDetail";
import { SnackbarProvider } from "../src/components/SnackbarContext";
import LandingPage from "./pages/LandingPage";
import GuestManagementMain from "./components/GuestManagementMain";
import VendorPortal from "./pages/VendorPortal";
import VendorsLogin from "./pages/VendorsLogin";
import VendorSignUp from "./pages/VendorSignUp";

function App() {
  const clientId =
    "737842778541-4ilk4u91vail53glqfpt3kkaslmndcon.apps.googleusercontent.com";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVendorAuthenticated, setIsVendorAuthenticated] = useState(false);
  // const [eventID, setEventID] = useState();

  const GoogleAuthWrapper = ({ children }) => {
    return (
      <GoogleOAuthProvider clientId={clientId}>
        {children}
      </GoogleOAuthProvider>
    );
  };
  const PrivateRouter = ({ element }) => {
    const token = localStorage.getItem("user-info");
    return token ? element : <Navigate to="/login" />;
  };
  
  function getWorkspaceId() {
    const url = new URL(window.location.href);
    const pathParts = url.pathname.split("/");
    const workspaceId = pathParts[pathParts.length - 1];
    return workspaceId;
  }
  const eventIdToJoinWorkspace = getWorkspaceId();

 
  const PrivateRouterWorkSpace = ({ element }) => {
    const token = localStorage.getItem("user-info");
    return token ? element : <Navigate to="/login?workspace" />;
  };


  return (
    <SnackbarProvider>
      <BrowserRouter>
        <RefreshHandler setIsAuthenticated={setIsAuthenticated} setIsVendorAuthenticated={setIsVendorAuthenticated} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <GoogleAuthWrapper>
                <Login />
              </GoogleAuthWrapper>
            }
          />
          <Route path="/vendor-portal" element={<VendorPortal />} />
          <Route
            path="/vendor-login"
            element={
              <GoogleAuthWrapper>
                <VendorsLogin />
              </GoogleAuthWrapper>
            }
          />
          <Route path="/landingPage" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/vendor-signup" element={<VendorSignUp />} />
          <Route path="/logout" element={<Navigate to="/landingPage" />} />

          <Route
            path="/home"
            element={<PrivateRouter element={<HomePage />} />}
          />

          {/* <Route path="/home" element={<HomePage />} /> */}
          <Route path="/homePage" element={<Navigate to="/home" />} />

          <Route path="*" element={<PageNotFound />} />
          <Route
            path="/invitation-response"
            element={<EmailInvitationForm />}
          />
          {/*  <Route path="/vendorTest" element={<VendorText />} />*/}

          <Route path="/guestManagenent" element={<GuestManagementMain />} />
          <Route path="/task-list" element={<TaskList />} />
          <Route path="/event-detail" element={<EventDetail />} />
          <Route
            path="/join-workspace/:workspaceLink"
            element={<PrivateRouterWorkSpace element={<JoinWorkspace />} />}
          />
          <Route
            path="/joinWorkspace"
            element={<JoinWorkspace eventID={eventIdToJoinWorkspace} />}
          />
        </Routes>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
