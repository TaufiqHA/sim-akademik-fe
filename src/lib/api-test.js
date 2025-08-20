// API Connection Test Utility
import { getDashboardMahasiswa } from './api';

export async function testApiConnection() {
  console.log('Testing API connection...');
  console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('Environment:', process.env.NODE_ENV);
  
  try {
    const data = await getDashboardMahasiswa();
    console.log('✅ API connection successful');
    console.log('Response data:', data);
    return { success: true, data };
  } catch (error) {
    console.log('❌ API connection failed');
    console.log('Error:', error.message);
    console.log('Status:', error.status);
    console.log('Data:', error.data);
    return { success: false, error };
  }
}

export function getApiConfig() {
  return {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    environment: process.env.NODE_ENV,
    useMockData: process.env.NODE_ENV === 'development' && 
                (!process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL === '')
  };
}
