import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import { OfflineSchedule } from "@/lib/types/authType";
import { Library } from "@googlemaps/js-api-loader";

// Define types
interface User {
  lat: number;
  long: number;
  email?: string;
  name?: string;
  mobile?: number;
  id?: string;
}

interface ShortestCircularPathProps {
  filteredOfsc?: OfflineSchedule[];
  lat: number;
  long: number;
}

async function getAddressFromLatLng(
  lat: number,
  lng: number
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GEOCODE_API_KEY}`
    );
    const data = await response.json();
    if (data.status === "OK") {
      return data.results[0].formatted_address;
    } else {
      console.error("Geocoding error:", data.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching geocoding data:", error);
    return null;
  }
}

const libraries: Library[] = ["places"];

export default function ShortestCircularPath({
  filteredOfsc,
  lat,
  long,
}: ShortestCircularPathProps) {
  const [selectedMarker, setSelectedMarker] = useState<{
    name: string;
    email?: string;
    mobile?: number;
    location: { lat: number; lng: number };
  } | null>(null);

  const users = filteredOfsc?.map((item) => item?.user) as User[];
  const markers = users.map((user) => {
    const address = getAddressFromLatLng(user.lat, user.long);
    return {
      name: user.name!,
      email: user.email!,
      mobile: user?.mobile,
      address,
      location: {
        lat: user.lat,
        lng: user.long,
      },
    };
  });

  const finalMarkers = [
    {
      name: "provider",
      location: {
        lat,
        lng: long,
      },
    },
    ...markers,
  ];
  const [directions, setDirections] = useState<any>(null);

  const { isLoaded, loadError } = useLoadScript({
    id: process.env.NEXT_PUBLIC_GEOCODE_API_KEY || "",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GEOCODE_API_KEY || "",
    libraries,
  });
  useEffect(() => {
    if (!isLoaded) return;

    const directionsService = new window.google.maps.DirectionsService();
    const waypoints = markers.map((marker) => ({
      location: new window.google.maps.LatLng(
        marker.location.lat,
        marker.location.lng
      ),
    }));

    directionsService.route(
      {
        origin: { lat, lng: long },
        destination: { lat, lng: long },
        travelMode: window.google.maps.TravelMode.DRIVING,
        waypoints,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }, [isLoaded]);
  const center = { lat, lng: long };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <div className="p-6 pt-0">
      <h1 className="text-3xl font-semibold tracking-tight my-4 text-gray-800">
        Shortest Circular Path
      </h1>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        zoom={8}
        center={center}
      >
        {finalMarkers &&
          finalMarkers.map((marker) => (
            <div key={marker.name}>
              {marker.name == "provider" ? (
                <Marker
                  position={marker.location}
                  options={{
                    icon: {
                      url: "https://www.pngall.com/wp-content/uploads/2017/05/Map-Marker-Free-Download-PNG.png",
                      scaledSize: new window.google.maps.Size(50, 50),
                    },
                    label: {
                      text: "You",
                      fontSize: "25px",
                      color: "black",
                      fontWeight: "bold",
                      className: "mb-40",
                    },
                  }}
                  onClick={() => setSelectedMarker(marker)}
                />
              ) : (
                <Marker
                  position={marker.location}
                  options={{
                    label: {
                      text: marker.name,
                      fontSize: "15px",
                      color: "black",
                      className: "mb-10",
                    },
                  }}
                  onClick={() => setSelectedMarker(marker)}
                />
              )}
            </div>
          ))}
        {selectedMarker && (
          <InfoWindow position={selectedMarker.location}>
            <div className="p-1 h-30 text-lg">
              <h1>Name : {selectedMarker.name}</h1>
              {selectedMarker?.email && (
                <h2>Email : {selectedMarker?.email} </h2>
              )}
              {selectedMarker?.email && (
                <h2>Mobile : {selectedMarker?.mobile} </h2>
              )}{" "}
              <button
                className="flex justify-center border p-1 mx-0"
                onClick={() => setSelectedMarker(null)}
              >
                {" "}
                Close{" "}
              </button>
            </div>
          </InfoWindow>
        )}

        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{ markerOptions: { visible: false } }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
