// @ts-expect-error WindMap is a JavaScript module without a declaration file.
import WindMap from "./components/map/WindMap";

function App() {
  return (
    <div>
      <h1>NIWE Wind Measurement Stations</h1>
      <WindMap />
    </div>
  );
}

export default App;