import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AnalyticsPage from './AnalyticsPage';
import { expectedMeetingShape } from '../utils/meetingShape';

describe('AnalyticsPage', () => {
  it('renders completion rate', () => {
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
  });

  it('renders pending action items', () => {
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
    expect(getByText('Pending Action Items: 1')).toBeInTheDocument();
  });

  it('renders duration', () => {
    const meeting = {
      id: 'meeting-1',
      title: 'Meeting 1',
      date: new Date(),
      actionItems: [
        { id: 'item-1', title: 'Item 1', completed: true, duration: 10 },
        { id: 'item-2', title: 'Item 2', completed: false, duration: 20 },
      ],
    };
    const { getByText } = render(<AnalyticsPage meeting={meeting} />);
    expect(getByText('Duration: 30.00 minutes')).toBeInTheDocument();
  });
});