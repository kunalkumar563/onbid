import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";

import LoginPage from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import Home from "../pages/home/Home";
import Unauthorized from "../pages/errors/Unauthorized";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import PermissionRoute from "../components/auth/PermissionRoute";


import BidderOverview from "../pages/dashboard/bidder/Overview";
import BidderAuctions from "../pages/dashboard/bidder/LiveAuctions";
import BidderMyBids from "../pages/dashboard/bidder/MyBids";
import BidderWonAuctions from "../pages/dashboard/bidder/WonAuctions";
import BidderWatchlist from "../pages/dashboard/bidder/Watchlist";
import BidderOrders from "../pages/dashboard/bidder/Orders";
import BidderTransactions from "../pages/dashboard/bidder/Transactions";
import BidderKYC from "../pages/dashboard/bidder/KYC";
import BidderMessages from "../pages/dashboard/bidder/Messages";
import BidderPayouts from "../pages/dashboard/bidder/Payouts";
import BidderAccount from "../pages/dashboard/bidder/MyAccount";
import BidderSettings from "../pages/dashboard/bidder/Settings";


import SellerOverview from "../pages/dashboard/seller/Overview";
import SellerListings from "../pages/dashboard/seller/MyListings";
import SellerVerification from "../pages/dashboard/seller/Verification";
import SellerAuctions from "../pages/dashboard/seller/MyAuctions";
import SellerOrders from "../pages/dashboard/seller/Orders";
import SellerDisputes from "../pages/dashboard/seller/Disputes";
import SellerMessages from "../pages/dashboard/seller/Messages";
import SellerPayouts from "../pages/dashboard/seller/Payouts";
import SellerSettings from "../pages/dashboard/seller/Settings";




import VerifierOverview from "../pages/dashboard/verifier/Overview";
import VerifierQueue from "../pages/dashboard/verifier/VerificationQueue";
import VerifierDetail from "../pages/dashboard/verifier/VerificationDetail";
import VerifierScheduled from "../pages/dashboard/verifier/Scheduled";
import VerifierCompleted from "../pages/dashboard/verifier/Completed";
import VerifierRejections from "../pages/dashboard/verifier/Rejections";
import VerifierReports from "../pages/dashboard/verifier/Reports";
import VerifierMessages from "../pages/dashboard/verifier/Messages";
import VerifierSettings from "../pages/dashboard/verifier/Settings";


import AuctOverview from "../pages/dashboard/auctioneer/Overview";
import AuctAuctions from "../pages/dashboard/auctioneer/Auctions";
import AuctCreate from "../pages/dashboard/auctioneer/CreateAuction";
import AuctSchedule from "../pages/dashboard/auctioneer/Schedule";
import AuctLiveControl from "../pages/dashboard/auctioneer/LiveControl";
import AuctBidActivity from "../pages/dashboard/auctioneer/BidActivity";
import AuctResults from "../pages/dashboard/auctioneer/Results";
import AuctUsers from "../pages/dashboard/auctioneer/Users";
import AuctOrders from "../pages/dashboard/auctioneer/Orders";
import AuctTransactions from "../pages/dashboard/auctioneer/Transactions";
import AuctDisputes from "../pages/dashboard/auctioneer/Disputes";
import AuctMessages from "../pages/dashboard/auctioneer/Messages";
import AuctPayouts from "../pages/dashboard/auctioneer/Payouts";
import AuctAccount from "../pages/dashboard/auctioneer/MyAccount";
import AuctSettings from "../pages/dashboard/auctioneer/Settings";


import AdminOverview from "../pages/dashboard/admin/Overview";
import AdminUsers from "../pages/dashboard/admin/Users";
import AdminAuctions from "../pages/dashboard/admin/Auctions";
import AdminVerification from "../pages/dashboard/admin/Verification";
import AdminTransactions from "../pages/dashboard/admin/Transactions";
import AdminOrders from "../pages/dashboard/admin/Orders";
import AdminDisputes from "../pages/dashboard/admin/Disputes";
import AdminReports from "../pages/dashboard/admin/Reports";
import AdminMessages from "../pages/dashboard/admin/Messages";
import AdminSettings from "../pages/dashboard/admin/Settings";



import VerificationQueue from "../pages/verification/VerificationQueue";
import VerificationRequest from "../pages/verification/VerificationRequest";
import VerificationSchedule from "../pages/verification/VerificationSchedule";
import VerificationComplete from "../pages/verification/VerificationComplete";
import VerificationScheduled from "../pages/verification/VerificationScheduled";
import VerificationCompleted from "../pages/verification/VerificationCompleted";

/* demo remove later */
import DemoDashboard from "../pages/demo/DemoDashboard";

import MyListings from "../pages/listings/MyListings";
import CreateListing from "../pages/listings/CreateListing";
import ListingDetail from "../pages/listings/ListingDetail";
import EditListing from "../pages/listings/EditListing";

import MyBids from "../pages/bidding/MyBids";
import Wishlist from "../pages/bidding/Wishlist";
import Transactions from "../pages/bidding/Transactions";
import EntryPayment from "../pages/bidding/EntryPayment";
import Delivery from "../pages/bidding/Delivery";

import AuctionList from "../pages/auctions/AuctionList";
import AuctionDetail from "../pages/auctions/AuctionDetail";
import CategoryDashboard from "../pages/auctions/CategoryDashboard";



import Profile from "../pages/profile/Profile";

import { useAuth } from "../context/AuthContext";
import { getDashboardPath } from "../config/dashboard";

function AuthLayout() {
  return <Outlet />;
}

function LoginRoute() {
  const navigate = useNavigate();

  return (
    <LoginPage
      onForgot={() => navigate("/forgot-password")}
      onSignup={() => navigate("/signup")}
      onSuccess={() =>
        navigate("/", {
          replace: true,
        })
      }
    />
  );
}

function SignupRoute() {
  const navigate = useNavigate();

  return (
    <Signup
      onBack={() => navigate("/login")}
    />
  );
}

function ForgotPasswordRoute() {
  const navigate = useNavigate();

  return (
    <ForgotPassword
      onBack={() => navigate("/login")}
      onReset={() =>
        navigate("/reset-password")
      }
    />
  );
}

function ResetPasswordRoute() {
  const navigate = useNavigate();

  return (
    <ResetPassword
      onBack={() => navigate("/login")}
    />
  );
}

function DashboardRedirect() {
  const { role } = useAuth();

  if (!role) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return (
    <Navigate
      to={getDashboardPath(role)}
      replace
    />
  );
}

function NotFoundPage() {
  return (
    <main className="login">
      <div className="login-content">
        <div className="login-brand">
          ONBID
        </div>

        <div className="login-eyebrow">
          PAGE NOT FOUND
        </div>

        <h1>
          Lost in
          <br />
          <em>the auction.</em>
        </h1>

        <p className="login-description">
          The page you're looking for doesn't exist.
        </p>
      </div>
    </main>
  );
}

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,

    children: [
      {
        path: "/demo",
        element: <DemoDashboard />,
      },

      /* =================================================
         PUBLIC ROUTES
         ================================================= */

      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/home",
        element: <Home />,
      },

      {
        path: "/category/:slug",
        element: <CategoryDashboard />,
      },

      {
        path: "/login",
        element: <LoginRoute />,
      },

      {
        path: "/signup",
        element: <SignupRoute />,
      },

      {
        path: "/forgot-password",
        element: <ForgotPasswordRoute />,
      },

      {
        path: "/reset-password",
        element: <ResetPasswordRoute />,
      },

      {
        path: "/unauthorized",
        element: <Unauthorized />,
      },

      /* =================================================
         PROTECTED ROUTES
         ================================================= */

      {
        element: <ProtectedRoute />,

        children: [
          /* =================================================
             DASHBOARD REDIRECT
             ================================================= */

          {
            path: "/dashboard",
            element: <DashboardRedirect />,
          },

          /* =================================================
             PROFILE
             ================================================= */

          {
            path: "/profile",

            element: (
              <ProtectedRoute />
            ),

            children: [
              {
                index: true,
                element: <Profile />,
              },
            ],
          },

          /* =================================================
             BIDDER DASHBOARD
             ================================================= */

          {
            path: "/dashboard/bidder",
            element: <ProtectedRoute allowedRoles={["bidder"]} />,
            children: [
              { index: true, element: <BidderOverview /> },
              { path: "auctions", element: <BidderAuctions /> },
              { path: "my-bids", element: <BidderMyBids /> },
              { path: "won", element: <BidderWonAuctions /> },
              { path: "watchlist", element: <BidderWatchlist /> },
              { path: "orders", element: <BidderOrders /> },
              { path: "transactions", element: <BidderTransactions /> },
              { path: "kyc", element: <BidderKYC /> },
              { path: "messages", element: <BidderMessages /> },
              { path: "payouts", element: <BidderPayouts /> },
              { path: "account", element: <BidderAccount /> },
              { path: "settings", element: <BidderSettings /> }
            ],
          },

          /* =================================================
             MY BIDS
             ================================================= */

          {
            path: "/my-bids",

            element: (
              <ProtectedRoute
                allowedRoles={["bidder"]}
              />
            ),

            children: [
              {
                index: true,
                element: <MyBids />,
              },
            ],
          },

          /* =================================================
             WISHLIST
             ================================================= */

          {
            path: "/wishlist",

            element: (
              <ProtectedRoute
                allowedRoles={["bidder"]}
              />
            ),

            children: [
              {
                index: true,
                element: <Wishlist />,
              },
            ],
          },

          /* =================================================
             TRANSACTIONS
             ================================================= */

          {
            path: "/transactions",

            element: (
              // Widened from ["bidder"] — the backend's /transactions/mine
              // now returns both purchases and sales for the same account
              // (every Onbid account is both buyer and seller by design),
              // so sellers need access to this same page too, not a
              // separate one.
              <ProtectedRoute
                allowedRoles={["bidder", "seller"]}
              />
            ),

            children: [
              {
                index: true,
                element: <Transactions />,
              },
            ],
          },

          /* =================================================
             DELIVERY CONFIRMATION
             (page existed but had no route registered at all —
             see README for the fuller list of similarly orphaned pages)
             ================================================= */

          {
            path: "/delivery/:id",

            element: (
              <ProtectedRoute
                allowedRoles={["bidder", "seller"]}
              />
            ),

            children: [
              {
                index: true,
                element: <Delivery />,
              },
            ],
          },

          /* =================================================
             SELLER DASHBOARD
             ================================================= */

          {
            path: "/dashboard/seller",
            element: <ProtectedRoute allowedRoles={["seller"]} />,
            children: [
              { index: true, element: <SellerOverview /> },
              { path: "listings", element: <SellerListings /> },
              { path: "verification", element: <SellerVerification /> },
              { path: "auctions", element: <SellerAuctions /> },
              { path: "orders", element: <SellerOrders /> },
              { path: "disputes", element: <SellerDisputes /> },
              { path: "messages", element: <SellerMessages /> },
              { path: "payouts", element: <SellerPayouts /> },
              { path: "settings", element: <SellerSettings /> }
            ],
          },



          /* =================================================
             VERIFIER DASHBOARD
             ================================================= */

          {
            path: "/dashboard/verifier",
            element: <ProtectedRoute allowedRoles={["verifier"]} />,
            children: [
              { index: true, element: <VerifierOverview /> },
              { path: "queue", element: <VerifierQueue /> },
              { path: "queue/:id", element: <VerifierDetail /> },
              { path: "scheduled", element: <VerifierScheduled /> },
              { path: "completed", element: <VerifierCompleted /> },
              { path: "rejections", element: <VerifierRejections /> },
              { path: "reports", element: <VerifierReports /> },
              { path: "messages", element: <VerifierMessages /> },
              { path: "settings", element: <VerifierSettings /> }
            ],
          },

          /* =================================================
             AUCTIONEER DASHBOARD
             ================================================= */

          {
            path: "/dashboard/auctioneer",
            element: <ProtectedRoute allowedRoles={["auctioneer"]} />,
            children: [
              { index: true, element: <AuctOverview /> },
              { path: "auctions", element: <AuctAuctions /> },
              { path: "auctions/create", element: <AuctCreate /> },
              { path: "schedule", element: <AuctSchedule /> },
              { path: "live", element: <AuctLiveControl /> },
              { path: "activity", element: <AuctBidActivity /> },
              { path: "results", element: <AuctResults /> },
              { path: "users", element: <AuctUsers /> },
              { path: "orders", element: <AuctOrders /> },
              { path: "transactions", element: <AuctTransactions /> },
              { path: "disputes", element: <AuctDisputes /> },
              { path: "messages", element: <AuctMessages /> },
              { path: "payouts", element: <AuctPayouts /> },
              { path: "account", element: <AuctAccount /> },
              { path: "settings", element: <AuctSettings /> }
            ],
          },

          

          

          

          

          

          /* =================================================
             ADMIN DASHBOARD
             ================================================= */

          {
            path: "/dashboard/admin",
            element: <ProtectedRoute allowedRoles={["admin"]} />,
            children: [
              { index: true, element: <AdminOverview /> },
              { path: "users", element: <AdminUsers /> },
              { path: "auctions", element: <AdminAuctions /> },
              { path: "verification", element: <AdminVerification /> },
              { path: "transactions", element: <AdminTransactions /> },
              { path: "orders", element: <AdminOrders /> },
              { path: "disputes", element: <AdminDisputes /> },
              { path: "reports", element: <AdminReports /> },
              { path: "messages", element: <AdminMessages /> },
              { path: "settings", element: <AdminSettings /> }
            ],
          },

          

          /* =================================================
             AUCTIONS
             ================================================= */

          {
            path: "/auctions",

            element: (
              <ProtectedRoute />
            ),

            children: [
              {
                index: true,
                element: <AuctionList />,
              },
            ],
          },

          {
            path: "/auctions/:id",

            element: (
              <ProtectedRoute />
            ),

            children: [
              {
                index: true,
                element: <AuctionDetail />,
              },
            ],
          },

          {
            path: "/auctions/:id/payment",

            element: (
              <ProtectedRoute />
            ),

            children: [
              {
                index: true,
                element: <EntryPayment />,
              },
            ],
          },

          /* =================================================
             SELLER LISTINGS
             ================================================= */

          {
            path: "/my-listings",

            element: (
              <ProtectedRoute
                allowedRoles={["seller"]}
              />
            ),

            children: [
              {
                index: true,
                element: <MyListings />,
              },
            ],
          },

          {
            path: "/listings/create",

            element: (
              <ProtectedRoute
                allowedRoles={["seller"]}
              />
            ),

            children: [
              {
                index: true,
                element: <CreateListing />,
              },
            ],
          },

          {
            path: "/listings/:id",

            element: (
              <ProtectedRoute
                allowedRoles={["seller"]}
              />
            ),

            children: [
              {
                index: true,
                element: <ListingDetail />,
              },
            ],
          },

          {
            path: "/listings/:id/edit",

            element: (
              <ProtectedRoute
                allowedRoles={["seller"]}
              />
            ),

            children: [
              {
                index: true,
                element: <EditListing />,
              },
            ],
          },

          
        ],
      },

      /* =================================================
         404
         ================================================= */

      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);