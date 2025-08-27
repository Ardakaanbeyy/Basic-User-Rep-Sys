import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB bağlantısı (Docker ortamı için güncellenmiş)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reports';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Report Schema
const reportSchema = new mongoose.Schema({
  title_id: {
    type: Number,
    required: true
  },
  chapter_num: {
    type: Number,
    required: false
  },
  chapternumbers: {
    type: String,
    required: false
  },
  reason: {
    type: String,
    required: true
  },
  approved: {
    type: Boolean,
    default: false
  },
  deleted: {
    type: Boolean,
    default: false
  },
  approved_by_ip: {
    type: String,
    required: false
  },
  deleted_by_ip: {
    type: String,
    required: false
  },
  approved_at: {
    type: Date,
    required: false
  },
  deleted_at: {
    type: Date,
    required: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Report = mongoose.model('Report', reportSchema);

// Client IP adresini alma fonksiyonu
function getClientIP(req) {
  return req.headers['x-forwarded-for'] || 
         req.headers['x-real-ip'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         req.ip ||
         '0.0.0.0';
}

// Routes

app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.find({ deleted: false }).sort({ created_at: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/reports/approved', async (req, res) => {
  try {
    const reports = await Report.find({ approved: true, deleted: false }).sort({ created_at: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/reports/pending', async (req, res) => {
  try {
    const reports = await Report.find({ approved: false, deleted: false }).sort({ created_at: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reports', async (req, res) => {
  try {
    const { report } = req.body;
    const newReport = new Report(report);
    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/reports/:id/approve', async (req, res) => {
  try {
    const clientIP = getClientIP(req);
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { 
        approved: true,
        approved_by_ip: clientIP,
        approved_at: new Date()
      },
      { new: true }
    );
    if (!report) {
      return res.status(404).json({ error: 'Rapor bulunamadı' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/reports/:id', async (req, res) => {
  try {
    const clientIP = getClientIP(req);
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { 
        deleted: true,
        deleted_by_ip: clientIP,
        deleted_at: new Date()
      },
      { new: true }
    );
    if (!report) {
      return res.status(404).json({ error: 'Rapor bulunamadı' });
    }
    res.json({ message: 'Rapor başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});