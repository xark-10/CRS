require( 'dotenv' ).config()

// Explicit connection url to connect to the remote DB "MongoDB Atlas"

// DEV Environment Connection
if(process.env.NODE_ENV ==='development'){
  module.exports = {
    secret: `${process.env.MONGODB_DEV_SECRET}`,
    databaseURL: `mongodb+srv://${process.env.MONGODB_DEV_USERNAME}:${process.env.MONGODB_DEV_PASSWORD}@${process.env.MONGODB_DEV_CLUSTER_NAME}.${process.env.MONGODB_DEV_DB_IDENTIFIER}.mongodb.net/${process.env.MONGODB_DEV_DB_NAME}?retryWrites=true&w=majority`,
  };
}
// UAT Environment Connection
else if (process.env.NODE_ENV === 'test'){
  module.exports = {
    secret: `${process.env.MONGODB_UAT_SECRET}`,
    databaseURL: `mongodb+srv://${process.env.MONGODB_UAT_USERNAME}:${process.env.MONGODB_UAT_PASSWORD}@${process.env.MONGODB_UAT_CLUSTER_NAME}.${process.env.MONGODB_UAT_DB_IDENTIFIER}.mongodb.net/${process.env.MONGODB_UAT_DB_NAME}?retryWrites=true&w=majority`,
  };
}
// PROD Environment Connection
else if(process.env.NODE_ENV ==='production'){
  module.exports = {
    secret: `${process.env.MONGODB_PROD_SECRET}`,
    databaseURL: `mongodb+srv://${process.env.MONGODB_PROD_USERNAME}:${process.env.MONGODB_PROD_PASSWORD}@${process.env.MONGODB_PROD_CLUSTER_NAME}.${process.env.MONGODB_PROD_DB_IDENTIFIER}.mongodb.net/${process.env.MONGODB_PROD_DB_NAME}?retryWrites=true&w=majority`,
  };
}


