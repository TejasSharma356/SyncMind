/**
 * Calculates duration based on real duration metadata when available.
 */
export const calculateDuration = (meeting) => {
  if (meeting.realDuration) {
    return meeting.realDuration;
  }
  // Fallback to estimated duration based on transcript word count
  return meeting.transcriptWordCount * 0.01;
};