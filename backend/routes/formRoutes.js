import express from 'express';
import {
  saveStartForm,
   addTripRow,
  saveBreakdown,
  getTodayForm,
  endTripRow,
  getFormById,
  updateCloseValues,
   getFormsByUser,
   getAllForms,
} from '../controllers/formController.js';

const router = express.Router();

// ✅ Save "Start Your Day" section (create or update today's form)
router.post('/start', saveStartForm);

// ✅ Save trip rows (Add Trip)
// ✅ Correct route in `vehicleReportRoutes.js` or similar:
router.post('/:formId/addtrip', addTripRow );
// ✅ Save breakdown section
router.put('/:formId/breakdown', saveBreakdown);
 

// ✅ Get today's form by userId (used to decide UI rendering)
router.get('/today/:userId', getTodayForm);
router.put('/:formId/trip/:tripId/end', endTripRow);
 

router.patch('/vehicle-report/:formId/close-values', updateCloseValues);
router.get('/user/:userId/forms', getFormsByUser);


// ✅ Get form by form ID (used in view detail)
router.get('/all', getAllForms);
router.get('/:formId', getFormById);

export default router;
