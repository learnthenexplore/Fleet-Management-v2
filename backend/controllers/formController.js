 // controllers/formController.js
import Form from '../models/Form.js'; 

// @desc    Create or Update Start Your Day Form (one per user per day)
// @route   POST /api/vehicle-report/start
export const saveStartForm = async (req, res) => {
  try { 
    console.log('Saving start form for user:', req.body);
    const { userId, tripDetails, checklist, notes, repairReported, mechanicPin, driverPin } = req.body;
    console.log('Saving start form for user:', req.body);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const localDateString = today.toLocaleDateString('en-CA'); // YYYY-MM-DD (local)

    let form = await Form.findOne({ userId, date: localDateString });

    if (!form) {
      form = new Form({
        userId,
        date: localDateString,
        tripDetails,
        checklist,
        notes,
        repairReported,
        mechanicPin,
        driverPin
      });
    } else {
      form.tripDetails = tripDetails;
      form.checklist = checklist;
      form.notes = notes;
      form.repairReported = repairReported;
      form.mechanicPin = mechanicPin;
      form.driverPin = driverPin;
    }

    await form.save();
    return res.status(200).json(form);
  } catch (err) {
    console.error('Save start form failed:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};



// @desc    Add or Update Trip Rows
// @route   POST /api/vehicle-report/trip
// @desc    Add or Update Trip Rows
// @route   PUT /api/vehicle-report/:formId/addtrip
// controllers/formController.js
export const addTripRow = async (req, res) => {
  try {
    const { formId } = req.params;
    const newTripRow = req.body; // one new row
    console.log('Adding trip row:', newTripRow);
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    form.tripRows.push(newTripRow); // push one new trip
    await form.save();

    const addedRow = form.tripRows[form.tripRows.length - 1]; // last added row

    return res.status(200).json({ tripRow: addedRow }); // send back the new row with _id
  } catch (err) {
    console.error('❌ Failed to add trip row:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};




// @desc    Save Breakdown Details
// @route   POST /api/vehicle-report/breakdown
export const saveBreakdown = async (req, res) => {
  console.log('✅ Saving breakdown details:', req.body);

  try {
    const { formId } = req.params;
    const { breakdownNote, footerPins } = req.body;

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    form.breakdownNote = breakdownNote;
    form.footerPins = footerPins;

    await form.save();
    return res.status(200).json(form);
  } catch (err) {
    console.error('❌ Save breakdown failed:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Get Today Form by User
// @route   GET /api/vehicle-report/today/:userId
// @desc    Get Today Form by User
// @route   GET /api/vehicle-report/today/:userId
export const getTodayForm = async (req, res) => {
  // console.log('✅ Fetching today form for userId:', req.params.userId);
  try {
    const userId = req.params.userId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const localDateString = today.toLocaleDateString('en-CA'); // 'YYYY-MM-DD'

    const form = await Form.findOne({ userId, date: localDateString }).lean(); // Removed .populate

    if (!form) {
      return res.status(404).json({ error: 'Form not found for today' });
    }

    // console.log('📄 Found full form:', form);
    return res.status(200).json(form);
  } catch (err) {
    console.error('❌ Get today form failed:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Get Full Form by ID (used in View Detail)
// @route   GET /api/vehicle-report/:formId
 export const getFormById = async (req, res) => {
  try {
    console.log('Fetching form by ID');
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ error: 'Form not found' });
    return res.status(200).json(form);
  } catch (err) {
    // console.error('Get form by ID failed:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
export const endTripRow = async (req, res) => {
  try {
    const { formId, tripId } = req.params;

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const trip = form.tripRows.id(tripId); // find nested trip
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    trip.status = 'completed';
    trip.endTime = new Date(); // you can send from frontend too

    await form.save();
    return res.status(200).json({ message: 'Trip ended successfully', trip });
  } catch (err) {
    console.error('❌ Error ending trip:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Update closeKM and closeHMR in tripDetails
// @route   PATCH /api/vehicle-report/:formId/close-values
export const updateCloseValues = async (req, res) => {
  try {
    const { formId } = req.params;
    const { closeKM, closeHMR } = req.body;

    if (!closeKM && !closeHMR) {
      return res.status(400).json({ error: 'Please provide at least closeKM or closeHMR' });
    }

    const updateFields = {};
    if (closeKM) updateFields['tripDetails.closeKM'] = closeKM;
    if (closeHMR) updateFields['tripDetails.closeHMR'] = closeHMR;

    const updatedForm = await Form.findByIdAndUpdate(
      formId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ error: 'Form not found' });
    }

    return res.status(200).json({ message: 'Close values updated successfully', form: updatedForm });
  } catch (err) {
    console.error('❌ Error updating close values:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
// @desc    Get all forms submitted by a specific user (driver)
// @route   GET /api/form/user/:userId/forms
 

export const getFormsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const forms = await Form.find({ userId })
      .sort({ date: -1 }) // Latest forms first
      .select('_id date tripDetails.dumperNumber'); // Selecting only required fields

    const formattedForms = forms.map(form => ({
      formId: form._id,
      date: form.date,
      dumperNumber: form.tripDetails?.dumperNumber || 'N/A'
    }));

    res.status(200).json(formattedForms);
  } catch (err) {
    console.error('❌ Error fetching user forms:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllForms = async (req, res) => {
  try {
    console.log('🔍 Fetching all forms...');
    const forms = await Form.find().sort({ createdAt: -1 }).lean();

    if (!forms) {
      return res.status(404).json({ success: false, message: 'No forms found' });
    }

    res.status(200).json({
      success: true,
      count: forms.length,
      forms,
    });
  } catch (err) {
    console.error('❌ Error in getAllForms:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error in getAllForms',
    });
  }
};

