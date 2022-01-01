import type { BucketItem } from 'minio';

export interface QueryBucketItem extends Omit<BucketItem, 'lastModified'> {
  lastModified: number;
}
