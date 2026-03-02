'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { io, Socket } from 'socket.io-client';

// Dynamic import for react-leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });

// Leaflet CSS needs to be imported
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons not loading correctly in Next.js
import L from 'leaflet';

interface LiveTrackingMapProps {
    orderId: string;
    customerLocation: { lat: number; lng: number };
    initialRiderLocation?: { lat: number; lng: number };
}

export default function LiveTrackingMap({ orderId, customerLocation, initialRiderLocation }: LiveTrackingMapProps) {
    const [riderLocation, setRiderLocation] = useState<{ lat: number; lng: number } | null>(
        initialRiderLocation || null
    );
    const [mapLoaded, setMapLoaded] = useState(false);
    const [route, setRoute] = useState<[number, number][]>([]);
    const [eta, setEta] = useState<string>('');
    const [distance, setDistance] = useState<string>('');
    const socketRef = useRef<Socket | null>(null);

    // Setup custom icons after component mounts on client
    useEffect(() => {
        // Fix Leaflet's default icon path issues
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
        setMapLoaded(true);
    }, []);

    useEffect(() => {
        // Connect to the WebSocket server
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
        const socket = io(socketUrl);
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to socket for live tracking', socket.id);
            // Join the order room for updates
            socket.emit('join_order', orderId);
        });

        // Listen for real-time location updates
        socket.on('rider_location', (data: { orderId: string; lat: number; lng: number }) => {
            if (data.orderId === orderId) {
                setRiderLocation({ lat: data.lat, lng: data.lng });
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [orderId]);

    // Fetch route and ETA from OSRM mapping service
    useEffect(() => {
        if (!riderLocation || !customerLocation) return;

        const fetchRoute = async () => {
            try {
                // OSRM expects coordinates as lng,lat
                const url = `https://router.project-osrm.org/route/v1/driving/${riderLocation.lng},${riderLocation.lat};${customerLocation.lng},${customerLocation.lat}?overview=full&geometries=geojson`;
                const res = await fetch(url);
                const data = await res.json();

                if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                    const routeData = data.routes[0];
                    // GeoJSON coordinates are [lng, lat], Leaflet Polyline needs [lat, lng]
                    const coordinates = routeData.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
                    setRoute(coordinates);

                    const distKm = (routeData.distance / 1000).toFixed(1);
                    setDistance(`${distKm} km`);

                    const durationMin = Math.ceil(routeData.duration / 60);
                    setEta(`${durationMin} min`);
                }
            } catch (err) {
                console.error("Failed to fetch route info:", err);
            }
        };

        // Add a slight delay to avoid spamming the public API while moving
        const timeout = setTimeout(fetchRoute, 500);
        return () => clearTimeout(timeout);
    }, [riderLocation, customerLocation]);

    // Initial center is rider's location if available, otherwise customer's location
    const center = riderLocation || customerLocation;

    if (!mapLoaded) {
        return <div className="w-full h-full min-h-[400px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">Loading map...</div>;
    }

    const mapCenter: [number, number] = [center.lat, center.lng];
    const customerPos: [number, number] = [customerLocation.lat, customerLocation.lng];

    // Define custom icon for Rider
    const riderIcon = new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png', // Delivery bike icon
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
    });

    // Define custom icon for Customer/Destination
    const customerIcon = new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3180/3180145.png', // Home/Destination pin
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
    });

    return (
        <div className="w-full h-[400px] sm:h-[500px] rounded-xl overflow-hidden border border-border shadow-sm z-0 relative">
            {/* ETA & Distance Badge */}
            {eta && distance && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-white dark:bg-gray-900 px-5 py-2.5 rounded-full shadow-lg border border-border text-sm flex gap-3 font-semibold text-foreground whitespace-nowrap items-center">
                    <span className="text-red-600 dark:text-red-500 font-bold">{eta} ETA</span>
                    <span className="w-px h-4 bg-border block"></span>
                    <span className="text-muted-foreground">{distance} remain</span>
                </div>
            )}

            {/* The MapContainer needs absolute positioning or rigid height/width to render correctly */}
            <MapContainer
                center={mapCenter}
                zoom={14}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Route Line */}
                {route.length > 0 && (
                    <Polyline positions={route} color="#ef4444" weight={5} opacity={0.8} />
                )}

                {/* Customer Location Marker */}
                <Marker position={customerPos} icon={customerIcon}>
                    <Popup>
                        <div className="text-center font-bangla font-semibold">
                            Customer Location
                        </div>
                    </Popup>
                </Marker>

                {/* Rider Location Marker */}
                {riderLocation && (
                    <Marker position={[riderLocation.lat, riderLocation.lng]} icon={riderIcon}>
                        <Popup>
                            <div className="text-center font-bangla font-semibold text-red-600">
                                Rider is here
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            {/* Simulated Movement Control (For Testing Purposes Only - you can remove this in production) */}
            {riderLocation && (
                <div className="absolute bottom-4 left-4 z-[400] bg-white dark:bg-card p-3 rounded-lg shadow-lg border border-border text-xs flex flex-col gap-2">
                    <span className="font-bold mb-1 text-foreground">Simulate Movement (Test)</span>
                    <button
                        onClick={() => {
                            if (!socketRef.current) return;
                            // Move rider slightly towards customer
                            const moveLat = riderLocation.lat + (customerLocation.lat - riderLocation.lat) * 0.1;
                            const moveLng = riderLocation.lng + (customerLocation.lng - riderLocation.lng) * 0.1;

                            // Emulate backend sending the update
                            socketRef.current.emit('rider_location_update', {
                                orderId,
                                lat: moveLat,
                                lng: moveLng
                            });
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition whitespace-nowrap"
                    >
                        Move Rider
                    </button>
                    <button
                        onClick={() => {
                            if (!socketRef.current) return;
                            // Move rider slightly away
                            const moveLat = riderLocation.lat - 0.001;
                            const moveLng = riderLocation.lng - 0.001;

                            // Emulate backend sending the update
                            socketRef.current.emit('rider_location_update', {
                                orderId,
                                lat: moveLat,
                                lng: moveLng
                            });
                        }}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded transition whitespace-nowrap"
                    >
                        Move Away
                    </button>
                </div>
            )}
        </div>
    );
}
