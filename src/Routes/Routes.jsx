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
  
export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
        {
        index:true,
        path:"/",
        Component:Home
    },
    {
      path:"/about",
      loader: ()=> fetch("http://localhost:3000/stories"),
      Component:About
    },
    {
      path:"/facilities",
     
      Component:Facilities
    },
    {
      path:'/contact',
       loader:()=> fetch("/public/teacher.json"),
       Component:Teacher
    },
    {
       path:'/cardDetails/:id',
       loader:({params})=>fetch(`http://localhost:3000/stories/${params.id}`),
       element:<Card_details></Card_details>
    },
    {
      path:"/admission",
      Component: Admission
    },
    {
      path:"/register",
      Component:Register
    },
    {
      path:'/StuDashboard',
      element:<PrivateRoute> <StuDashboard></StuDashboard> </PrivateRoute>
    }
    
]
  },
]);

