import { lazy, Suspense } from "react";
import {
  createHashRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";

import LoadingScreen from "./screens/LoadingScreen";

const GamePlay = lazy(() => import("./screens/GamePlayScreen"));
const Start = lazy(() => import("./screens/StartScreen"));
const GameOver = lazy(() => import("./screens/GameOverScreen"));

const GamePlayScreen = () => (
  <Suspense fallback={<LoadingScreen />}>
    <GamePlay />
  </Suspense>
);

const StartScreen = () => (
  <Suspense fallback={<LoadingScreen />}>
    <Start />
  </Suspense>
);

const GameOverScreen = () => (
  <Suspense fallback={<LoadingScreen />}>
    <GameOver />
  </Suspense>
);

const Routes: RouteObject[] = [
  {
    path: "/",
    element: <StartScreen />,
  },
  {
    path: "/game",
    element: <GamePlayScreen />,
  },
  {
    path: "/loading",
    element: <LoadingScreen />,
  },
  {
    path: "/game-over",
    element: <GameOverScreen />,
  },
];

const AdminRoleGuardedRoutes: RouteObject[] = [
  //   {
  //     path: "/admin",
  //     element: <SystemSettingsPage />,
  //     errorElement: <ErrorPage />,
  //   },
];

const AuthGuardedRoutes: RouteObject[] = [
  //   {
  //     path: "/home",
  //     element: <HomePage />,
  //     errorElement: <ErrorPage />,
  //   },
];

const Router = () => {
  //   const { admin, authenticated } = useStateStore(
  //     useShallow((state) => ({
  //       admin: state.user?.accessLevel === AccessLevel.ADMIN,
  //       authenticated: state.authenticated,
  //     })),
  //   );

  const getRoutes = (): RouteObject[] => {
    // if (authenticated && admin) {
    //   return [...Routes, ...AdminRoleGuardedRoutes, ...AuthGuardedRoutes];
    // } else if (authenticated) {
    //   return [...Routes, ...AuthGuardedRoutes];
    // } else return [...Routes];
    return [...Routes];
  };

  const router = createHashRouter(getRoutes());
  return <RouterProvider router={router} />;
};

export default Router;
