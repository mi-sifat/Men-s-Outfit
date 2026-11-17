import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { Request, Response } from 'express';
import config from '../config';
import { AppError } from '../utils/AppError';

const localUploadDirectory = path.resolve(__dirname, '../../uploads');

const hasValidImageSignature = (buffer: Buffer, mimeType: string): boolean => {
  if (mimeType === 'image/jpeg') return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (mimeType === 'image/png') return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (mimeType === 'image/webp') return buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';
  if (mimeType === 'image/gif') return ['GIF87a', 'GIF89a'].includes(buffer.toString('ascii', 0, 6));
  if (mimeType === 'image/avif') return buffer.toString('ascii', 4, 12).includes('ftyp') && buffer.toString('ascii', 8, 12).startsWith('avi');
  return false;
};

const hasCloudinaryCredentials = Boolean(
  config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret
);

if (hasCloudinaryCredentials) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true,
  });
}

const uploadToCloudinary = (buffer: Buffer): Promise<string> => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    { folder: 'mens-outfit', resource_type: 'image', use_filename: false, unique_filename: true },
    (error, result) => {
      if (error || !result?.secure_url) return reject(error || new Error('Image storage returned no URL'));
      resolve(result.secure_url);
    }
  );
  stream.end(buffer);
});

export const uploadImage = async (req: Request, res: Response) => {
  if (!req.file) throw AppError.badRequest('একটি image file নির্বাচন করুন।');
  if (!hasValidImageSignature(req.file.buffer, req.file.mimetype)) {
    throw AppError.badRequest('Uploaded file content does not match a supported image format.');
  }

  let imageUrl: string;
  if (hasCloudinaryCredentials) {
    imageUrl = await uploadToCloudinary(req.file.buffer);
  } else {
    if (!config.isDevelopment) {
      throw new AppError('Production image storage is not configured. Set Cloudinary credentials before enabling uploads.', 503);
    }

    await mkdir(localUploadDirectory, { recursive: true });
    const extensionByMimeType: Record<string, string> = {
      'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/avif': '.avif', 'image/gif': '.gif',
    };
    const filename = `${randomUUID()}${extensionByMimeType[req.file.mimetype]}`;
    await writeFile(path.join(localUploadDirectory, filename), req.file.buffer, { flag: 'wx' });
    imageUrl = `http://localhost:${config.port}/uploads/${filename}`;
  }

  res.status(201).json({ success: true, message: 'Image uploaded successfully.', data: { url: imageUrl } });
};
