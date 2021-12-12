// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getMinioClient } from '../../client';

type Data = {
  buckets: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const minio = getMinioClient();
  const buckets = await minio.listBuckets();

  res.status(200).json({
    buckets: buckets.map((bucket) => bucket.name),
  });
}
