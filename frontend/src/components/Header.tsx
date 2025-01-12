"use client";
import React, { useState, useEffect } from "react";
import { Code2 } from "lucide-react";
import { useRouter } from "next/navigation";
export default function Header() {
  const router= useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check login status
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("http://localhost:5217/auth/status", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.loggedIn) {
            setIsLoggedIn(true);
            setUser(data.user);
          } else {
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error verifying login status", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    
    try {
      console.log("Attempting to logout...");
      const response = await fetch("http://localhost:5217/auth/logout", {
        method: "GET",
        credentials: "include",
      });
      if (response.status==200) {
        setIsLoggedIn(false);
        setUser(null);
        alert("Successfully logged out!");
        router.push('/')
      } else {
        alert("Failed to log out. Please try again.");
      }
    } catch (error) {
      console.error("Error logging out", error);
      alert("An error occurred while logging out.");
    }
  };

  return (
    <header className="border-b border-gray-800">
      <div className="container justify-between mx-auto px-4 py-4 flex items-center">
        <div className="flex items-center gap-2">
          <Code2 className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold">CodeGen AI</span>
        </div>
        <a href="http://localhost:5217/check">donenn</a>
        {!isLoggedIn ? (
          <a href="http://localhost:5217/auth/github">
            <button
              type="button"
              className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2"
            >
              <svg
                className="w-4 h-4 me-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                  clipRule="evenodd"
                />
              </svg>
              Authenticate with Github
            </button>
          </a>
        ) : (
          <img
            src={user?.avatarUrl}
            alt="User Avatar"
            className="w-8 h-8 rounded-full cursor-pointer"
            onClick={() => {
              if (window.confirm("Do you want to log out?")) {
                handleLogout();
              }
            }}
          />
        )}
      </div>
    </header>
  );
}
