import AWS from 'aws-sdk';

export class CloudStorage {
  private static s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  static async uploadFile(key: string, buffer: Buffer, mimeType: string) {
    try {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME || '',
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      };
      const result = await this.s3.upload(params).promise();
      return { success: true, url: result.Location };
    } catch (error) {
      console.error('Error uploading file:', error);
      return { success: false };
    }
  }

  static async getFile(key: string) {
    try {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME || '',
        Key: key,
      };
      const result = await this.s3.getObject(params).promise();
      return result.Body;
    } catch (error) {
      console.error('Error downloading file:', error);
      return null;
    }
  }

  static async deleteFile(key: string) {
    try {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME || '',
        Key: key,
      };
      await this.s3.deleteObject(params).promise();
      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      return { success: false };
    }
  }
    }
