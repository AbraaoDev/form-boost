import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './pages/_layouts/app';
import { AuthLayout } from './pages/_layouts/auth';
import { NotFound } from './pages/404';
import { DashboardCreateForm } from './pages/app/create-form/index';
import { Forms } from './pages/app/forms/forms';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Forms />,
      },
    ],
  },
  // {
  //   path: '/create-form',
  //   errorElement: <NotFound />,
  //   children: [
  //     {
  //       path: '/create-form',
  //       element: <DashboardCreateForm />,
  //     },
  //   ],
  // },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
    ],
  },
]);
