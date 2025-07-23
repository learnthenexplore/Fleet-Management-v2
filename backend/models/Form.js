import mongoose from 'mongoose';  

const tripRowSchema = new mongoose.Schema({
  startTime: String, // ⬅️ changed from Date to String (e.g., "18:26")
  endTime: String,   // ⬅️ same here
  machine: String,
  material: String,
  site: String,
  status: {
    type: String,
    enum: ['running', 'completed'],
    default: 'running',
  },
  path: [
    {
      lat: Number,
      lng: Number,
      time: Date,
    }
  ]
});

const formSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // Format: "YYYY-MM-DD"
    required: true
  },

  // Section 1: Start Your Day
  tripDetails: {
    tripDate: String,
    shift: String,
    relay: String,
    driverName: String,
    dumperNumber: String,
    operatorId: String,
    startHMR: String,
    closeHMR: String,
    startKM: String,
    closeKM: String
  },
  checklist: {
    type: Map,
    of: String // index: 'OK' | 'Not OK'
  },
  notes: String,
  repairReported: String, // "yes" | "no"
  mechanicPin: String,
  driverPin: String,

  // Section 2: Add Trip
  tripRows: [tripRowSchema],

  // Section 3: Breakdown
  breakdownNote: String,
  footerPins: {
    driver: String,
    supervisor: String,
    incharge: String
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('VehicleForm', formSchema);
