// Dummy transcribeAudio implementation
export async function transcribeAudio(_blob: Blob): Promise<string> {
  // Simulate transcription delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return "[Transcribed text from audio]";
}
