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

import BidderDashboard from "../pages/dashboard/BidderDashboard";
import SellerDashboard from "../pages/dashboard/SellerDashboard";
import VerifierDashboard from "../pages/dashboard/VerifierDashboard";
import AuctioneerDashboard from "../pages/dashboard/AuctioneerDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";

import AuctioneerAuctions from "../pages/auctioneer/AuctioneerAuctions";
import AuctioneerSchedule from "../pages/auctioneer/AuctioneerSchedule";
import AuctioneerLiveControl from "../pages/auctioneer/AuctioneerLiveControl";
import AuctioneerBidActivity from "../pages/auctioneer/AuctioneerBidActivity";
import AuctioneerResults from "../pages/auctioneer/AuctioneerResults";

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

import SellerDisputes from "../pages/disputes/SellerDisputes";
import AdminDisputes from "../pages/disputes/AdminDisputes";

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
        navigate("/dashboard", {
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

            element: (
              <ProtectedRoute
                allowedRoles={["bidder"]}
              />
            ),

            children: [
              {
                index: true,
                element: <BidderDashboard />,
              },
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

            element: (
              <ProtectedRoute
                allowedRoles={["seller"]}
              />
            ),

            children: [
              {
                index: true,
                element: <SellerDashboard />,
              },
            ],
          },

          /* =================================================
             SELLER DISPUTES
             ================================================= */

          {
            path: "/dashboard/seller/disputes",

            element: (
              <ProtectedRoute
                allowedRoles={["seller"]}
              />
            ),

            children: [
              {
                index: true,
                element: <SellerDisputes />,
              },
            ],
          },

          /* =================================================
             VERIFIER DASHBOARD
             ================================================= */

          {
            path: "/dashboard/verifier",

            element: (
              <ProtectedRoute
                allowedRoles={["verifier"]}
              />
            ),

            children: [
              {
                index: true,
                element: <VerifierDashboard />,
              },
            ],
          },

          /* =================================================
             AUCTIONEER DASHBOARD
             ================================================= */

          {
            path: "/dashboard/auctioneer",

            element: (
              <ProtectedRoute
                allowedRoles={["auctioneer"]}
              />
            ),

            children: [
              {
                index: true,
                element: <AuctioneerDashboard />,
              },
            ],
          },

          /* =================================================
             AUCTIONEER AUCTIONS
             ================================================= */

          {
            path: "/auctioneer/auctions",

            element: (
              <ProtectedRoute
                allowedRoles={["auctioneer"]}
              />
            ),

            children: [
              {
                index: true,
                element: <AuctioneerAuctions />,
              },
            ],
          },

          /* =================================================
             AUCTIONEER SCHEDULE
             ================================================= */

          {
            path: "/auctioneer/schedule",

            element: (
              <ProtectedRoute
                allowedRoles={["auctioneer"]}
              />
            ),

            children: [
              {
                index: true,
                element: <AuctioneerSchedule />,
              },
            ],
          },

          /* =================================================
             AUCTIONEER LIVE CONTROL
             ================================================= */

          {
            path: "/auctioneer/live",

            element: (
              <ProtectedRoute
                allowedRoles={["auctioneer"]}
              />
            ),

            children: [
              {
                index: true,
                element: <AuctioneerLiveControl />,
              },
            ],
          },

          /* =================================================
             AUCTIONEER BID ACTIVITY
             ================================================= */

          {
            path: "/auctioneer/activity",

            element: (
              <ProtectedRoute
                allowedRoles={["auctioneer"]}
              />
            ),

            children: [
              {
                index: true,
                element: <AuctioneerBidActivity />,
              },
            ],
          },

          /* =================================================
             AUCTIONEER RESULTS
             ================================================= */

          {
            path: "/auctioneer/results",

            element: (
              <ProtectedRoute
                allowedRoles={["auctioneer"]}
              />
            ),

            children: [
              {
                index: true,
                element: <AuctioneerResults />,
              },
            ],
          },

          /* =================================================
             ADMIN DASHBOARD
             ================================================= */

          {
            path: "/dashboard/admin",

            element: (
              <ProtectedRoute
                allowedRoles={["admin"]}
              />
            ),

            children: [
              {
                index: true,
                element: <AdminDashboard />,
              },
            ],
          },

          /* =================================================
             ADMIN DISPUTES
             ================================================= */

          {
            path: "/dashboard/admin/disputes",

            element: (
              <ProtectedRoute
                allowedRoles={["admin"]}
              />
            ),

            children: [
              {
                index: true,
                element: <AdminDisputes />,
              },
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

          /* =================================================
             VERIFICATION QUEUE
             ================================================= */

          {
            path: "/verification/queue",

            element: (
              <ProtectedRoute
                allowedRoles={["verifier"]}
              />
            ),

            children: [
              {
                element: (
                  <PermissionRoute
                    permission="verification.queue.view"
                  />
                ),

                children: [
                  {
                    index: true,
                    element: <VerificationQueue />,
                  },
                ],
              },
            ],
          },

          /* =================================================
             VERIFICATION REQUEST DETAIL
             ================================================= */

          {
            path: "/verification/requests/:id",

            element: (
              <ProtectedRoute
                allowedRoles={["verifier"]}
              />
            ),

            children: [
              {
                element: (
                  <PermissionRoute
                    permission="verification.queue.view"
                  />
                ),

                children: [
                  {
                    index: true,
                    element: <VerificationRequest />,
                  },
                ],
              },
            ],
          },

          /* =================================================
             VERIFICATION SCHEDULE
             ================================================= */

          {
            path: "/verification/requests/:id/schedule",

            element: (
              <ProtectedRoute
                allowedRoles={["verifier"]}
              />
            ),

            children: [
              {
                element: (
                  <PermissionRoute
                    permission="verification.queue.view"
                  />
                ),

                children: [
                  {
                    index: true,
                    element: <VerificationSchedule />,
                  },
                ],
              },
            ],
          },

          /* =================================================
             VERIFICATION COMPLETE
             ================================================= */

          {
            path: "/verification/requests/:id/complete",

            element: (
              <ProtectedRoute
                allowedRoles={["verifier"]}
              />
            ),

            children: [
              {
                element: (
                  <PermissionRoute
                    permission="verification.queue.view"
                  />
                ),

                children: [
                  {
                    index: true,
                    element: <VerificationComplete />,
                  },
                ],
              },
            ],
          },

          /* =================================================
             SCHEDULED VERIFICATION VISITS
             ================================================= */

          {
            path: "/verification/scheduled",

            element: (
              <ProtectedRoute
                allowedRoles={["verifier"]}
              />
            ),

            children: [
              {
                index: true,
                element: <VerificationScheduled />,
              },
            ],
          },

          /* =================================================
             COMPLETED VERIFICATION WORK
             ================================================= */

          {
            path: "/verification/completed",

            element: (
              <ProtectedRoute
                allowedRoles={["verifier"]}
              />
            ),

            children: [
              {
                index: true,
                element: <VerificationCompleted />,
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