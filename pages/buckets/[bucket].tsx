import { Grid } from '@mui/material';
import type {
  NextPage,
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from 'next';
import { useState } from 'react';
import { getMinioClient } from '../../client';
import { FolderTree } from '../../components/FolderTree';
import { Layout } from '../../components/Layout';
import { ObjectItem } from '../../components/ObjectItem';
import { QueryBucketItem } from '../../shared/types';

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const minioClient = getMinioClient();
  const bucket = String(context.query.bucket);
  const all = true; // Fetch all data
  const prefix = String(context.query.prefix ?? '');

  const allObjects = await new Promise<QueryBucketItem[]>((resolve, reject) => {
    const stream = minioClient.listObjectsV2(bucket, prefix, all);
    const objs: QueryBucketItem[] = [];
    stream.on('data', (obj) => {
      objs.push({
        ...obj,
        lastModified: new Date(obj.lastModified).valueOf(),
      });
    });
    stream.on('error', (err: Error) => {
      reject(err);
    });
    stream.on('end', () => {
      resolve(objs);
    });
  });

  return {
    props: {
      bucketName: bucket,
      allObjects,
    },
  };
};

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> =
  ({ allObjects, bucketName }) => {
    const [prefix, setPrefix] = useState('');

    return (
      <Layout>
        <Grid container>
          <Grid item xs={4}>
            <FolderTree allObjects={allObjects} onSelect={setPrefix} />
          </Grid>
          <Grid item xs={8}>
            {allObjects
              .filter((o) => o.name.startsWith(prefix))
              .map((o) => (
                <ObjectItem key={o.etag} object={o} />
              ))}
          </Grid>
        </Grid>
      </Layout>
    );
  };
Home.displayName = 'Home';

export default Home;
