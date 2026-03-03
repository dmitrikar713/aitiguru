import React from "react";
import { MantineProvider } from "@mantine/core";
import "./pages/auth/authSlice";
import { Router } from "./routes/router";
import { queryClient } from "./api/tanstack";
import { QueryClientProvider } from "@tanstack/react-query";
import { ModuleRegistry } from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";

// Register AG Grid modules once at app level
ModuleRegistry.registerModules([AllCommunityModule]);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Router />
      </MantineProvider>
    </QueryClientProvider>
  );
};

export default App;
