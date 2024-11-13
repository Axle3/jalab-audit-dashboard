import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { PlusCircle, Users } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call
    toast({
      title: "User Created",
      description: `New user "${newUsername}" has been created successfully.`,
    });
    setNewUsername('');
    setNewPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-semibold">JALAB NIG LTD</h1>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Users className="w-4 h-4 mr-2" />
                    User Management
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 w-[400px] space-y-4">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" className="w-full">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Create New User
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Create New User</SheetTitle>
                            <SheetDescription>
                              Add a new user to the system
                            </SheetDescription>
                          </SheetHeader>
                          <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
                            <div className="space-y-2">
                              <label htmlFor="username" className="text-sm font-medium">
                                Username
                              </label>
                              <Input
                                id="username"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder="Enter username"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="password" className="text-sm font-medium">
                                Password
                              </label>
                              <Input
                                id="password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter password"
                                required
                              />
                            </div>
                            <Button type="submit" className="w-full">
                              Create User
                            </Button>
                          </form>
                        </SheetContent>
                      </Sheet>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Welcome, {user?.username}</span>
            <Button
              variant="outline"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;