/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RegisterPage } from './components/RegisterPage';
import { RedeemPage } from './components/RedeemPage';
import { SpreadsheetModal } from './components/SpreadsheetModal';

export type CurrentRoute = 'register' | 'redeem';

export default function App() {
  const [route, setRoute] = useState<CurrentRoute>('register');
  const [prefilledRedeemName, setPrefilledRedeemName] = useState<string>('');
  const [isSpreadsheetOpen, setIsSpreadsheetOpen] = useState(false);

  // Sync state with browser location hash and search params
  useEffect(() => {
    const parseUrl = () => {
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      const searchParams = new URLSearchParams(window.location.search);
      const hashQuery = window.location.hash.includes('?')
        ? new URLSearchParams(window.location.hash.split('?')[1])
        : null;

      const nameParam = searchParams.get('name') || hashQuery?.get('name');

      if (hash.startsWith('#/redeem') || pathname.endsWith('/redeem')) {
        setRoute('redeem');
        if (nameParam) {
          setPrefilledRedeemName(decodeURIComponent(nameParam));
        }
      } else {
        setRoute('register');
        // Ensure URL shows /registration if on main root page
        if (!hash || hash === '#' || hash === '#/' || hash === '#/register') {
          window.location.hash = '#/registration';
        }
      }
    };

    parseUrl();
    window.addEventListener('hashchange', parseUrl);
    window.addEventListener('popstate', parseUrl);

    return () => {
      window.removeEventListener('hashchange', parseUrl);
      window.removeEventListener('popstate', parseUrl);
    };
  }, []);

  const navigateToRedeem = (name?: string) => {
    if (name) {
      setPrefilledRedeemName(name);
      window.location.hash = `#/redeem?name=${encodeURIComponent(name)}`;
    } else {
      setPrefilledRedeemName('');
      window.location.hash = '#/redeem';
    }
    setRoute('redeem');
  };

  const navigateToRegister = () => {
    window.location.hash = '#/registration';
    setRoute('register');
  };

  return (
    <div className="min-h-screen bg-[url('/assets/background.jpg')] bg-cover bg-center bg-no-repeat bg-fixed relative selection:bg-white/30 text-white overflow-x-hidden">
      {/* Ambient background overlay for smooth readability & glass reflection */}
      <div className="min-h-screen bg-black/20 backdrop-brightness-95 flex flex-col justify-between">
        {route === 'register' ? (
          <RegisterPage
            onNavigateToRedeem={navigateToRedeem}
            onOpenSpreadsheet={() => setIsSpreadsheetOpen(true)}
          />
        ) : (
          <RedeemPage
            initialNameQuery={prefilledRedeemName}
            onNavigateToRegister={navigateToRegister}
            onOpenSpreadsheet={() => setIsSpreadsheetOpen(true)}
          />
        )}
      </div>

      {/* Google Sheets & Excel Manager Modal */}
      <SpreadsheetModal
        isOpen={isSpreadsheetOpen}
        onClose={() => setIsSpreadsheetOpen(false)}
        onSelectRecordToRedeem={(name) => {
          navigateToRedeem(name);
        }}
      />
    </div>
  );
}
