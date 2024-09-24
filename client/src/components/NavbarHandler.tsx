"use client"; 

import { usePathname } from "next/navigation";
import Navbar from "./Navbar"; 

const NavbarHandler = () => {
  const pathname = usePathname(); 

  // Check if the route is login or register
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // Conditionally render the Navbar
  if (isAuthPage) return null;

  return <Navbar />;
};

export default NavbarHandler;
