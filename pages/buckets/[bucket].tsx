import { BucketItem } from 'minio';
import type {
  NextPage,
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from 'next';
import { getMinioClient } from '../../client';
import { Layout } from '../../components/Layout';

interface QueryBucketItem extends BucketItem {
  lastModified: number;
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const minioClient = getMinioClient();
  const bucket = String(context.query.bucket);
  const prefix = String(context.query.prefix ?? '');

  const objects = await new Promise<QueryBucketItem[]>((resolve, reject) => {
    const stream = minioClient.listObjectsV2(bucket, prefix);
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
      objects,
    },
  };
};

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> =
  ({ objects }) => {
    return <Layout>Objects: {JSON.stringify(objects)}</Layout>;
  };

export default Home;
