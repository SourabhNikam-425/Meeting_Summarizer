import api from './api';

export async function uploadMeeting(title, file) {
  const form = new FormData();
  form.append('title', title);
  form.append('audio', file);
  const res = await api.post('/meetings/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data.data;
}

export async function getMeetings() {
  const res = await api.get('/meetings');
  return res.data.data;
}

export async function getMeeting(id) {
  const res = await api.get(`/meetings/${id}`);
  return res.data.data;
}

export async function deleteMeeting(id) {
  await api.delete(`/meetings/${id}`);
}

export async function toggleActionItem(meetingId, itemId) {
  const res = await api.patch(
    `/meetings/${meetingId}/action-items/${itemId}/toggle`
  );
  return res.data.data;
}