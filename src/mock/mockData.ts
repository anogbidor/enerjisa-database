// src/mock/mockData.ts

export const mockDistributors = [
  {
    name: 'Mock Petrol A.Ş.',
    license_no: 'DAĞ/0000-1/11111',
  },
]

export const mockDealers = [
  {
    name: 'Mock Dealer Ltd.',
    license_no: 'BAY/0000-1/22222',
    distributor_license_no: 'DAĞ/0000-1/11111',
  },
]

export const mockStations = [
  {
    license_no: 'IST/2025/00001',
    name: 'Mock Station 1',
    city: 'Istanbul',
    district: 'Kadıköy',
    address: 'Mock Street 1',
    status: 'ONAYLANDI',
    license_start: '2025-01-01',
    license_end: '2030-01-01',
    contract_start: '2025-01-01',
    contract_end: '2027-01-01',
    is_cancelled: false,
    dealer_license_no: 'BAY/0000-1/22222',
    distributor_license_no: 'DAĞ/0000-1/11111',
  },
]
