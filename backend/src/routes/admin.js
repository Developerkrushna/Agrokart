const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Middleware to check admin access
const adminAuth = (req, res, next) => {
  // For demo purposes, we'll allow access
  // In production, add proper authentication
  next();
};

// Get database statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    // Get database stats
    const dbStats = await db.stats();
    
    // Get collection names
    const collections = await db.listCollections().toArray();
    
    // Get collection stats
    const collectionStats = [];
    for (const collection of collections) {
      try {
        const stats = await db.collection(collection.name).stats();
        collectionStats.push({
          name: collection.name,
          count: stats.count,
          size: stats.size,
          avgObjSize: stats.avgObjSize,
          storageSize: stats.storageSize,
          indexes: stats.nindexes
        });
      } catch (error) {
        collectionStats.push({
          name: collection.name,
          error: error.message
        });
      }
    }
    
    res.json({
      database: {
        name: db.databaseName,
        collections: dbStats.collections,
        objects: dbStats.objects,
        dataSize: dbStats.dataSize,
        storageSize: dbStats.storageSize,
        indexes: dbStats.indexes,
        indexSize: dbStats.indexSize
      },
      collections: collectionStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get collections list
router.get('/collections', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    res.json(collections.map(col => col.name));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get documents from a collection
router.get('/collections/:name', adminAuth, async (req, res) => {
  try {
    const { name } = req.params;
    const { page = 1, limit = 20, sort = '_id', order = 'desc' } = req.query;
    
    const db = mongoose.connection.db;
    const collection = db.collection(name);
    
    const skip = (page - 1) * limit;
    const sortObj = { [sort]: order === 'desc' ? -1 : 1 };
    
    const documents = await collection
      .find({})
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();
    
    const total = await collection.countDocuments();
    
    res.json({
      documents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific document
router.get('/collections/:name/:id', adminAuth, async (req, res) => {
  try {
    const { name, id } = req.params;
    const db = mongoose.connection.db;
    const collection = db.collection(name);
    
    const document = await collection.findOne({ _id: new mongoose.Types.ObjectId(id) });
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new document
router.post('/collections/:name', adminAuth, async (req, res) => {
  try {
    const { name } = req.params;
    const document = req.body;
    
    const db = mongoose.connection.db;
    const collection = db.collection(name);
    
    const result = await collection.insertOne(document);
    
    res.json({
      success: true,
      insertedId: result.insertedId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a document
router.put('/collections/:name/:id', adminAuth, async (req, res) => {
  try {
    const { name, id } = req.params;
    const update = req.body;
    
    const db = mongoose.connection.db;
    const collection = db.collection(name);
    
    const result = await collection.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: update }
    );
    
    res.json({
      success: true,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a document
router.delete('/collections/:name/:id', adminAuth, async (req, res) => {
  try {
    const { name, id } = req.params;
    
    const db = mongoose.connection.db;
    const collection = db.collection(name);
    
    const result = await collection.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    
    res.json({
      success: true,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Execute a custom query
router.post('/query/:name', adminAuth, async (req, res) => {
  try {
    const { name } = req.params;
    const { query, options = {} } = req.body;
    
    const db = mongoose.connection.db;
    const collection = db.collection(name);
    
    const results = await collection.find(query, options).toArray();
    
    res.json({
      results,
      count: results.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
