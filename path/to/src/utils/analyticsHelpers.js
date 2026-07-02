import { getMeetingData } from './meetingShape';
import { calculateDuration } from './durationCalculator';

const getAnalyticsData = (meeting) => {
  const meetingData = getMeetingData(meeting);
  if (!meetingData) {
    return null;
  }
  return {
    completionRate: meetingData.actionItems.filter((item) => item.completed).length / meetingData.actionItems.length,
    pendingActionItems: meetingData.actionItems.filter((item) => !item.completed).length,
    duration: meetingData.actionItems.reduce((acc, item) => acc + item.duration, 0),
  };
};