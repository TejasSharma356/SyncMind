/**
 * Expected shape of meeting data.
 */
export const expectedMeetingShape = {
  id: String,
  title: String,
  date: Date,
  actionItems: Array.of({
    id: String,
    title: String,
    completed: Boolean,
    duration: Number,
  }),
};

/**
 * Expected shape of action item data.
 */
export const expectedActionItemShape = {
  id: String,
  title: String,
  completed: Boolean,
  duration: Number,
};