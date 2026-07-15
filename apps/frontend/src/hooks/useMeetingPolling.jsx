import { useState, useEffect, useRef } from 'react';
import { getMeeting } from '../services/meetings.service';


const POLL_INTERVAL_MS = 3000;

export function useMeetingPolling(id) {
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchMeeting = async () => {
    try {
      const data = await getMeeting(id);
      setMeeting(data);
      setError(null);

      // Stop polling when done or failed
      if (data.status === 'done' || data.status === 'failed') {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to load meeting');
      if (intervalRef.current) clearInterval(intervalRef.current);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeeting();
    intervalRef.current = window.setInterval(fetchMeeting, POLL_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [id]);

  return { meeting, loading, error };
}