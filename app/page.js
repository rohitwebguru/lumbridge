"use client";
import { Toaster } from 'react-hot-toast';
import React, { useState } from 'react';
import WorkspaceLink from './components/workspaceLink'
import PlatformConnections from './components/platformConnections'
import RecentActivity from './components/recentActivity'
import ClientLayout from './components/clientLayout';
import QuickTips from './components/quickTips';
import LinkModal from './components/linkModal';
import { useSession } from 'next-auth/react';

const platforms = [
  { name: 'Facebook', logo: '/facebook-logo.svg' },
  { name: 'Google', logo: '/google-logo.svg' },
  { name: 'Shopify', logo: '/shopify-logo.svg' },
];

const recentActivity = [
  { client: 'Acme Corp', platforms: ['Facebook', 'Google Ads'], time: '2 hours ago' },
  { client: 'TechStart', platforms: ['Google Analytics', 'Shopify'], time: '1 day ago' },
  { client: 'FashionBrand', platforms: ['Facebook', 'Shopify'], time: '2 days ago' },
];

export default function Home() {
  const {data:session} = useSession();
  if (session?.user?.name) {
    var username = session.user.name.replace(/\s+/g, '-');
  }
  const [activeTab, setActiveTab] = useState('Home');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const workspaceLink = `${process.env.NEXT_PUBLIC_BASE_URL}workspace/${username}/access`;
  const workspaceLinkAccess = `${process.env.NEXT_PUBLIC_BASE_URL}workspace/${username}/access`;
  const workspaceLinkView = `${process.env.NEXT_PUBLIC_BASE_URL}workspace/${username}/view`;
  const connectedPlatforms = 2;
  const workspace_slug = 'access';
  const openDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <ClientLayout>
        <WorkspaceLink 
          workspaceLinkAccess={workspaceLinkAccess}
          workspaceLinkView={workspaceLinkView}
          openDialog={openDialog}
        />
        <LinkModal 
          isOpen={isDialogOpen} 
          setIsOpen={setIsDialogOpen} 
          workspaceLink={workspace_slug}
        />
        <PlatformConnections platforms={platforms}/>
        <RecentActivity activities={recentActivity}/>
        <QuickTips/>
    </ClientLayout>
  );
}

