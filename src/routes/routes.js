// routes.js
import { Navigate } from "react-router-dom";
import Users from "../pages/Users/Users";
import Vendors from "../pages/Vendors/Vendors";
import Login from "../pages/Login/Login";
import Admins from "../pages/Admins/Admins";
import Events from "../pages/Events/Events";
// import Subscriptions from "../pages/Subscriptions/Subscriptions";
import Payments from "../pages/Payments/Payments";
import EventCategories from "../pages/EventCategories/EventCategories";
import VenueFeatures from "../pages/VenueFeatures/VenueFeatures";
import Amenities from "../pages/Amenities/Amenities";
import Banners from "../pages/Banners/Banners";
import Home from "../pages/Home/Home";
import Venues from "../pages/Venues/Venues";
import TokenPoints from "../pages/Tokens/TokenPoints";
import OfflineAddon from "../pages/OfflineAddon/OfflineAddon";
import Addons from "../pages/Addon/Addons";
import Actionables from "../pages/Actionables/Actionables";
import { Properties } from "../pages/Properties/Properties";
import { Team } from "../pages/Team/Team";
import { IndividualPerformance } from "../pages/Individual Perfromance/IndividualPerformance";
import { Plan } from "../pages/Plan/Plan";
import { ProjectDirectory } from "../pages/ProjectDirectory/ProjectDirectory";
import FieldControl from "../pages/FieldControl/FieldControl";


function PrivateRoute({ children }) {
  const auth = localStorage.getItem("token");
  return auth ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const auth = localStorage.getItem("token");
  return !auth ? children : <Navigate to="/" />;
}

const routes = [
  {
    path: "/",
    component: (
      <PrivateRoute>
        <Team/>
      </PrivateRoute>
    ),
    isPrivate: false,
  },
  {
    path: "/login",
    component: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
    isPrivate: false,
  },
  {
    path: "/users",
    component: (
      <PrivateRoute>
        <Users />
      </PrivateRoute>
    ),
    isPrivate: false,
  },
  {
    path: "/vendors",
    component: (
      <PrivateRoute>
        <Vendors />
      </PrivateRoute>
    ),
    isPrivate: false,
  },
  {
    path: "/fieldControl",
    component: (
      <PrivateRoute>
        <FieldControl/>
      </PrivateRoute>
    ),
    isPrivate: false,
  },
  {
    path: "/admins",
    component: (
      <PrivateRoute>
        <Admins />
      </PrivateRoute>
    ),
    isPrivate: false,
  },
  {
    path: "/team",
    component: (
      <PrivateRoute>
        <Team />
      </PrivateRoute>
    ),
    isPrivate: false,
  },
  {
    path: "/properties",
    component: (
      <PrivateRoute>
        <Properties />
      </PrivateRoute>
    ),
    isPrivate: false,
  },
  {
    path: "/individualPerformance",
    component: (
      <PrivateRoute>
        <IndividualPerformance/>
      </PrivateRoute>
    ),
    isPrivate: false,
  },
  {
    path: "/plan",
    component: (
      <PrivateRoute>
        <Plan/>
      </PrivateRoute>
    ),
    isPrivate: false,
  },
  {
    path: "/projectDirectory",
    component: (
      <PrivateRoute>
        <ProjectDirectory/>
      </PrivateRoute>
    ),
    isPrivate: false,
  },
  // {
  //   path: "/subscriptions",
  //   component: (
  //     <PrivateRoute>
  //       <Subscriptions />
  //     </PrivateRoute>
  //   ),
  //   isPrivate: false,
  // },
  {
    path: "/payments",
    component: (
      <PrivateRoute>
        <Payments />
      </PrivateRoute>
    ),
    isPrivate: false,
  },
  {
    path: "/token-points",
    component: (
      <PrivateRoute>
        <TokenPoints />
      </PrivateRoute>
    ),
    isPrivate: false,
  },
  {
    path: "/event-categories",
    component: (
      <PrivateRoute>
        <EventCategories />
      </PrivateRoute>
    ),
    isPrivate: false,
  },
  {
    path: "/venue-features",
    component: (
      <PrivateRoute>
        <VenueFeatures />
      </PrivateRoute>
    ),
    isPrivate: false,
  },
  {
    path: "/amenities",
    component: (
      <PrivateRoute>
        <Amenities />
      </PrivateRoute>
    ),
    isPrivate: false,
  },
  {
    path: "/banners",
    component: (
      <PrivateRoute>
        <Banners />
      </PrivateRoute>
    ),
    isPrivate: false,
  },
  {
    path: "/addons",
    component: (
      <PrivateRoute>
        <Addons />
      </PrivateRoute>
    ),
    isPrivate: false,
  },
  {
    path: "/offline-addon",
    component: (
      <PrivateRoute>
        <OfflineAddon />
      </PrivateRoute>
    ),
    isPrivate: false,
  },
  {
    path: "/admin-actionables",
    component: (
      <PrivateRoute>
        <Actionables />
      </PrivateRoute>
    ),
    isPrivate: false,
  },
];

export default routes;
