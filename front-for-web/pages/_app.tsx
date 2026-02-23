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

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <div className={`${inter.variable} antialiased`}>
        <Component {...pageProps} />
      </div>
    </Provider>
  )
}
