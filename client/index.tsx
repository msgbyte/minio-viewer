import { Client as MinioClient } from 'minio';

let _client: MinioClient;

export function getMinioClient() {
  if (_client) {
    return _client;
  }

  const minioUrl = process.env.MINIO_URL ?? '127.0.0.1:9000';
  const minioUser = process.env.MINIO_USER ?? '';
  const minioPass = process.env.MINIO_PASS ?? '';
  const [endPoint, port] = minioUrl.split(':');

  const minioClient = new MinioClient({
    endPoint,
    accessKey: minioUser,
    secretKey: minioPass,
    port: Number(port),
    useSSL: false,
  });

  _client = minioClient;

  return minioClient;
}
