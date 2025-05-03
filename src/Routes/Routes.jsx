import {
    createBrowserRouter,

  } from "react-router";
import Root from "../Root/Root";
import Home from "../Home/Home";
import About from "../Components/about/About";
import Facilities from "../Components/Facilities/Facilities";
import Admission from "../Components/admission/Admission";
  
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
      loader: ()=> fetch("/public/kids.json"),
      Component:About
    },
    {
      path:"/facilities",
      Component:Facilities
    },
    {
      path:"/admission",
      Component: Admission
    }
    
]
  },
]);

