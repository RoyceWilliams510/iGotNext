import React from "react";
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, LogIn } from "lucide-react";

const SplashPage: React.FC = () => {
  const { signInWithGoogle, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="w-full shadow-lg bg-white">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary rounded-full p-3">
                <MapPin className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">
              Pickup Basketball Finder
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Find and join basketball games in your area
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Connect with local players, find courts, and never miss a game
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 my-6">
              <div className="flex flex-col items-center p-2">
                <div className="bg-blue-100 rounded-full p-2 mb-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-xs font-medium">Find Games</p>
              </div>
              <div className="flex flex-col items-center p-2">
                <div className="bg-green-100 rounded-full p-2 mb-2">
                  <svg
                    className="h-5 w-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v8m-4-4h8"
                    />
                  </svg>
                </div>
                <p className="text-xs font-medium">Create Games</p>
              </div>
              <div className="flex flex-col items-center p-2">
                <div className="bg-purple-100 rounded-full p-2 mb-2">
                  <svg
                    className="h-5 w-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <p className="text-xs font-medium">Join Players</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full flex items-center justify-center gap-2"
              onClick={signInWithGoogle}
              disabled={isLoading}
            >
              <LogIn className="h-5 w-5" />
              {isLoading ? "Loading..." : "Continue with Google"}
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
