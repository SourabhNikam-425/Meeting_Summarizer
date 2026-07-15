import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { uploadMiddleware } from '../../middleware/upload.middleware.js';
import {
  uploadMeeting,
  listMeetings,
  getMeeting,
  removeMeeting,
  toggleItem } from
'../controllers/meeting.controller.js';

const router = Router();

// All meeting routes require auth
router.use(authMiddleware);

router.get('/', listMeetings);
router.post('/upload', uploadMiddleware.single('audio'), uploadMeeting);
router.get('/:id', getMeeting);
router.delete('/:id', removeMeeting);
router.patch('/:id/action-items/:itemId/toggle', toggleItem);

export default router;