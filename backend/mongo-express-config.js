module.exports = {
  mongodb: {
    // MongoDB connection settings
    server: '127.0.0.1',
    port: 27017,
    
    // Database name
    database: 'krushidoot',
    
    // MongoDB connection options
    connectionOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    
    // Authentication (if needed)
    // username: '',
    // password: '',
    
    // Connection string (alternative to individual settings)
    connectionString: 'mongodb://127.0.0.1:27017/krushidoot',
  },
  
  site: {
    // Web interface settings
    baseUrl: '/',
    cookieKeyName: 'mongo-express',
    cookieSecret: 'cookiesecret',
    host: 'localhost',
    port: 8081,
    requestSizeLimit: '50mb',
    sessionSecret: 'sessionsecret',
    sslEnabled: false,
    sslCert: '',
    sslKey: '',
  },
  
  // Basic authentication for web interface
  basicAuth: {
    username: 'admin',
    password: 'admin123',
  },
  
  options: {
    // Display options
    console: true,
    documentsPerPage: 10,
    editorTheme: 'rubyblue',
    
    // Security options
    readOnly: false,
    collapsibleJSON: true,
    collapsibleJSONDefaultUnfold: 1,
    
    // Grid view options
    gridFSEnabled: false,
    
    // Other options
    logger: {},
    cmdType: 'eval',
  },
  
  // Default key names
  defaultKeyNames: {
    '_id': '_id',
  },
};
