import type { AppProps } from 'next/app';
import { NextUIProvider } from '@nextui-org/react';
import MainNavbar from '@/components/Navbar/MainNavbar';
import {Footer} from '@/components/Footer/Footer';
import './styles/globals.css';
import Particles_background from '@/components/Animated_bg/Particles_background';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>

    <NextUIProvider>
      <MainNavbar />
      <Component {...pageProps} />
    </NextUIProvider>
    </div>
  );
}
