"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bot, Code2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"; 
import { NavBar } from "@/components/navbar";
export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  interface User {
    displayName: string,
  _id: string
  }

  const [user, setUser] = useState<User>();
  const {toast} = useToast()
  const logoutHandler = async () => {
    try {
      const response = await fetch("https://chanet-backend-cef3d3b9g9b6d8e4.centralindia-01.azurewebsites.net/auth/logout", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        setIsLoggedIn(false);
        setUser(undefined);
        localStorage.removeItem("userId");
      }
      toast({
        variant: "default",
        title: "Success",
        description: "Logged Out successfully",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error logging out", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout. Please try again.",
        duration: 3000,
      });
    }
  }
useEffect(() => {
  const checkLoginStatus = async () => {
    try {
      const response = await fetch("https://chanet-backend-cef3d3b9g9b6d8e4.centralindia-01.azurewebsites.net/auth/status", {
        method: "GET",
        credentials: "include",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      console.log(data)
      if (response.ok && data.loggedIn) {
        setIsLoggedIn(true);
        setUser(data.user);
        localStorage.setItem("userId", data.user._id);
      } else {
        setIsLoggedIn(false);
        setUser(undefined);
        localStorage.removeItem("userId");
      }
    } catch (error) {
      console.error("Error verifying login status:", error);
      setIsLoggedIn(false);
      setUser(undefined);
      localStorage.removeItem("userId");
    }
  };

  checkLoginStatus();
}, []);
  useEffect(() => {
    if(user?._id){
      localStorage.setItem("userId", user._id);
    }
  }, [user])
  return (
<div className="min-h-screen bg-background flex flex-col">
      <NavBar isLoggedIn={isLoggedIn} onLogout={logoutHandler} />

      <main className="container px-4 md:px-6 flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter">
            Your Coding Companion
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            Generate code instantly with Chanet
          </p>
          <div className="mt-6 md:mt-8">
            {isLoggedIn ? (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="lg" className="h-10 md:h-12 text-sm md:text-base">
                      <Code2 className="mr-2 h-4 w-4" />
                      Generate Code
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Welcome, {user?.displayName}!</AlertDialogTitle>
                      <AlertDialogDescription>
                        You're successfully logged in. Ready to generate some code?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogAction>
                      <Link href="/code">
                        <Button size="lg" className="h-10 md:h-12 text-sm md:text-base">
                          Start Generating
                        </Button>
                      </Link>
                    </AlertDialogAction>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <Link href="https://chanet-backend-cef3d3b9g9b6d8e4.centralindia-01.azurewebsites.net/auth/github">
                <Button size="lg" className="h-10 md:h-12 text-sm md:text-base">
                  <Code2 className="mr-2 h-4 w-4" />
                  Log In to Generate Code
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
