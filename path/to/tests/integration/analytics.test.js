import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AnalyticsPage from './AnalyticsPage';
import { expectedMeetingShape } from '../utils/meetingShape';

describe('AnalyticsPage', () => {
  it('renders analytics data', () => {
    const meeting = {
      id: 'meeting-1',
      title: 'Meeting 1',
      date: new Date(),
      actionItems: [
        { id: 'item-1', title: 'Item 1', completed: true },
        { id: 'item-2', title: 'Item 2', completed: false },
      ],
    };
    const { getByText } = render(<AnalyticsPage meeting={meeting} />);
    expect(getByText('Completion Rate: 50.00%')).toBeInTheDocument();
    expect(getByText('Pending Action Items: 1')).toBeInTheDocument();
    expect(getByText('Duration: 0.00 minutes')).toBeInTheDocument();
  });
});