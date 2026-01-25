
import React, { useEffect, useRef } from 'react';
import { Customer } from '../types';
import L from 'leaflet';
import { STATUS_COLORS } from '../constants';

interface Props {
  customers: Customer[];
}

const LocationMap: React.FC<Props> = ({ customers }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([21.0285, 105.8542], 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clear existing markers if any (using a layer group would be cleaner, but this is simple)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add markers
    const bounds: L.LatLngExpression[] = [];
    customers.forEach(customer => {
      const { lat, lng } = customer.location;
      bounds.push([lat, lng]);

      const markerColor = customer.status === 'Hoàn thành/Bảo trì' ? '#10b981' : 
                         customer.status === 'Đang lắp đặt' ? '#f59e0b' : '#004182';

      const customIcon = L.divIcon({
        html: `<div style="background-color: ${markerColor}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);"></div>`,
        className: 'custom-div-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const popupContent = `
        <div style="font-family: sans-serif; min-width: 180px;">
          <p style="font-weight: bold; margin: 0 0 4px 0; color: #1e293b;">${customer.name}</p>
          <p style="font-size: 11px; margin: 0 0 8px 0; color: #64748b;">${customer.address}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 8px;">
            <span style="font-size: 10px; font-weight: bold; color: #004182;">${customer.chargerType}</span>
            <span style="font-size: 10px; padding: 2px 6px; border-radius: 99px; background-color: #f1f5f9; color: #475569;">${customer.status}</span>
          </div>
        </div>
      `;

      L.marker([lat, lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(popupContent);
    });

    if (bounds.length > 0) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [50, 50] });
    }

    return () => {
      // Cleanup is handled by ref persisting across renders
    };
  }, [customers]);

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Bản đồ Công trình</h2>
          <p className="text-sm text-gray-500">Xem phân bổ địa lý của các điểm lắp đặt trạm sạc</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
            <span className="text-xs font-medium text-gray-600">Hoàn thành</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
            <span className="text-xs font-medium text-gray-600">Đang lắp đặt</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#004182]"></div>
            <span className="text-xs font-medium text-gray-600">Tiềm năng/Mới</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-2">
        <div 
          ref={mapContainerRef} 
          className="w-full h-full rounded-xl z-10"
        />
      </div>
    </div>
  );
};

export default LocationMap;
