module.exports = {
  aws: {
    access_key: process.env.AWS_ACCESS_KEY || '',
    secret_key: process.env.AWS_SECRET_KEY || '',
    bucket_name: process.env.AWS_BUCKET_NAME || '',
    bucket_region: process.env.AWS_BUCKET_REGION || ''
  }
};
