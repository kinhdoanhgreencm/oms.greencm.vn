
export enum Role {
  ADMIN = 'ADMIN',
  SALES = 'SALES',
  TECHNICIAN = 'TECHNICIAN'
}

export enum CustomerType {
  INDIVIDUAL = 'Cá nhân',
  BUSINESS = 'Doanh nghiệp'
}

export enum CustomerSource {
  WEBSITE = 'Website',
  HOTLINE = 'Hotline',
  FACEBOOK = 'Facebook',
  GOOGLE = 'Google Search',
  REFERRAL = 'Người giới thiệu',
}

export enum ChargerType {
  KW7 = '7kW (AC)',
  KW11 = '11kW (AC)',
  KW22 = '22kW (AC)',
  KW30 = '30kW (DC)',
  KW60 = '60kW (DC)',
  KW120 = '120kW (DC)',
  KW150 = '150kW (DC Super)'
}

export enum ChargerBrand {
  CHARGECORE = 'Chargecore',
  STARCHARGE = 'Starcharge'
}

export interface ChargerModel {
  id: string;
  name: string;
  power: string;
  type: 'AC' | 'DC';
  brand: ChargerBrand;
  price: number;
  features: string[];
  imageUrl?: string;
}

export enum ProjectStatus {
  NEW = 'Liên hệ mới',
  SURVEYED = 'Đã khảo sát',
  PROPOSAL_SENT = 'Đã gửi phương án',
  CONTRACTED = 'Đã ký hợp đồng',
  INSTALLING = 'Đang lắp đặt',
  COMPLETED = 'Hoàn thành/Bảo trì'
}

export interface StatusHistory {
  id: string;
  status: ProjectStatus;
  note: string;
  updatedAt: string;
}

export interface TechnicalProposal {
  id: string;
  title: string;
  items: { description: string; quantity: number; unit: string; price: number }[];
  wireDiagramUrl?: string;
  createdAt: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  status: boolean; // true = Active, false = Locked
  assignedCustomers: string[]; // List of customer IDs
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  type: CustomerType;
  source: string; // Changed from enum to string to allow custom input
  chargerType: ChargerType;
  status: ProjectStatus;
  location: {
    lat: number;
    lng: number;
  };
  notes: StatusHistory[];
  proposals: TechnicalProposal[];
  createdAt: string;
  createdBy?: string; // User ID of the creator
  assignedTo?: string; // User ID of the sales/tech person
}

export type ViewType = 'DASHBOARD' | 'CUSTOMERS' | 'PROGRESS' | 'PROPOSALS' | 'USERS' | 'CHARGERS';
