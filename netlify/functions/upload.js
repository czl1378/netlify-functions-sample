const { Storage } = require('@google-cloud/storage');

const STORAGE_BUCKETNAME = process.env.STORAGE_BUCKETNAME || 'dl-testnet';

const storage = new Storage({
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY.split("\\n").join("\n")
  }
});

function error(message) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      success: false,
      message
    })
  }
}

function success(data) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      data
    })
  }
}

exports.handler = async function(event, context) {
  const { isBase64Encoded, body, httpMethod, queryStringParameters } = event;

  const { appchainId, isRaw } = queryStringParameters;
  
  if (!/post/i.test(httpMethod)) {
    return error('Method not support');
  }

  if (!appchainId || !isRaw) {
    return error('Missing parameters');
  }

  const myBucket = storage.bucket(STORAGE_BUCKETNAME);
  const destFileName = `${appchainId}/chain-spec${isRaw == 1 ? '-raw' : ''}.json`;

  const file = myBucket.file(destFileName);

  try {
    const result = await file.save(Buffer.from(body, isBase64Encoded ? 'base64' : 'utf8'));
    return success(res);
  } catch(err) {
    return error(err.toString());
  }

}