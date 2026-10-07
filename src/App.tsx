import Dashboard from "./components/dashboard/Dashboard";
import { StationsProvider } from "./context/StationsContext";
import Footer from "./components/dashboard/Footer";
function App() {
  return (
    <StationsProvider>
      <Dashboard />
      <Footer/>
    </StationsProvider>
  );
}

export default App;