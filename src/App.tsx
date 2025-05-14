import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import SplashPage from "./components/auth/SplashPage";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import routes from "tempo-routes";
import { APIProvider } from '@vis.gl/react-google-maps';

function App() {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Validate API key
  if (!API_KEY) {
    console.error('Google Maps API key is missing. Please check your .env file.');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">
          Error: Google Maps API key is missing. Please check your environment configuration.
        </div>
      </div>
    );
  }

  return (
    <APIProvider 
      apiKey={API_KEY}
      libraries={['places', 'marker']} // Add any additional libraries you need
      onLoad={() => console.log('Maps API has loaded.')}
    > 
      <AuthProvider>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          }
        >
          <>
            <Routes>
              <Route path="/splash" element={<SplashPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          </>
        </Suspense>
      </AuthProvider>
    </APIProvider>
  );
}

export default App;
