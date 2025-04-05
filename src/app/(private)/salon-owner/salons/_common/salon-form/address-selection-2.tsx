import React, { useState, useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Icon, Style } from "ol/style";
import { Input } from "@/components/ui/input";

interface PlacesAutocompleteProps {
  value: any;
  onChange: (value: any) => void;
  initialValues: any;
  hideMap?: boolean;
  placeholder?: string;
}

const PlacesAutocomplete = ({
  value,
  onChange,
  initialValues,
  hideMap = false,
  placeholder,
}: PlacesAutocompleteProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const mapRef: any = useRef(null);
  const vectorLayerRef: any = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([78.4867, 17.385]), // Default to Hyderabad
          zoom: 12,
        }),
      });
    }
  }, []);

  useEffect(() => {
    if (query.length > 2) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data);
        });
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSelectLocation = (location: any) => {
    console.log(location);
    onChange({
      latitude: location.lat,
      longitude: location.lon,
      location_display_name: location.display_name,
    });
    setQuery(location.display_name);
    setSuggestions([]);

    const lon = parseFloat(location.lon);
    const lat = parseFloat(location.lat);
    const coords = fromLonLat([lon, lat]);

    const view = mapRef.current.getView();
    view.animate({ center: coords, zoom: 14 });

    // Remove old marker if exists
    if (vectorLayerRef.current) {
      mapRef.current.removeLayer(vectorLayerRef.current);
    }

    // Add a marker
    const marker = new Feature({
      geometry: new Point(coords),
    });

    marker.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: "https://openlayers.org/en/latest/examples/data/icon.png",
        }),
      })
    );

    const vectorSource: any = new VectorSource({
      features: [marker],
    });

    vectorLayerRef.current = new VectorLayer({
      source: vectorSource,
    });

    mapRef.current.addLayer(vectorLayerRef.current);
  };

  useEffect(() => {
    if (initialValues?.latitude && initialValues?.longitude) {
      handleSelectLocation({
        lat: initialValues?.latitude,
        lon: initialValues?.longitude,
        display_name: initialValues?.location_display_name,
      });
    }
  }, [initialValues]);

  return (
    <div>
      <Input
        type="text"
        placeholder={placeholder || "Search for a location"}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div
        style={{
          position: "absolute",
          background: "#fff",
          width: "300px",
          boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        {suggestions.map((place: any) => (
          <div
            key={place.place_id}
            onClick={() => handleSelectLocation(place)}
            style={{
              padding: "8px",
              cursor: "pointer",
              borderBottom: "1px solid #ddd",
            }}
          >
            {place.display_name}
          </div>
        ))}
      </div>
      {!hideMap && (
        <div
          id="map"
          style={{
            width: "100%",
            height: "400px",
            marginTop: "10px",
          }}
        ></div>
      )}
    </div>
  );
};

export default PlacesAutocomplete;
