
import React from 'react';
import { Role, ChargerBrand, ChargerModel } from './types';

export const COLORS = {
  VINFAST_BLUE: '#004182',
  VINFAST_WHITE: '#FFFFFF',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#3b82f6'
};

export const STATUS_COLORS: Record<string, string> = {
  'Liên hệ mới': 'bg-blue-100 text-blue-700',
  'Đã khảo sát': 'bg-purple-100 text-purple-700',
  'Đã gửi phương án': 'bg-yellow-100 text-yellow-700',
  'Đã ký hợp đồng': 'bg-indigo-100 text-indigo-700',
  'Đang lắp đặt': 'bg-orange-100 text-orange-700',
  'Hoàn thành/Bảo trì': 'bg-green-100 text-green-700'
};

export const MOCK_CHARGERS: ChargerModel[] = [
  {
    id: 'c1',
    name: 'Trụ sạc AC 11kW',
    power: '11kW',
    type: 'AC',
    brand: ChargerBrand.STARCHARGE,
    price: 15500000,
    features: ['Sạc chậm AC', 'Thích hợp gia đình', 'Thiết kế treo tường'],
  },
  {
    id: 'c2',
    name: 'Trụ sạc DC 20kW (Link)',
    power: '20kW',
    type: 'DC',
    brand: ChargerBrand.CHARGECORE,
    price: 115000000,
    features: ['Sạc nhanh DC', 'Kết nối Link', 'Thích hợp bãi đỗ xe'],
  },
  {
    id: 'c3',
    name: 'Trụ sạc DC 20kW (NoLink)',
    power: '20kW',
    type: 'DC',
    brand: ChargerBrand.CHARGECORE,
    price: 95000000,
    features: ['Sạc nhanh DC', 'Offline NoLink', 'Kinh tế'],
  },
  {
    id: 'c4',
    name: 'Trụ sạc DC 22kW',
    power: '22kW',
    type: 'DC',
    brand: ChargerBrand.STARCHARGE,
    price: 135000000,
    features: ['Sạc nhanh DC', 'Chuẩn Starcharge', 'Hiệu suất cao'],
  },
  {
    id: 'c5',
    name: 'Trụ sạc DC 30kW',
    power: '30kW',
    type: 'DC',
    brand: ChargerBrand.CHARGECORE,
    price: 185000000,
    features: ['Sạc nhanh DC 30kW', 'Độ bền cao', 'Tương thích mọi dòng xe VinFast'],
  },
  {
    id: 'c6',
    name: 'Trụ sạc DC 60kW',
    power: '60kW',
    type: 'DC',
    brand: ChargerBrand.STARCHARGE,
    price: 320000000,
    features: ['Sạc siêu nhanh', '2 súng sạc', 'Quản lý thông minh'],
  },
  {
    id: 'c7',
    name: 'Trụ sạc DC 120kW',
    power: '120kW',
    type: 'DC',
    brand: ChargerBrand.CHARGECORE,
    price: 580000000,
    features: ['Siêu trụ 120kW', 'Phân phối tải thông minh', 'Giải pháp trạm công cộng'],
  }
];

export const MOCK_USERS = [
  {
    id: 'u1',
    fullName: 'Admin Hệ Thống',
    email: 'admin@vinfast.vn',
    role: Role.ADMIN,
    status: true,
    assignedCustomers: [],
    createdAt: '2023-01-01'
  },
  {
    id: 'u2',
    fullName: 'Nguyễn Kinh Doanh',
    email: 'sales@vinfast.vn',
    role: Role.SALES,
    status: true,
    assignedCustomers: ['1', '3'],
    createdAt: '2023-05-15'
  },
  {
    id: 'u3',
    fullName: 'Trần Kỹ Thuật',
    email: 'tech@vinfast.vn',
    role: Role.TECHNICIAN,
    status: true,
    assignedCustomers: ['1'],
    createdAt: '2023-06-20'
  }
];

export const MOCK_CUSTOMERS = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    address: 'Vinhomes Ocean Park, Gia Lâm, Hà Nội',
    type: 'Cá nhân',
    source: 'Website',
    chargerType: '7kW (AC)',
    status: 'Đang lắp đặt',
    location: { lat: 20.994, lng: 105.945 },
    notes: [
      { id: 'n1', status: 'Liên hệ mới', note: 'Khách hàng quan tâm lắp tại hầm chung cư', updatedAt: '2023-10-01' }
    ],
    proposals: [],
    createdAt: '2023-10-01',
    assignedTo: 'u2'
  },
  {
    id: '2',
    name: 'Công ty TNHH Vận tải X',
    phone: '0243888888',
    address: 'KCN Bắc Thăng Long, Đông Anh, Hà Nội',
    type: 'Doanh nghiệp',
    source: 'Hotline',
    chargerType: '30kW (DC)',
    status: 'Đã ký hợp đồng',
    location: { lat: 21.121, lng: 105.783 },
    notes: [],
    proposals: [],
    createdAt: '2023-10-05',
    assignedTo: 'u1'
  },
  {
    id: '3',
    name: 'Trần Thị B',
    phone: '0912345678',
    address: 'Vinhomes Riverside, Long Biên, Hà Nội',
    type: 'Cá nhân',
    source: 'Facebook',
    chargerType: '11kW (AC)',
    status: 'Đã gửi phương án',
    location: { lat: 21.045, lng: 105.912 },
    notes: [],
    proposals: [],
    createdAt: '2023-10-10',
    assignedTo: 'u2'
  }
];
