import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store from '../store'
import "material-symbols";
import "remixicon/fonts/remixicon.css";
import "react-calendar/dist/Calendar.css";
import "swiper/css";
import "swiper/css/bundle";

// globals
import '../styles/globals.css'

import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAppSelector } from '../store/hooks'
import { selectUser } from '../store/auth/selectors'

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
})

function GuardedApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const path = typeof window !== 'undefined' ? window.location.pathname : '';


  useEffect(() => {
    if (!user) return;
    if (user.category === 'company') {
      if (path === '/settings') {
        router.replace('/settings/external');
      } else if (path !== '/company-user-dashboard' && path !== '/settings/external' && !path.startsWith('/sign-in')) {
        router.replace('/company-user-dashboard');
      }
    } else if (user.category === 'customer') {
      if (path === '/settings') {
        router.replace('/settings/external');
      } else if (path !== '/customer-user-dashboard' && path !== '/settings/external' && !path.startsWith('/sign-in')) {
        router.replace('/customer-user-dashboard');
      }
    } else {
      // internal users: if on /settings/external, redirect to /settings
      if (path === '/settings/external') {
        router.replace('/settings');
      }
    }
  }, [user, path, router]);

  // Block rendering for company/customer users if not on allowed page
  if (user && (user.category === 'company' || user.category === 'customer')) {
    if (
      (user.category === 'company' && path !== '/company-user-dashboard' && path !== '/settings/external' && !path.startsWith('/sign-in')) ||
      (user.category === 'customer' && path !== '/customer-user-dashboard' && path !== '/settings/external' && !path.startsWith('/sign-in'))
    ) {
      return null;
    }
  }

  return <Component {...pageProps} />;
}

export default function App(props: AppProps) {
  return (
    <Provider store={store}>
      <div className={`${inter.variable} antialiased`}>
        <GuardedApp {...props} />
      </div>
    </Provider>
  )
}
