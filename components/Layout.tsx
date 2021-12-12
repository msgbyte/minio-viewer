import {
  AppBar,
  IconButton,
  Toolbar,
  Menu,
  MenuItem,
  Button,
  styled,
} from '@mui/material';
import React from 'react';
import useSWR from 'swr';
import { fetcher } from '../client/fetcher';
import { Menu as MenuIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';

const NavbarMenuBtn = styled(Button)({
  color: 'white',
  textTransform: 'none',
});

const Navbar: React.FC<{
  buckets: string[];
}> = React.memo(({ buckets }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const router = useRouter();
  const currentBucket = router.query.bucket ?? 'Please Select Bucket';

  return (
    <AppBar position="sticky">
      <Toolbar>
        <NavbarMenuBtn onClick={(e) => setAnchorEl(e.currentTarget)}>
          {currentBucket}
        </NavbarMenuBtn>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {buckets.map((b, i) => (
            <Link key={i} href={`/buckets/${b}`} passHref>
              <MenuItem onClick={handleClose}>{b}</MenuItem>
            </Link>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
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
      <Head>
        <title>Minio Viewer</title>
        <meta name="description" content="A ui viewer for minio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar buckets={data.buckets} />
      <main>{props.children}</main>
      {/* <Footer /> */}
    </>
  );
});
Layout.displayName = 'Layout';
