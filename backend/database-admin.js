const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 8082;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB (same connection as main app)
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrocart';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB for admin panel');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🌐 Admin panel: http://localhost:' + PORT);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('💡 Make sure MongoDB is running or check connection string');
  }
};

// API Routes for database admin
app.get('/api/collections', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json(collections.map(col => col.name));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/collection/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { limit = 50, skip = 0 } = req.query;
    
    const collection = mongoose.connection.db.collection(name);
    const documents = await collection.find({})
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .toArray();
    
    const count = await collection.countDocuments();
    
    res.json({
      collection: name,
      count,
      documents,
      pagination: {
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: count > (parseInt(skip) + parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected',
        readyState: mongoose.connection.readyState,
        states: {
          0: 'disconnected',
          1: 'connected',
          2: 'connecting',
          3: 'disconnecting'
        }
      });
    }

    const db = mongoose.connection.db;

    // Get database stats
    const stats = await db.stats();

    // Get collections list
    const collections = await db.listCollections().toArray();

    const collectionStats = [];
    for (const col of collections) {
      try {
        const collection = db.collection(col.name);
        const count = await collection.countDocuments();
        collectionStats.push({
          name: col.name,
          count
        });
      } catch (colError) {
        console.error(\`Error getting count for collection \${col.name}:\`, colError);
        collectionStats.push({
          name: col.name,
          count: 0,
          error: colError.message
        });
      }
    }

    const response = {
      database: mongoose.connection.name || 'unknown',
      connectionState: 'connected',
      collections: collectionStats,
      dbStats: {
        dataSize: stats.dataSize || 0,
        storageSize: stats.storageSize || 0,
        indexes: stats.indexes || 0,
        objects: stats.objects || 0
      },
      timestamp: new Date().toISOString()
    };

    console.log('📊 Stats request successful:', {
      database: response.database,
      collectionsCount: response.collections.length,
      totalDocuments: response.collections.reduce((sum, col) => sum + col.count, 0)
    });

    res.json(response);

  } catch (error) {
    console.error('🚨 Stats API error:', error);
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// Create new document
app.post('/api/collection/:name/document', async (req, res) => {
  try {
    const { name } = req.params;
    const documentData = req.body;

    const collection = mongoose.connection.db.collection(name);
    const result = await collection.insertOne(documentData);

    res.json({
      success: true,
      insertedId: result.insertedId,
      message: 'Document created successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update document
app.put('/api/collection/:name/document/:id', async (req, res) => {
  try {
    const { name, id } = req.params;
    const updateData = req.body;

    const collection = mongoose.connection.db.collection(name);
    const result = await collection.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({
      success: true,
      modifiedCount: result.modifiedCount,
      message: 'Document updated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete document
app.delete('/api/collection/:name/document/:id', async (req, res) => {
  try {
    const { name, id } = req.params;

    const collection = mongoose.connection.db.collection(name);
    const result = await collection.deleteOne({ _id: new mongoose.Types.ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({
      success: true,
      deletedCount: result.deletedCount,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single document
app.get('/api/collection/:name/document/:id', async (req, res) => {
  try {
    const { name, id } = req.params;

    const collection = mongoose.connection.db.collection(name);
    const document = await collection.findOne({ _id: new mongoose.Types.ObjectId(id) });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk delete documents
app.delete('/api/collection/:name/documents', async (req, res) => {
  try {
    const { name } = req.params;
    const { ids } = req.body;

    const collection = mongoose.connection.db.collection(name);
    const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
    const result = await collection.deleteMany({ _id: { $in: objectIds } });

    res.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `${result.deletedCount} documents deleted successfully`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search documents
app.post('/api/collection/:name/search', async (req, res) => {
  try {
    const { name } = req.params;
    const { query, limit = 50, skip = 0 } = req.body;

    const collection = mongoose.connection.db.collection(name);
    const documents = await collection.find(query)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .toArray();

    const count = await collection.countDocuments(query);

    res.json({
      collection: name,
      count,
      documents,
      pagination: {
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: count > (parseInt(skip) + parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve admin panel HTML
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🗄️ AgriNet Database Admin</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/date-fns@2.29.3/index.min.js"></script>
    <style>
        :root {
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --secondary: #10b981;
            --accent: #f59e0b;
            --danger: #ef4444;
            --warning: #f59e0b;
            --success: #10b981;
            --info: #3b82f6;
            --dark: #1f2937;
            --light: #f8fafc;
            --border: #e5e7eb;
            --text: #374151;
            --text-light: #6b7280;
            --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            --radius: 12px;
            --radius-lg: 16px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: var(--text);
            line-height: 1.6;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            padding: 30px;
            border-radius: var(--radius-lg);
            margin-bottom: 30px;
            box-shadow: var(--shadow-lg);
            border: 1px solid rgba(255, 255, 255, 0.2);
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--primary), var(--secondary), var(--accent));
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
        }

        .title {
            color: var(--dark);
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 8px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .subtitle {
            color: var(--text-light);
            font-size: 1.1rem;
            font-weight: 400;
        }

        .refresh-btn {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: var(--radius);
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: var(--shadow);
        }

        .refresh-btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
        }

        .refresh-btn:active {
            transform: translateY(0);
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            padding: 28px;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-lg);
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: var(--gradient);
        }

        .stat-card.primary::before { background: linear-gradient(90deg, var(--primary), var(--primary-dark)); }
        .stat-card.success::before { background: linear-gradient(90deg, var(--secondary), #059669); }
        .stat-card.warning::before { background: linear-gradient(90deg, var(--accent), #d97706); }
        .stat-card.info::before { background: linear-gradient(90deg, var(--info), #2563eb); }

        .stat-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
        }

        .stat-card h3 {
            color: var(--text);
            font-size: 0.95rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: var(--radius);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: white;
        }

        .stat-icon.primary { background: linear-gradient(135deg, var(--primary), var(--primary-dark)); }
        .stat-icon.success { background: linear-gradient(135deg, var(--secondary), #059669); }
        .stat-icon.warning { background: linear-gradient(135deg, var(--accent), #d97706); }
        .stat-icon.info { background: linear-gradient(135deg, var(--info), #2563eb); }

        .stat-value {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--dark);
            margin-bottom: 8px;
        }

        .stat-label {
            color: var(--text-light);
            font-size: 0.9rem;
            font-weight: 500;
        }

        .main-content {
            display: grid;
            grid-template-columns: 350px 1fr;
            gap: 30px;
            align-items: start;
        }

        .sidebar {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow);
            border: 1px solid rgba(255, 255, 255, 0.2);
            overflow: hidden;
            position: sticky;
            top: 20px;
        }

        .sidebar-header {
            padding: 24px;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
        }

        .sidebar-title {
            font-size: 1.25rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .collections-list {
            max-height: 600px;
            overflow-y: auto;
        }

        .collection-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 24px;
            border-bottom: 1px solid var(--border);
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
        }

        .collection-item:hover {
            background: linear-gradient(90deg, rgba(99, 102, 241, 0.05), rgba(16, 185, 129, 0.05));
            transform: translateX(4px);
        }

        .collection-item.active {
            background: linear-gradient(90deg, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.1));
            border-left: 4px solid var(--primary);
        }

        .collection-item:last-child {
            border-bottom: none;
        }

        .collection-info {
            flex: 1;
        }

        .collection-name {
            font-weight: 600;
            color: var(--dark);
            font-size: 1rem;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .collection-count {
            color: var(--text-light);
            font-size: 0.85rem;
            font-weight: 500;
        }

        .collection-icon {
            color: var(--primary);
            font-size: 1.1rem;
        }

        .content-area {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow);
            border: 1px solid rgba(255, 255, 255, 0.2);
            overflow: hidden;
        }

        .content-header {
            padding: 24px;
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.1));
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
        }

        .content-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--dark);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .content-actions {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .btn {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: var(--radius);
            cursor: pointer;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: var(--shadow);
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
        }

        .btn:active {
            transform: translateY(0);
        }

        .btn.secondary {
            background: linear-gradient(135deg, var(--text-light), var(--text));
        }

        .btn.success {
            background: linear-gradient(135deg, var(--secondary), #059669);
        }

        .btn.warning {
            background: linear-gradient(135deg, var(--accent), #d97706);
        }

        .documents-container {
            padding: 24px;
            max-height: 800px;
            overflow-y: auto;
        }

        .document {
            background: var(--light);
            padding: 20px;
            border-radius: var(--radius);
            margin-bottom: 16px;
            border: 1px solid var(--border);
            transition: all 0.2s ease;
            position: relative;
        }

        .document:hover {
            box-shadow: var(--shadow);
            transform: translateY(-1px);
        }

        .document-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--border);
        }

        .document-title {
            font-weight: 600;
            color: var(--dark);
            font-size: 0.95rem;
        }

        .document-id {
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.8rem;
            color: var(--text-light);
            background: rgba(99, 102, 241, 0.1);
            padding: 4px 8px;
            border-radius: 4px;
        }

        .document-content {
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.85rem;
            line-height: 1.6;
            color: var(--text);
            background: white;
            padding: 16px;
            border-radius: 8px;
            border: 1px solid var(--border);
            overflow-x: auto;
            white-space: pre-wrap;
        }

        /* Data Visualization Styles */
        .visualization-tabs {
            display: flex;
            background: var(--light);
            border-radius: var(--radius);
            padding: 4px;
            margin-bottom: 20px;
            border: 1px solid var(--border);
        }

        .tab-button {
            flex: 1;
            padding: 12px 16px;
            border: none;
            background: transparent;
            border-radius: calc(var(--radius) - 4px);
            cursor: pointer;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .tab-button.active {
            background: white;
            color: var(--primary);
            box-shadow: var(--shadow);
        }

        .tab-button:hover:not(.active) {
            background: rgba(255, 255, 255, 0.7);
        }

        .visualization-content {
            display: none;
        }

        .visualization-content.active {
            display: block;
        }

        .chart-container {
            background: white;
            padding: 24px;
            border-radius: var(--radius);
            border: 1px solid var(--border);
            margin-bottom: 20px;
            position: relative;
            height: 400px;
        }

        .chart-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--dark);
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .data-table {
            background: white;
            border-radius: var(--radius);
            border: 1px solid var(--border);
            overflow: hidden;
            margin-bottom: 20px;
        }

        .table-header {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            padding: 16px 20px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .table-content {
            max-height: 500px;
            overflow-y: auto;
        }

        .table-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 16px;
            padding: 16px 20px;
            border-bottom: 1px solid var(--border);
            transition: all 0.2s ease;
        }

        .table-row:hover {
            background: var(--light);
        }

        .table-row:last-child {
            border-bottom: none;
        }

        .table-cell {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .cell-label {
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--text-light);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .cell-value {
            font-size: 0.95rem;
            color: var(--text);
            word-break: break-word;
        }

        .cell-value.number {
            font-family: 'Monaco', monospace;
            color: var(--primary);
            font-weight: 600;
        }

        .cell-value.date {
            color: var(--secondary);
            font-weight: 500;
        }

        .cell-value.boolean {
            color: var(--accent);
            font-weight: 600;
        }

        .cell-value.null {
            color: var(--text-light);
            font-style: italic;
        }

        .stats-overview {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
        }

        .stat-mini-card {
            background: white;
            padding: 20px;
            border-radius: var(--radius);
            border: 1px solid var(--border);
            text-align: center;
            transition: all 0.2s ease;
        }

        .stat-mini-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow);
        }

        .stat-mini-value {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 4px;
        }

        .stat-mini-label {
            font-size: 0.85rem;
            color: var(--text-light);
            font-weight: 500;
        }

        .field-analysis {
            background: white;
            border-radius: var(--radius);
            border: 1px solid var(--border);
            overflow: hidden;
            margin-bottom: 20px;
        }

        .field-analysis-header {
            background: linear-gradient(135deg, var(--secondary), #059669);
            color: white;
            padding: 16px 20px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .field-list {
            padding: 20px;
            max-height: 400px;
            overflow-y: auto;
        }

        .field-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid var(--border);
        }

        .field-item:last-child {
            border-bottom: none;
        }

        .field-name {
            font-weight: 600;
            color: var(--dark);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .field-type {
            background: rgba(99, 102, 241, 0.1);
            color: var(--primary);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 600;
        }

        .field-stats {
            display: flex;
            gap: 16px;
            font-size: 0.85rem;
            color: var(--text-light);
        }

        .json-viewer {
            background: #1e1e1e;
            color: #d4d4d4;
            padding: 20px;
            border-radius: var(--radius);
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.85rem;
            line-height: 1.6;
            overflow-x: auto;
            border: 1px solid var(--border);
        }

        .json-key {
            color: #9cdcfe;
        }

        .json-string {
            color: #ce9178;
        }

        .json-number {
            color: #b5cea8;
        }

        .json-boolean {
            color: #569cd6;
        }

        .json-null {
            color: #808080;
        }

        /* CRUD Operation Styles */
        .crud-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            background: var(--light);
            border-bottom: 1px solid var(--border);
            flex-wrap: wrap;
            gap: 12px;
        }

        .crud-actions {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .btn.create {
            background: linear-gradient(135deg, var(--secondary), #059669);
        }

        .btn.edit {
            background: linear-gradient(135deg, var(--accent), #d97706);
        }

        .btn.delete {
            background: linear-gradient(135deg, var(--danger), #dc2626);
        }

        .btn.small {
            padding: 6px 12px;
            font-size: 0.8rem;
        }

        .document-actions {
            display: flex;
            gap: 8px;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid var(--border);
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }

        .modal.show {
            display: flex;
        }

        .modal-content {
            background: white;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            max-width: 800px;
            width: 90%;
            max-height: 90%;
            overflow: hidden;
            animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
            from { opacity: 0; transform: translateY(-50px) scale(0.9); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .modal-header {
            padding: 24px;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-title {
            font-size: 1.25rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .modal-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: all 0.2s ease;
        }

        .modal-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .modal-body {
            padding: 24px;
            max-height: 60vh;
            overflow-y: auto;
        }

        .modal-footer {
            padding: 20px 24px;
            background: var(--light);
            border-top: 1px solid var(--border);
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-label {
            display: block;
            font-weight: 600;
            color: var(--dark);
            margin-bottom: 8px;
            font-size: 0.9rem;
        }

        .form-input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid var(--border);
            border-radius: var(--radius);
            font-size: 1rem;
            transition: all 0.2s ease;
            background: white;
        }

        .form-input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .form-textarea {
            min-height: 200px;
            resize: vertical;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9rem;
        }

        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
        }

        .checkbox {
            width: 18px;
            height: 18px;
            accent-color: var(--primary);
        }

        .search-container {
            position: relative;
            flex: 1;
            max-width: 400px;
        }

        .search-input-advanced {
            width: 100%;
            padding: 10px 16px 10px 40px;
            border: 1px solid var(--border);
            border-radius: var(--radius);
            font-size: 0.9rem;
            background: white;
        }

        .search-input-advanced:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .search-icon-advanced {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-light);
        }

        .bulk-actions {
            display: none;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            background: rgba(99, 102, 241, 0.1);
            border-radius: var(--radius);
            margin-bottom: 16px;
        }

        .bulk-actions.show {
            display: flex;
        }

        .selected-count {
            font-weight: 600;
            color: var(--primary);
        }

        .document-checkbox {
            margin-right: 12px;
        }

        .document-row {
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }

        .document-content-wrapper {
            flex: 1;
        }

        .alert {
            padding: 16px;
            border-radius: var(--radius);
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 500;
        }

        .alert.success {
            background: rgba(16, 185, 129, 0.1);
            color: var(--secondary);
            border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .alert.error {
            background: rgba(239, 68, 68, 0.1);
            color: var(--danger);
            border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .alert.warning {
            background: rgba(245, 158, 11, 0.1);
            color: var(--accent);
            border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .loading {
            text-align: center;
            padding: 60px 20px;
            color: var(--text-light);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
        }

        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--border);
            border-top: 3px solid var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .error {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));
            color: var(--danger);
            padding: 20px;
            border-radius: var(--radius);
            margin: 16px 0;
            border: 1px solid rgba(239, 68, 68, 0.2);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .success {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
            color: var(--success);
            padding: 20px;
            border-radius: var(--radius);
            margin: 16px 0;
            border: 1px solid rgba(16, 185, 129, 0.2);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .info {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
            color: var(--info);
            padding: 20px;
            border-radius: var(--radius);
            margin: 16px 0;
            border: 1px solid rgba(59, 130, 246, 0.2);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .empty-state {
            text-align: center;
            padding: 80px 20px;
            color: var(--text-light);
        }

        .empty-state-icon {
            font-size: 4rem;
            margin-bottom: 20px;
            opacity: 0.5;
        }

        .empty-state-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--text);
        }

        .empty-state-text {
            font-size: 1rem;
            max-width: 400px;
            margin: 0 auto;
        }

        .search-box {
            position: relative;
            margin-bottom: 20px;
        }

        .search-input {
            width: 100%;
            padding: 12px 16px 12px 48px;
            border: 1px solid var(--border);
            border-radius: var(--radius);
            font-size: 1rem;
            background: white;
            transition: all 0.2s ease;
        }

        .search-input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .search-icon {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-light);
        }

        .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12px;
            margin-top: 24px;
            padding: 20px;
        }

        .pagination-btn {
            padding: 8px 16px;
            border: 1px solid var(--border);
            background: white;
            color: var(--text);
            border-radius: var(--radius);
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: 500;
        }

        .pagination-btn:hover {
            background: var(--primary);
            color: white;
            border-color: var(--primary);
        }

        .pagination-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .pagination-info {
            color: var(--text-light);
            font-size: 0.9rem;
            margin: 0 16px;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
            .main-content {
                grid-template-columns: 1fr;
                gap: 20px;
            }

            .sidebar {
                position: static;
                order: 2;
            }

            .content-area {
                order: 1;
            }
        }

        @media (max-width: 768px) {
            .container {
                padding: 16px;
            }

            .header {
                padding: 20px;
                margin-bottom: 20px;
            }

            .title {
                font-size: 2rem;
            }

            .header-content {
                flex-direction: column;
                align-items: flex-start;
            }

            .stats-grid {
                grid-template-columns: 1fr;
                gap: 16px;
                margin-bottom: 20px;
            }

            .stat-card {
                padding: 20px;
            }

            .stat-value {
                font-size: 2rem;
            }

            .content-header {
                padding: 16px;
                flex-direction: column;
                align-items: flex-start;
            }

            .documents-container {
                padding: 16px;
            }

            .document {
                padding: 16px;
            }

            .document-content {
                font-size: 0.8rem;
                padding: 12px;
            }
        }

        @media (max-width: 480px) {
            .title {
                font-size: 1.75rem;
            }

            .stat-value {
                font-size: 1.75rem;
            }

            .content-title {
                font-size: 1.25rem;
            }

            .btn {
                padding: 8px 16px;
                font-size: 0.85rem;
            }
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--light);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
            background: var(--border);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--text-light);
        }

        /* Animations */
        .fade-in {
            animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .slide-in {
            animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header fade-in">
            <div class="header-content">
                <div>
                    <h1 class="title">🗄️ AgriNet Database Admin</h1>
                    <p class="subtitle">Modern MongoDB Database Administration Panel</p>
                </div>
                <button class="refresh-btn" onclick="loadStats()">
                    <i class="fas fa-sync-alt"></i>
                    Refresh
                </button>
            </div>
        </div>

        <div id="status" class="loading">
            <div class="loading-spinner"></div>
            <div>Loading database information...</div>
        </div>

        <div class="stats-grid fade-in" id="statsGrid" style="display: none;">
            <div class="stat-card primary">
                <div class="stat-header">
                    <h3>Database</h3>
                    <div class="stat-icon primary">
                        <i class="fas fa-database"></i>
                    </div>
                </div>
                <div class="stat-value" id="dbName">-</div>
                <div class="stat-label">Active Database</div>
            </div>
            <div class="stat-card success">
                <div class="stat-header">
                    <h3>Collections</h3>
                    <div class="stat-icon success">
                        <i class="fas fa-folder"></i>
                    </div>
                </div>
                <div class="stat-value" id="collectionCount">-</div>
                <div class="stat-label">Total Collections</div>
            </div>
            <div class="stat-card warning">
                <div class="stat-header">
                    <h3>Documents</h3>
                    <div class="stat-icon warning">
                        <i class="fas fa-file-alt"></i>
                    </div>
                </div>
                <div class="stat-value" id="documentCount">-</div>
                <div class="stat-label">Total Documents</div>
            </div>
            <div class="stat-card info">
                <div class="stat-header">
                    <h3>Data Size</h3>
                    <div class="stat-icon info">
                        <i class="fas fa-hdd"></i>
                    </div>
                </div>
                <div class="stat-value" id="dataSize">-</div>
                <div class="stat-label">Storage Used</div>
            </div>
        </div>

        <div class="main-content fade-in" id="mainContent" style="display: none;">
            <div class="sidebar">
                <div class="sidebar-header">
                    <div class="sidebar-title">
                        <i class="fas fa-folder-open"></i>
                        Collections
                    </div>
                </div>
                <div class="search-box" style="padding: 16px;">
                    <input type="text" class="search-input" placeholder="Search collections..." id="searchInput">
                    <i class="fas fa-search search-icon"></i>
                </div>
                <div class="collections-list" id="collectionsList"></div>
            </div>

            <div class="content-area">
                <div class="content-header">
                    <div class="content-title" id="contentTitle">
                        <i class="fas fa-table"></i>
                        Select a Collection
                    </div>
                    <div class="content-actions" id="contentActions">
                        <button class="btn create" onclick="showCreateModal()" id="createBtn" style="display: none;">
                            <i class="fas fa-plus"></i>
                            Add Document
                        </button>
                        <button class="btn secondary" onclick="exportCollection()" id="exportBtn" style="display: none;">
                            <i class="fas fa-download"></i>
                            Export
                        </button>
                        <button class="btn" onclick="refreshCollection()" id="refreshBtn" style="display: none;">
                            <i class="fas fa-sync-alt"></i>
                            Refresh
                        </button>
                    </div>
                </div>

                <div class="crud-toolbar" id="crudToolbar" style="display: none;">
                    <div class="search-container">
                        <input type="text" class="search-input-advanced" placeholder="Search documents..." id="documentSearch">
                        <i class="fas fa-search search-icon-advanced"></i>
                    </div>
                    <div class="crud-actions">
                        <button class="btn small" onclick="showAdvancedSearch()">
                            <i class="fas fa-filter"></i>
                            Advanced Search
                        </button>
                        <select class="form-input" style="width: auto;" id="viewMode" onchange="changeViewMode()">
                            <option value="cards">Card View</option>
                            <option value="table">Table View</option>
                            <option value="json">JSON View</option>
                        </select>
                    </div>
                </div>

                <div class="bulk-actions" id="bulkActions">
                    <span class="selected-count" id="selectedCount">0 documents selected</span>
                    <button class="btn delete small" onclick="bulkDelete()">
                        <i class="fas fa-trash"></i>
                        Delete Selected
                    </button>
                    <button class="btn secondary small" onclick="clearSelection()">
                        <i class="fas fa-times"></i>
                        Clear Selection
                    </button>
                </div>

                <div class="documents-container" id="documentsContainer">
                    <div class="empty-state">
                        <div class="empty-state-icon">
                            <i class="fas fa-mouse-pointer"></i>
                        </div>
                        <div class="empty-state-title">Select a Collection</div>
                        <div class="empty-state-text">
                            Choose a collection from the sidebar to view its documents and data.
                        </div>
                    </div>
                </div>

                <div class="visualization-container" id="visualizationContainer" style="display: none;">
                    <div class="visualization-tabs">
                        <button class="tab-button active" onclick="switchTab('overview')" id="overviewTab">
                            <i class="fas fa-chart-pie"></i>
                            Overview
                        </button>
                        <button class="tab-button" onclick="switchTab('table')" id="tableTab">
                            <i class="fas fa-table"></i>
                            Table View
                        </button>
                        <button class="tab-button" onclick="switchTab('charts')" id="chartsTab">
                            <i class="fas fa-chart-bar"></i>
                            Charts
                        </button>
                        <button class="tab-button" onclick="switchTab('json')" id="jsonTab">
                            <i class="fas fa-code"></i>
                            Raw JSON
                        </button>
                    </div>

                    <div class="visualization-content active" id="overviewContent">
                        <div class="stats-overview" id="statsOverview"></div>
                        <div class="field-analysis">
                            <div class="field-analysis-header">
                                <i class="fas fa-microscope"></i>
                                Field Analysis
                            </div>
                            <div class="field-list" id="fieldAnalysis"></div>
                        </div>
                    </div>

                    <div class="visualization-content" id="tableContent">
                        <div class="data-table">
                            <div class="table-header">
                                <i class="fas fa-table"></i>
                                Data Table View
                            </div>
                            <div class="table-content" id="tableData"></div>
                        </div>
                    </div>

                    <div class="visualization-content" id="chartsContent">
                        <div class="chart-container">
                            <div class="chart-title">
                                <i class="fas fa-chart-pie"></i>
                                Data Type Distribution
                            </div>
                            <canvas id="dataTypeChart"></canvas>
                        </div>
                        <div class="chart-container">
                            <div class="chart-title">
                                <i class="fas fa-chart-line"></i>
                                Document Creation Timeline
                            </div>
                            <canvas id="timelineChart"></canvas>
                        </div>
                    </div>

                    <div class="visualization-content" id="jsonContent">
                        <div class="json-viewer" id="jsonViewer"></div>
                    </div>
                </div>
                <div class="pagination" id="pagination" style="display: none;">
                    <button class="pagination-btn" id="prevBtn" onclick="previousPage()">
                        <i class="fas fa-chevron-left"></i>
                        Previous
                    </button>
                    <div class="pagination-info" id="paginationInfo">
                        Page 1 of 1
                    </div>
                    <button class="pagination-btn" id="nextBtn" onclick="nextPage()">
                        Next
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Create/Edit Document Modal -->
    <div class="modal" id="documentModal">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title" id="modalTitle">
                    <i class="fas fa-plus"></i>
                    Create New Document
                </div>
                <button class="modal-close" onclick="closeModal('documentModal')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div id="modalAlert"></div>
                <form id="documentForm">
                    <div class="form-group">
                        <label class="form-label">Document Data (JSON Format)</label>
                        <textarea class="form-input form-textarea" id="documentData" placeholder='{\n  "name": "Example Document",\n  "status": "active",\n  "createdAt": "2024-01-01T00:00:00Z"\n}'></textarea>
                    </div>
                    <div class="form-group">
                        <div class="checkbox-group">
                            <input type="checkbox" class="checkbox" id="validateJson" checked>
                            <label for="validateJson">Validate JSON before saving</label>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn secondary" onclick="closeModal('documentModal')">
                    <i class="fas fa-times"></i>
                    Cancel
                </button>
                <button class="btn create" onclick="saveDocument()" id="saveBtn">
                    <i class="fas fa-save"></i>
                    Save Document
                </button>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal" id="deleteModal">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title">
                    <i class="fas fa-exclamation-triangle"></i>
                    Confirm Delete
                </div>
                <button class="modal-close" onclick="closeModal('deleteModal')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p id="deleteMessage">Are you sure you want to delete this document? This action cannot be undone.</p>
            </div>
            <div class="modal-footer">
                <button class="btn secondary" onclick="closeModal('deleteModal')">
                    <i class="fas fa-times"></i>
                    Cancel
                </button>
                <button class="btn delete" onclick="confirmDelete()" id="confirmDeleteBtn">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            </div>
        </div>
    </div>

    <!-- Advanced Search Modal -->
    <div class="modal" id="searchModal">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title">
                    <i class="fas fa-search"></i>
                    Advanced Search
                </div>
                <button class="modal-close" onclick="closeModal('searchModal')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Search Query (MongoDB Query Format)</label>
                    <textarea class="form-input form-textarea" id="searchQuery" placeholder='{\n  "status": "active",\n  "createdAt": {\n    "$gte": "2024-01-01T00:00:00Z"\n  }\n}'></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Limit Results</label>
                    <input type="number" class="form-input" id="searchLimit" value="50" min="1" max="1000">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn secondary" onclick="closeModal('searchModal')">
                    <i class="fas fa-times"></i>
                    Cancel
                </button>
                <button class="btn" onclick="executeAdvancedSearch()">
                    <i class="fas fa-search"></i>
                    Search
                </button>
            </div>
        </div>
    </div>
    
    <script>
        let currentCollection = null;
        let currentPage = 1;
        let totalPages = 1;
        let documentsPerPage = 20;
        let selectedDocuments = new Set();
        let currentEditingId = null;
        let currentViewMode = 'cards';

        async function loadStats() {
            try {
                console.log('🔍 Loading database stats...');

                const response = await fetch('/api/stats');
                console.log('📥 Response status:', response.status);

                if (!response.ok) {
                    throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
                }

                const data = await response.json();
                console.log('📊 Database data received:', data);

                // Hide loading and show content
                document.getElementById('status').style.display = 'none';
                document.getElementById('statsGrid').style.display = 'grid';
                document.getElementById('mainContent').style.display = 'grid';

                // Update stats
                document.getElementById('dbName').textContent = data.database || 'Unknown';
                document.getElementById('collectionCount').textContent = data.collections?.length || 0;
                document.getElementById('documentCount').textContent = data.collections?.reduce((sum, col) => sum + (col.count || 0), 0) || 0;
                document.getElementById('dataSize').textContent = formatBytes(data.dbStats?.dataSize || 0);

                // Update collections list
                const collectionsList = document.getElementById('collectionsList');
                if (data.collections && data.collections.length > 0) {
                    collectionsList.innerHTML = data.collections.map(col =>
                        \`<div class="collection-item slide-in" onclick="loadCollection('\${col.name}')" data-collection="\${col.name}">
                            <div class="collection-info">
                                <div class="collection-name">
                                    <i class="fas fa-table collection-icon"></i>
                                    \${col.name}
                                </div>
                                <div class="collection-count">\${(col.count || 0).toLocaleString()} documents</div>
                            </div>
                        </div>\`
                    ).join('');
                } else {
                    collectionsList.innerHTML = \`
                        <div class="empty-state" style="padding: 40px 20px;">
                            <div class="empty-state-icon">
                                <i class="fas fa-database"></i>
                            </div>
                            <div class="empty-state-title">No Collections Found</div>
                            <div class="empty-state-text">
                                Your database doesn't have any collections yet.
                            </div>
                        </div>
                    \`;
                }

                // Add search functionality
                setupSearch();

                console.log('✅ Database stats loaded successfully');

            } catch (error) {
                console.error('🚨 Error loading stats:', error);
                document.getElementById('status').innerHTML = \`
                    <div class="error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <div>
                            <strong>Failed to load database information</strong><br>
                            \${error.message}
                        </div>
                    </div>
                    <div style="margin-top: 16px;">
                        <button class="btn" onclick="loadStats()">
                            <i class="fas fa-sync-alt"></i>
                            Retry
                        </button>
                    </div>
                \`;
            }
        }

        function setupSearch() {
            const searchInput = document.getElementById('searchInput');
            const collectionItems = document.querySelectorAll('.collection-item');

            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();

                collectionItems.forEach(item => {
                    const collectionName = item.dataset.collection.toLowerCase();
                    if (collectionName.includes(searchTerm)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }
        
        async function loadCollection(name) {
            try {
                currentCollection = name;
                currentPage = 1;
                selectedDocuments.clear();

                // Update active collection
                document.querySelectorAll('.collection-item').forEach(item => {
                    item.classList.remove('active');
                });
                document.querySelector(\`[data-collection="\${name}"]\`).classList.add('active');

                // Update content header
                document.getElementById('contentTitle').innerHTML = \`
                    <i class="fas fa-table"></i>
                    \${name}
                \`;
                document.getElementById('createBtn').style.display = 'flex';
                document.getElementById('exportBtn').style.display = 'flex';
                document.getElementById('refreshBtn').style.display = 'flex';
                document.getElementById('crudToolbar').style.display = 'flex';

                // Show loading
                document.getElementById('documentsContainer').innerHTML = \`
                    <div class="loading">
                        <div class="loading-spinner"></div>
                        <div>Loading documents from \${name}...</div>
                    </div>
                \`;

                await loadDocuments();

            } catch (error) {
                document.getElementById('documentsContainer').innerHTML = \`
                    <div class="error">
                        <i class="fas fa-exclamation-triangle"></i>
                        Error: \${error.message}
                    </div>
                \`;
            }
        }

        async function loadDocuments() {
            try {
                const skip = (currentPage - 1) * documentsPerPage;
                const response = await fetch(\`/api/collection/\${currentCollection}?limit=\${documentsPerPage}&skip=\${skip}\`);
                const data = await response.json();

                const documentsContainer = document.getElementById('documentsContainer');

                if (data.documents.length === 0) {
                    documentsContainer.innerHTML = \`
                        <div class="empty-state">
                            <div class="empty-state-icon">
                                <i class="fas fa-inbox"></i>
                            </div>
                            <div class="empty-state-title">No Documents Found</div>
                            <div class="empty-state-text">
                                This collection doesn't contain any documents yet.
                            </div>
                        </div>
                    \`;
                } else {
                    if (currentViewMode === 'cards') {
                        documentsContainer.innerHTML = data.documents.map((doc, index) => {
                            const docId = doc._id || 'No ID';
                            const docNumber = skip + index + 1;

                            return \`
                                <div class="document fade-in">
                                    <div class="document-row">
                                        <input type="checkbox" class="checkbox document-checkbox"
                                               value="\${docId}" onchange="toggleDocumentSelection('\${docId}')">
                                        <div class="document-content-wrapper">
                                            <div class="document-header">
                                                <div class="document-title">Document #\${docNumber}</div>
                                                <div class="document-id">\${docId}</div>
                                            </div>
                                            <div class="document-content">\${JSON.stringify(doc, null, 2)}</div>
                                            <div class="document-actions">
                                                <button class="btn edit small" onclick="editDocument('\${docId}')">
                                                    <i class="fas fa-edit"></i>
                                                    Edit
                                                </button>
                                                <button class="btn delete small" onclick="deleteDocument('\${docId}')">
                                                    <i class="fas fa-trash"></i>
                                                    Delete
                                                </button>
                                                <button class="btn secondary small" onclick="viewDocument('\${docId}')">
                                                    <i class="fas fa-eye"></i>
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            \`;
                        }).join('');
                    } else if (currentViewMode === 'table') {
                        renderTableView(data.documents);
                    } else if (currentViewMode === 'json') {
                        renderJsonView(data.documents);
                    }
                }

                // Update pagination
                totalPages = Math.ceil(data.count / documentsPerPage);
                updatePagination(data.count);

            } catch (error) {
                document.getElementById('documentsContainer').innerHTML = \`
                    <div class="error">
                        <i class="fas fa-exclamation-triangle"></i>
                        Error loading documents: \${error.message}
                    </div>
                \`;
            }
        }

        function updatePagination(totalCount) {
            const pagination = document.getElementById('pagination');
            const paginationInfo = document.getElementById('paginationInfo');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');

            if (totalPages > 1) {
                pagination.style.display = 'flex';
                paginationInfo.textContent = \`Page \${currentPage} of \${totalPages} (\${totalCount.toLocaleString()} documents)\`;

                prevBtn.disabled = currentPage === 1;
                nextBtn.disabled = currentPage === totalPages;
            } else {
                pagination.style.display = 'none';
            }
        }

        function previousPage() {
            if (currentPage > 1) {
                currentPage--;
                loadDocuments();
            }
        }

        function nextPage() {
            if (currentPage < totalPages) {
                currentPage++;
                loadDocuments();
            }
        }

        function refreshCollection() {
            if (currentCollection) {
                loadDocuments();
            }
        }

        function exportCollection() {
            if (currentCollection) {
                const url = \`/api/collection/\${currentCollection}?limit=1000\`;
                window.open(url, '_blank');
            }
        }

        // CRUD Operations
        function showCreateModal() {
            currentEditingId = null;
            document.getElementById('modalTitle').innerHTML = \`
                <i class="fas fa-plus"></i>
                Create New Document
            \`;
            document.getElementById('documentData').value = '{\n  \n}';
            document.getElementById('saveBtn').innerHTML = \`
                <i class="fas fa-save"></i>
                Create Document
            \`;
            document.getElementById('modalAlert').innerHTML = '';
            showModal('documentModal');
        }

        async function editDocument(id) {
            try {
                currentEditingId = id;
                document.getElementById('modalTitle').innerHTML = \`
                    <i class="fas fa-edit"></i>
                    Edit Document
                \`;
                document.getElementById('saveBtn').innerHTML = \`
                    <i class="fas fa-save"></i>
                    Update Document
                \`;

                const response = await fetch(\`/api/collection/\${currentCollection}/document/\${id}\`);
                const document = await response.json();

                document.getElementById('documentData').value = JSON.stringify(document, null, 2);
                document.getElementById('modalAlert').innerHTML = '';
                showModal('documentModal');

            } catch (error) {
                showAlert('error', \`Failed to load document: \${error.message}\`);
            }
        }

        function deleteDocument(id) {
            currentEditingId = id;
            document.getElementById('deleteMessage').textContent =
                'Are you sure you want to delete this document? This action cannot be undone.';
            showModal('deleteModal');
        }

        async function saveDocument() {
            try {
                const documentData = document.getElementById('documentData').value;
                const validateJson = document.getElementById('validateJson').checked;

                // Validate JSON if checkbox is checked
                let parsedData;
                try {
                    parsedData = JSON.parse(documentData);
                } catch (error) {
                    if (validateJson) {
                        showModalAlert('error', \`Invalid JSON: \${error.message}\`);
                        return;
                    }
                }

                let response;
                if (currentEditingId) {
                    // Update existing document
                    response = await fetch(\`/api/collection/\${currentCollection}/document/\${currentEditingId}\`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(parsedData)
                    });
                } else {
                    // Create new document
                    response = await fetch(\`/api/collection/\${currentCollection}/document\`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(parsedData)
                    });
                }

                const result = await response.json();

                if (response.ok) {
                    closeModal('documentModal');
                    showAlert('success', result.message);
                    await loadDocuments();
                } else {
                    showModalAlert('error', result.error);
                }

            } catch (error) {
                showModalAlert('error', \`Failed to save document: \${error.message}\`);
            }
        }

        async function confirmDelete() {
            try {
                const response = await fetch(\`/api/collection/\${currentCollection}/document/\${currentEditingId}\`, {
                    method: 'DELETE'
                });

                const result = await response.json();

                if (response.ok) {
                    closeModal('deleteModal');
                    showAlert('success', result.message);
                    await loadDocuments();
                } else {
                    showAlert('error', result.error);
                }

            } catch (error) {
                showAlert('error', \`Failed to delete document: \${error.message}\`);
            }
        }

        function toggleDocumentSelection(id) {
            if (selectedDocuments.has(id)) {
                selectedDocuments.delete(id);
            } else {
                selectedDocuments.add(id);
            }
            updateBulkActions();
        }

        function updateBulkActions() {
            const bulkActions = document.getElementById('bulkActions');
            const selectedCount = document.getElementById('selectedCount');

            if (selectedDocuments.size > 0) {
                bulkActions.classList.add('show');
                selectedCount.textContent = \`\${selectedDocuments.size} document\${selectedDocuments.size > 1 ? 's' : ''} selected\`;
            } else {
                bulkActions.classList.remove('show');
            }
        }

        async function bulkDelete() {
            if (selectedDocuments.size === 0) return;

            const count = selectedDocuments.size;
            document.getElementById('deleteMessage').textContent =
                \`Are you sure you want to delete \${count} document\${count > 1 ? 's' : ''}? This action cannot be undone.\`;

            document.getElementById('confirmDeleteBtn').onclick = async () => {
                try {
                    const response = await fetch(\`/api/collection/\${currentCollection}/documents\`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ids: Array.from(selectedDocuments) })
                    });

                    const result = await response.json();

                    if (response.ok) {
                        closeModal('deleteModal');
                        showAlert('success', result.message);
                        selectedDocuments.clear();
                        updateBulkActions();
                        await loadDocuments();
                    } else {
                        showAlert('error', result.error);
                    }

                } catch (error) {
                    showAlert('error', \`Failed to delete documents: \${error.message}\`);
                }
            };

            showModal('deleteModal');
        }

        function clearSelection() {
            selectedDocuments.clear();
            document.querySelectorAll('.document-checkbox').forEach(cb => cb.checked = false);
            updateBulkActions();
        }
        
        function formatBytes(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'r':
                        e.preventDefault();
                        loadStats();
                        break;
                    case 'f':
                        e.preventDefault();
                        document.getElementById('searchInput').focus();
                        break;
                }
            }
        });

        // Auto-refresh every 30 seconds
        setInterval(() => {
            if (document.visibilityState === 'visible') {
                loadStats();
            }
        }, 30000);

        // Modal and UI utility functions
        function showModal(modalId) {
            document.getElementById(modalId).classList.add('show');
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('show');
        }

        function showAlert(type, message) {
            const alertContainer = document.createElement('div');
            alertContainer.className = \`alert \${type}\`;
            alertContainer.innerHTML = \`
                <i class="fas fa-\${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
                \${message}
            \`;

            document.querySelector('.content-area').insertBefore(alertContainer, document.querySelector('.content-area').firstChild);

            setTimeout(() => {
                alertContainer.remove();
            }, 5000);
        }

        function showModalAlert(type, message) {
            const modalAlert = document.getElementById('modalAlert');
            modalAlert.innerHTML = \`
                <div class="alert \${type}">
                    <i class="fas fa-\${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
                    \${message}
                </div>
            \`;
        }

        function changeViewMode() {
            currentViewMode = document.getElementById('viewMode').value;
            loadDocuments();
        }

        function renderTableView(documents) {
            if (documents.length === 0) return;

            // Get all unique keys from documents
            const allKeys = new Set();
            documents.forEach(doc => {
                Object.keys(doc).forEach(key => allKeys.add(key));
            });

            const keys = Array.from(allKeys);

            const tableHtml = \`
                <div class="data-table">
                    <div class="table-header">
                        <i class="fas fa-table"></i>
                        Table View - \${documents.length} documents
                    </div>
                    <div class="table-content">
                        \${documents.map(doc => \`
                            <div class="table-row">
                                <div class="table-cell">
                                    <input type="checkbox" class="checkbox document-checkbox"
                                           value="\${doc._id}" onchange="toggleDocumentSelection('\${doc._id}')">
                                </div>
                                \${keys.map(key => \`
                                    <div class="table-cell">
                                        <div class="cell-label">\${key}</div>
                                        <div class="cell-value \${getValueType(doc[key])}">\${formatValue(doc[key])}</div>
                                    </div>
                                \`).join('')}
                                <div class="table-cell">
                                    <div class="cell-label">Actions</div>
                                    <div style="display: flex; gap: 8px;">
                                        <button class="btn edit small" onclick="editDocument('\${doc._id}')">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn delete small" onclick="deleteDocument('\${doc._id}')">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        \`).join('')}
                    </div>
                </div>
            \`;

            document.getElementById('documentsContainer').innerHTML = tableHtml;
        }

        function renderJsonView(documents) {
            const jsonHtml = \`
                <div class="json-viewer">
                    \${JSON.stringify(documents, null, 2)}
                </div>
            \`;

            document.getElementById('documentsContainer').innerHTML = jsonHtml;
        }

        function getValueType(value) {
            if (value === null) return 'null';
            if (typeof value === 'boolean') return 'boolean';
            if (typeof value === 'number') return 'number';
            if (value instanceof Date || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value))) return 'date';
            return 'string';
        }

        function formatValue(value) {
            if (value === null || value === undefined) return 'null';
            if (typeof value === 'object') return JSON.stringify(value);
            if (typeof value === 'string' && value.length > 100) return value.substring(0, 100) + '...';
            return String(value);
        }

        function showAdvancedSearch() {
            document.getElementById('searchQuery').value = '{}';
            showModal('searchModal');
        }

        async function executeAdvancedSearch() {
            try {
                const query = JSON.parse(document.getElementById('searchQuery').value);
                const limit = parseInt(document.getElementById('searchLimit').value);

                const response = await fetch(\`/api/collection/\${currentCollection}/search\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query, limit })
                });

                const data = await response.json();

                if (response.ok) {
                    closeModal('searchModal');
                    // Update documents container with search results
                    const documentsContainer = document.getElementById('documentsContainer');
                    if (data.documents.length === 0) {
                        documentsContainer.innerHTML = \`
                            <div class="empty-state">
                                <div class="empty-state-icon">
                                    <i class="fas fa-search"></i>
                                </div>
                                <div class="empty-state-title">No Results Found</div>
                                <div class="empty-state-text">
                                    No documents match your search criteria.
                                </div>
                            </div>
                        \`;
                    } else {
                        // Render search results using current view mode
                        if (currentViewMode === 'cards') {
                            documentsContainer.innerHTML = data.documents.map((doc, index) => {
                                const docId = doc._id || 'No ID';

                                return \`
                                    <div class="document fade-in">
                                        <div class="document-row">
                                            <input type="checkbox" class="checkbox document-checkbox"
                                                   value="\${docId}" onchange="toggleDocumentSelection('\${docId}')">
                                            <div class="document-content-wrapper">
                                                <div class="document-header">
                                                    <div class="document-title">Search Result #\${index + 1}</div>
                                                    <div class="document-id">\${docId}</div>
                                                </div>
                                                <div class="document-content">\${JSON.stringify(doc, null, 2)}</div>
                                                <div class="document-actions">
                                                    <button class="btn edit small" onclick="editDocument('\${docId}')">
                                                        <i class="fas fa-edit"></i>
                                                        Edit
                                                    </button>
                                                    <button class="btn delete small" onclick="deleteDocument('\${docId}')">
                                                        <i class="fas fa-trash"></i>
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                \`;
                            }).join('');
                        } else if (currentViewMode === 'table') {
                            renderTableView(data.documents);
                        } else if (currentViewMode === 'json') {
                            renderJsonView(data.documents);
                        }
                    }

                    showAlert('success', \`Found \${data.documents.length} documents matching your search.\`);
                } else {
                    showModalAlert('error', data.error);
                }

            } catch (error) {
                showModalAlert('error', \`Invalid search query: \${error.message}\`);
            }
        }

        function viewDocument(id) {
            // This could open a read-only modal or navigate to a detail view
            editDocument(id);
        }

        // Setup document search
        document.addEventListener('DOMContentLoaded', () => {
            const documentSearch = document.getElementById('documentSearch');
            if (documentSearch) {
                documentSearch.addEventListener('input', (e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    const documents = document.querySelectorAll('.document');

                    documents.forEach(doc => {
                        const content = doc.textContent.toLowerCase();
                        if (content.includes(searchTerm)) {
                            doc.style.display = 'block';
                        } else {
                            doc.style.display = 'none';
                        }
                    });
                });
            }
        });

        // Enhanced page load with better error handling
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🚀 DOM Content Loaded - Starting admin panel...');

            // Add connection test
            testConnection();

            // Load stats with retry logic
            loadStatsWithRetry();
        });

        async function testConnection() {
            try {
                console.log('🔗 Testing backend connection...');
                const response = await fetch('/api/stats');
                console.log('📡 Connection test result:', response.status, response.statusText);

                if (response.ok) {
                    console.log('✅ Backend connection successful');
                } else {
                    console.log('❌ Backend connection failed:', response.status);
                }
            } catch (error) {
                console.error('🚨 Connection test error:', error);
            }
        }

        async function loadStatsWithRetry(retryCount = 0) {
            const maxRetries = 3;

            try {
                await loadStats();
            } catch (error) {
                console.error(\`🚨 Load stats attempt \${retryCount + 1} failed:\`, error);

                if (retryCount < maxRetries) {
                    console.log(\`🔄 Retrying in 2 seconds... (attempt \${retryCount + 2}/\${maxRetries + 1})\`);
                    setTimeout(() => {
                        loadStatsWithRetry(retryCount + 1);
                    }, 2000);
                } else {
                    console.error('❌ All retry attempts failed');
                    document.getElementById('status').innerHTML = \`
                        <div class="error">
                            <i class="fas fa-exclamation-triangle"></i>
                            <div>
                                <strong>Unable to connect to database</strong><br>
                                Please check if the backend server is running and try again.
                            </div>
                        </div>
                        <div style="margin-top: 16px;">
                            <button class="btn" onclick="location.reload()">
                                <i class="fas fa-sync-alt"></i>
                                Reload Page
                            </button>
                            <button class="btn secondary" onclick="testConnection()">
                                <i class="fas fa-network-wired"></i>
                                Test Connection
                            </button>
                        </div>
                    \`;
                }
            }
        }

        // Fallback for older browsers
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                console.log('🚀 Fallback DOM load triggered');
            });
        } else {
            console.log('🚀 DOM already loaded - Starting admin panel...');
            testConnection();
            loadStatsWithRetry();
        }
    </script>
</body>
</html>
  `);
});

// Start the admin server
connectDB();

app.listen(PORT, () => {
  console.log('🗄️ Database Admin Panel started');
  console.log('🌐 URL: http://localhost:' + PORT);
  console.log('📊 Features: View collections, documents, and database stats');
});

module.exports = app;
