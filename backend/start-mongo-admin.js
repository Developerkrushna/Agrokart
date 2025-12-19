#!/usr/bin/env node

const mongoExpress = require('mongo-express/lib/middleware');
const mongoExpressConfig = require('./mongo-express-config');
const express = require('express');

const app = express();

// Configure mongo-express middleware
app.use('/', mongoExpress(mongoExpressConfig));

const PORT = mongoExpressConfig.site.port || 8081;

app.listen(PORT, () => {
  console.log('🚀 MongoDB Admin Panel Started!');
  console.log('');
  console.log('📊 Access your MongoDB Admin Panel at:');
  console.log(`   🌐 http://localhost:${PORT}`);
  console.log('');
  console.log('🔐 Login Credentials:');
  console.log(`   👤 Username: ${mongoExpressConfig.basicAuth.username}`);
  console.log(`   🔑 Password: ${mongoExpressConfig.basicAuth.password}`);
  console.log('');
  console.log('📁 Database: krushidoot');
  console.log('🔗 MongoDB URI: mongodb://127.0.0.1:27017/krushidoot');
  console.log('');
  console.log('✨ Features Available:');
  console.log('   • View and edit collections');
  console.log('   • Add, update, delete documents');
  console.log('   • Execute MongoDB queries');
  console.log('   • Database statistics');
  console.log('   • Index management');
  console.log('');
  console.log('🛑 Press Ctrl+C to stop the admin panel');
});
