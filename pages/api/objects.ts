// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getMinioClient } from '../../client';
import { QueryBucketItem } from '../../shared/types';

type Data = {
  objects: QueryBucketItem[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const minioClient = getMinioClient();
  const bucket = String(req.query.bucket);
  const all = req.query.all === '1';
  const prefix = String(req.query.prefix ?? '');

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

  res.status(200).json({
    objects,
  });
}
