import React, { useState, useEffect } from 'react';
import { expectedActionItemShape } from '../utils/meetingShape';

const MeetingDetails = ({ meeting }) => {
  const [actionItems, setActionItems] = useState(meeting.actionItems);

  useEffect(() => {
    setActionItems(meeting.actionItems.map((item) => ({
      ...item,
      completed: item.completed === true,
    })));
  }, [meeting.actionItems]);

  return (
    // Meeting details UI
  );
};

export default MeetingDetails;