import Dashboard from "./components/dashboard/Dashboard";
import { StationsProvider } from "./context/StationsContext";

function App() {
  return (
    <StationsProvider>
      <Dashboard />
    </StationsProvider>
  );
}

export default App;