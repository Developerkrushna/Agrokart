#!/usr/bin/env node

const mongoose = require('mongoose');
const readline = require('readline');

// MongoDB connection
const MONGODB_URI = 'mongodb://127.0.0.1:27017/krushidoot';

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  return colors[color] + text + colors.reset;
}

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(colorize('✅ Connected to MongoDB successfully!', 'green'));
    console.log(colorize(`📁 Database: krushidoot`, 'cyan'));
    console.log(colorize(`🔗 URI: ${MONGODB_URI}`, 'cyan'));
    console.log('');
    return true;
  } catch (error) {
    console.log(colorize('❌ Failed to connect to MongoDB:', 'red'));
    console.log(colorize(error.message, 'red'));
    return false;
  }
}

// Show database statistics
async function showStats() {
  try {
    const db = mongoose.connection.db;
    const stats = await db.stats();
    const collections = await db.listCollections().toArray();
    
    console.log(colorize('\n📊 Database Statistics:', 'bright'));
    console.log(colorize('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue'));
    console.log(`${colorize('Database Name:', 'yellow')} ${stats.db}`);
    console.log(`${colorize('Collections:', 'yellow')} ${stats.collections}`);
    console.log(`${colorize('Objects:', 'yellow')} ${stats.objects.toLocaleString()}`);
    console.log(`${colorize('Data Size:', 'yellow')} ${formatBytes(stats.dataSize)}`);
    console.log(`${colorize('Storage Size:', 'yellow')} ${formatBytes(stats.storageSize)}`);
    console.log(`${colorize('Indexes:', 'yellow')} ${stats.indexes}`);
    console.log(`${colorize('Index Size:', 'yellow')} ${formatBytes(stats.indexSize)}`);
    
    console.log(colorize('\n📚 Collections:', 'bright'));
    console.log(colorize('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue'));
    
    for (const collection of collections) {
      try {
        const collStats = await db.collection(collection.name).stats();
        console.log(`${colorize('📄', 'green')} ${colorize(collection.name, 'cyan')}: ${colorize(collStats.count.toLocaleString(), 'yellow')} documents (${formatBytes(collStats.size)})`);
      } catch (error) {
        console.log(`${colorize('📄', 'red')} ${colorize(collection.name, 'cyan')}: ${colorize('Error getting stats', 'red')}`);
      }
    }
    console.log('');
  } catch (error) {
    console.log(colorize('❌ Error getting database stats:', 'red'));
    console.log(colorize(error.message, 'red'));
  }
}

// List collections
async function listCollections() {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log(colorize('\n📚 Available Collections:', 'bright'));
    console.log(colorize('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue'));
    
    collections.forEach((collection, index) => {
      console.log(`${colorize((index + 1).toString().padStart(2), 'yellow')}. ${colorize(collection.name, 'cyan')}`);
    });
    console.log('');
  } catch (error) {
    console.log(colorize('❌ Error listing collections:', 'red'));
    console.log(colorize(error.message, 'red'));
  }
}

// Show documents from a collection
async function showDocuments(collectionName, limit = 5) {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection(collectionName);
    
    const count = await collection.countDocuments();
    const documents = await collection.find({}).limit(limit).toArray();
    
    console.log(colorize(`\n📄 Collection: ${collectionName}`, 'bright'));
    console.log(colorize('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue'));
    console.log(`${colorize('Total Documents:', 'yellow')} ${count.toLocaleString()}`);
    console.log(`${colorize('Showing:', 'yellow')} ${Math.min(limit, documents.length)} documents\n`);
    
    documents.forEach((doc, index) => {
      console.log(colorize(`Document ${index + 1}:`, 'green'));
      console.log(JSON.stringify(doc, null, 2));
      console.log(colorize('─'.repeat(50), 'blue'));
    });
    console.log('');
  } catch (error) {
    console.log(colorize('❌ Error showing documents:', 'red'));
    console.log(colorize(error.message, 'red'));
  }
}

// Format bytes to human readable format
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Show help menu
function showHelp() {
  console.log(colorize('\n🔧 MongoDB CLI Admin Commands:', 'bright'));
  console.log(colorize('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue'));
  console.log(`${colorize('stats', 'cyan')}           - Show database statistics`);
  console.log(`${colorize('collections', 'cyan')}     - List all collections`);
  console.log(`${colorize('show <name>', 'cyan')}     - Show documents from collection`);
  console.log(`${colorize('show <name> <n>', 'cyan')} - Show n documents from collection`);
  console.log(`${colorize('help', 'cyan')}            - Show this help menu`);
  console.log(`${colorize('exit', 'cyan')}            - Exit the admin tool`);
  console.log('');
}

// Main command loop
async function commandLoop() {
  showHelp();
  
  const askCommand = () => {
    rl.question(colorize('mongo-admin> ', 'green'), async (input) => {
      const [command, ...args] = input.trim().split(' ');
      
      switch (command.toLowerCase()) {
        case 'stats':
          await showStats();
          break;
        case 'collections':
          await listCollections();
          break;
        case 'show':
          if (args.length === 0) {
            console.log(colorize('❌ Please specify a collection name', 'red'));
          } else {
            const collectionName = args[0];
            const limit = args[1] ? parseInt(args[1]) : 5;
            await showDocuments(collectionName, limit);
          }
          break;
        case 'help':
          showHelp();
          break;
        case 'exit':
        case 'quit':
          console.log(colorize('\n👋 Goodbye!', 'green'));
          rl.close();
          process.exit(0);
          break;
        case '':
          break;
        default:
          console.log(colorize(`❌ Unknown command: ${command}`, 'red'));
          console.log(colorize('Type "help" for available commands', 'yellow'));
      }
      
      askCommand();
    });
  };
  
  askCommand();
}

// Main function
async function main() {
  console.log(colorize('🗄️  MongoDB CLI Admin Tool', 'bright'));
  console.log(colorize('═══════════════════════════════════════════════════', 'blue'));
  console.log(colorize('ShetMitra Database Management Tool', 'cyan'));
  console.log('');
  
  const connected = await connectDB();
  if (connected) {
    await commandLoop();
  } else {
    process.exit(1);
  }
}

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log(colorize('\n\n👋 Goodbye!', 'green'));
  rl.close();
  process.exit(0);
});

// Start the application
main().catch(console.error);
