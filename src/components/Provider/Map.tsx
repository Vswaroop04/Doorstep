import GoogleMapReact from "google-map-react";
import { MapPin } from "lucide-react";

const AnyReactComponent = ({ text }: any) => (
  <div>
    <MapPin size={32} color="red" />
  </div>
);

export default function SimpleMap({
  lat,
  long,
}: {
  lat: number;
  long: number;
}) {
  const defaultProps = {
    center: {
      lat: 45.501,
      lng: 73.5673,
    },
    zoom: 10,
  };

  return (
    <div style={{ height: "70vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.NEXT_PUBLIC_GEOCODE_API_KEY as string,
        }}
        defaultCenter={
          lat && long
            ? {
                lat: lat,
                lng: long,
              }
            : defaultProps.center
        }
        center={
          lat && long
            ? {
                lat: lat,
                lng: long,
              }
            : defaultProps.center
        }
        defaultZoom={defaultProps.zoom}
        zoom={lat && long ? 13 : defaultProps.zoom}
      >
        <AnyReactComponent lat={lat} lng={long} text="My Marker" />
      </GoogleMapReact>
    </div>
  );
}
