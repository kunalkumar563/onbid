import { useCallback, useState } from "react";

import "./App.css";
import IntroAnimation from "./components/intro/IntroAnimation";

import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

import { AuthProvider } from "./context/AuthContext";

function App() {
  const [introComplete, setIntroComplete] =
    useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  if (!introComplete) {
    return (
      <IntroAnimation
        onComplete={handleIntroComplete}
      />
    );
  }

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;