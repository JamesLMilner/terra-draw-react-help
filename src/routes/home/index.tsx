import { h } from "preact";
import style from "./style.css";
import {
  useMemo,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "preact/hooks";
import { setupDraw } from "./setup-draw";
import { setupLeafletMap } from "./setup-leaflet";
import * as L from "leaflet";
import { GeoJSONStoreFeatures } from "terra-draw";
import ClearButton from "../../components/clear-button/ClearButton";
import MapButtons from "../../components/map-buttons/MapButtons";

const Home = ({ features }: { features: GeoJSONStoreFeatures[] }) => {
  const mapOptions = {
    L,
    id: "leaflet-map",
    lng: 0,
    lat: 30,
    zoom: 3,
  };
  const ref = useRef(null);
  const [map, setMap] = useState<undefined | L.Map>();
  const [mode, setMode] = useState<string>("static");

  useEffect(() => {
    setMap(setupLeafletMap(mapOptions));
  }, []);

  const draw = useMemo(() => {
    if (map) {
      const terraDraw = setupDraw(map, L);
      terraDraw.start();
      return terraDraw;
    }
  }, [map]);

  const changeMode = useCallback(
    (newMode: string) => {
      if (draw) {
        setMode(newMode);
        draw.setMode(newMode);
      }
    },
    [draw]
  );

  useEffect(() => {
    if (draw) {
      console.log("adding features", { features })
      draw.addFeatures(features);
    }

    return () => {
      console.log('unmounting', { draw })
      if (draw) {
        const featureIdsToRemove = features.map((feature) => feature.id as string).filter((id) => draw.hasFeature(id));

        if (featureIdsToRemove.length > 0) {
          console.log("removing features after unmount", { featureIdsToRemove })
          draw.removeFeatures(featureIdsToRemove)
        }
      }
    }

  }, [draw, features])

  useEffect(() => {
    if (draw) {

      // Example of adding a feature inside this component
      console.log('Adding example feature inside Home component (i.e. not passed as a prop')
      draw.addFeatures([
        {
          type: "Feature",
          properties: {
            mode: "point",
          },
          geometry: {
            type: "Point",
            coordinates: [0, 0],
          },
        },
      ]);
    }

  }, [draw]);

  return (
    <div class={style.home}>
      <div ref={ref} class={style.map} id={mapOptions.id}>
        {draw ? <ClearButton draw={draw} /> : null}
        {draw ? <MapButtons mode={mode} changeMode={changeMode} /> : null}
      </div>

    </div>
  );
};

export default Home;
