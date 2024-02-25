import { h } from "preact";

// Code-splitting is automated for `routes` directory
import Home from "../routes/home";
import { GeoJSONStoreFeatures } from "terra-draw";
import { useEffect, useState } from "preact/hooks";

const App = () => {

  const [features, setFeatures] = useState([
    {
      id: "30c8f1f6-3762-4c6b-9487-bb3c97bd0b4a",
      type: "Feature",
      properties: {
        mode: "point",
      },
      geometry: {
        type: "Point",
        coordinates: [50, 50],
      },
    } as GeoJSONStoreFeatures
  ])

  useEffect(() => {

    setTimeout(() => {
      console.log('Updating features after 5 seconds')
      setFeatures([
        {
          id: "ff12a23a-3d99-47e3-ae00-9140909df60f",
          type: "Feature",
          properties: {
            mode: "point",
          },
          geometry: {
            type: "Point",
            coordinates: [25, 25],
          },
        } as GeoJSONStoreFeatures
      ])
    }, 5000)

  }, [])

  return <div id="app">
    <Home features={features} />
  </div>
}


export default App;
