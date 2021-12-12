import React from 'react';
import useSWR from 'swr';
import { fetcher } from '../client/fetcher';

const Navbar: React.FC<{
  buckets: string[];
}> = React.memo(({ buckets }) => {
  return (
    <header>
      <div>{buckets.join(',')}</div>
    </header>
  );
});
Navbar.displayName = 'Navbar';

export const Layout = React.memo((props) => {
  const { data, error } = useSWR<{ buckets: string[] }>(
    '/api/buckets',
    fetcher
  );

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <>
      <Navbar buckets={data.buckets} />
      <main>{props.children}</main>
      {/* <Footer /> */}
    </>
  );
});
Layout.displayName = 'Layout';
