import type { AppProps } from 'next/app';
import RoleBasedLayout from '@/layouts/RoleBasedLayout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RoleBasedLayout>
      <Component {...pageProps} />
    </RoleBasedLayout>
  );
}

export default MyApp; 