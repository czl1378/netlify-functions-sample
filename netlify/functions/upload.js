const { Storage } = require('@google-cloud/storage');

const STORAGE_BUCKETNAME = process.env.STORAGE_BUCKETNAME || 'dl-testnet';
const storage = new Storage();

exports.handler = async function(event, context) {
  const { path, body } = event;
  console.log(path, body);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'hello',
      path
    })
  };
}