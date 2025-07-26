import {
  createBrowserRouter,

} from "react-router";
import Root from "../Root/Root";
import Home from "../Home/Home";
import About from "../Components/about/About";
import Facilities from "../Components/Facilities/Facilities";
import Admission from "../Components/admission/Admission";
import Register from "../Components/Login_register/Register";
import Card_details from "../Components/about/Card_details";
import Teacher from "../Components/Facilities/Teacher";
import PrivateRoute from "../Script/Authcontext/PrivateRoute";
import StuDashboard from "../Components/Dashboard/StuDashboard";
import Admission_info from "../Components/admission/Admission_info";
import Login from "../Components/Login_register/Login";

import Alluser from "../Components/User and admin/Alluser";
import DashboardHome from "../Components/Dashboard/DashboardHome";
import DashboardNav from "../Components/Dashboard/DashboardNav";
import Profile from "../Components/User and admin/Profile";
import Faculty from "../Components/User and admin/Faculty";
import Student from "../Components/User and admin/Student";
import Myclasses from "../Components/User and admin/Myclasses";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        path: "/",
        Component: Home
      },
      {
        path: "/about",
        loader: () => fetch("https://sc-hool-server.vercel.app/stories"),
        Component: About
      },
      {
        path: "/facilities",

        Component: Facilities
      },
      {
        path: '/contact',
        loader: () => fetch("/public/teacher.json"),
        Component: Teacher
      },
      {
        path: '/cardDetails/:id',
        loader: ({ params }) => fetch(`https://sc-hool-server.vercel.app/stories/${params.id}`),
        element: <Card_details></Card_details>
      },
      {
        path: "/admission",
        Component: Admission
      },
      {
        path: '/admissionInfo',
        Component: Admission_info
      },
      {
        path: "/register",
        Component: Register
      },
      {
        path: '/login',
        Component: Login
      },
      {
        path: '/StuDashboard',
        element: <PrivateRoute> <StuDashboard></StuDashboard> </PrivateRoute>
      }

    ]
  },
{
  path: '/dashboard',
  element: <DashboardNav />, // This wraps all child routes
  children: [
    {
      index: true,
      element: <DashboardHome />
    },
    {
      path: 'alluser',
      loader: () => fetch('https://sc-hool-server.vercel.app/users'),
      element: <Alluser />
    },
    {
     path:'profile',
     element:<Profile></Profile>
     
    },
    {
    path:'faculty',
    loader:()=>fetch('https://sc-hool-server.vercel.app/users'),
    element:<Faculty></Faculty>
    },
    {
      path:'allstudent',
       loader:()=>fetch('https://sc-hool-server.vercel.app/student'),
       element:<Student></Student>
    },
    {
      path:'myclass',
      element:<Myclasses></Myclasses>
    },
  ]
}
]);

