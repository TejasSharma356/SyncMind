import React from 'react';
import { getAnalyticsData } from '../utils/analyticsHelpers';

const AnalyticsPage = ({ meeting }) => {
  const analyticsData = getAnalyticsData(meeting);
  if (!analyticsData) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h2>Completion Rate: {analyticsData.completionRate.toFixed(2)}%</h2>
      <h2>Pending Action Items: {analyticsData.pendingActionItems}</h2>
      <h2>Duration: {analyticsData.duration.toFixed(2)} minutes</h2>
    </div>
  );
};

export default AnalyticsPage;