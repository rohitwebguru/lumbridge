"use client";

import PlatformConnections from '../components/platformConnections'
import ClientLayout from '../components/clientLayout';


const platforms = [
  { name: 'Facebook', logo: '/facebook-logo.svg' },
  { name: 'Google Ads', logo: '/google-ads-logo.svg' },
  { name: 'Google Analytics', logo: '/google-analytics-logo.svg' },
  { name: 'Shopify', logo: '/shopify-logo.svg' },
];

export default function Connections() {
  const connectedPlatforms = 2;

  return (
    <ClientLayout>
        <PlatformConnections platforms={platforms}/>
    </ClientLayout>
  );
}