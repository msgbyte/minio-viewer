import { Grid } from '@mui/material';
import { BucketItem } from 'minio';
import type {
  NextPage,
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from 'next';
import { getMinioClient } from '../../client';
import { FolderTree } from '../../components/FolderTree';
import { Layout } from '../../components/Layout';
import { QueryBucketItem } from '../../types';

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const minioClient = getMinioClient();
  const bucket = String(context.query.bucket);
  const all = context.query.all === '1';
  const prefix = String(context.query.prefix ?? '');

  const objects = await new Promise<QueryBucketItem[]>((resolve, reject) => {
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
      foo: 'bar',
      bucketName: bucket,
      objects,
    },
  };
};

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> =
  ({ objects, bucketName }) => {
    return (
      <Layout>
        <Grid container>
          <Grid item xs={4}>
            <FolderTree bucketName={bucketName} />
          </Grid>
          <Grid item xs={8}>
            <div>Objects: {JSON.stringify(objects)}</div>
          </Grid>
        </Grid>
      </Layout>
    );
  };

export default Home;
