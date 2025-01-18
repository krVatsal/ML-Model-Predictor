"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bot, Code2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"; 

export default function Home() {
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6" />
            <span className="text-lg font-bold">Code Generator</span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container px-4 py-24">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Your Coding Companion
          </h1>
          <p className="mt-4 text-muted-foreground sm:text-xl">
            Generate code instantly with AI assistance
          </p>
          <div className="mt-8">
            {isLoggedIn ? (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="lg" className="h-12">
                      <Code2 className="mr-2 h-4 w-4" />
                      Generate Code
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Welcome, {user?.name}!</AlertDialogTitle>
                      <AlertDialogDescription>
                        You're successfully logged in. Ready to generate some code?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogAction>
                      <Link href="/code">
                        <Button size="lg" className="h-12">
                          Start Generating
                        </Button>
                      </Link>
                    </AlertDialogAction>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <Link href="http://localhost:5217/auth/github">
                <Button size="lg" className="h-12">
                  <Code2 className="mr-2 h-4 w-4" />
                  Log In to Generate Code
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
