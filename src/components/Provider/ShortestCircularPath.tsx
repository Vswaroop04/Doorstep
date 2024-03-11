import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { OfflineSchedule } from "@/lib/types/authType";
import { Library } from "@googlemaps/js-api-loader";

// Define types
interface User {
  lat: number;
  long: number;
  id?: string;
}

interface ShortestCircularPathProps {
  filteredOfsc?: OfflineSchedule[];
  lat: number;
  long: number;
}

const libraries: Library[] = ["places"];

export default function ShortestCircularPath({
  filteredOfsc,
  lat,
  long,
}: ShortestCircularPathProps) {
  const users = filteredOfsc?.map((item) => item?.user) as User[]; // Ensure users type safety

  const mapRef = useRef<google.maps.Map | null>(null);
  const onLoad = React.useCallback(
    (mapInstance: any) => {
      const bounds = new google.maps.LatLngBounds();
      users.forEach((office) => {
        bounds.extend(new google.maps.LatLng(office.lat, office.long));
      });
      mapRef.current = mapInstance;
      mapInstance.fitBounds(bounds);
    },
    [users]
  );
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GEOCODE_API_KEY || "",
    libraries,
  });

  const center = { lat, lng: long }; // Combine lat and long for center coordinates

  const calculateDirections = async () => {
    if (!users || users.length < 2) {
      console.error("Insufficient waypoints for circular path calculation");
      return;
    }

    const waypoints = users.map((user) => ({
      location: new google.maps.LatLng(user.lat, user.long), // Create LatLng objects
      stopover: false, // Set all waypoints as stopovers for circular path
    }));

    const origin = waypoints[0]; // Set the first waypoint as origin
    const destination = origin; // Set the last waypoint as destination for circular path

    const travelMode = google.maps.TravelMode.DRIVING; // Adjust travel mode as needed

    const directionsService = new google.maps.DirectionsService();
    const request = {
      origin,
      destination,
      waypoints,
      travelMode,
    };

    directionsService.route(request, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        setDirections(response); // Set the directions response
      } else {
        console.error("Error fetching directions:", status);
      }
    });
  };

  useEffect(() => {
    console.log("useEffect called. isLoaded:", isLoaded, "users:", users);
    if (isLoaded && users?.length > 1) {
      const hasLocationChange = users.some((user, index) => {
        const prevUser = filteredOfsc?.[index]?.user;
        return prevUser?.lat !== user.lat || prevUser?.long !== user.long;
      });

      if (hasLocationChange) {
        calculateDirections();
      }
    }
  }, [isLoaded, users]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <div className="p-6 pt-0">
      <h1 className="text-3xl font-semibold tracking-tight my-4 text-gray-800">
        Shortest Circular Path
      </h1>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        zoom={12}
        center={center}
        onLoad={onLoad}
      >
        {users &&
          users.map((user, index) => (
            <Marker
              key={user.id || `${user.lat}-${user.long}-${index}`} // Use ID if available, fallback to lat/long combination
              position={{ lat: user.lat, lng: user.long }}
            />
          ))}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
}
