import { Bot, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';
import { useState } from 'react';
import ChatSidebar from './chat-sidebar';

interface NavBarProps {
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export function NavBar({ isLoggedIn, onLogout }: NavBarProps) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <header className="border-b w-full">
        <div className="flex h-14 sm:h-16 items-center px-4 sm:px-8 w-full max-w-[1400px] mx-auto">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isLoggedIn && (
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-base sm:text-lg font-bold">Chanet</span>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-end space-x-2 sm:space-x-4">
            {isLoggedIn && (
              <Button size="sm" className="text-sm sm:text-base" onClick={onLogout}>
                Logout
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>
      {isLoggedIn && <ChatSidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />}
    </>
  );
}