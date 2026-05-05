export interface MeetingLink {
  provider: "zoom" | "google_meet";
  link: string;
  meetingId: string;
  password?: string;
}

export async function createMeeting(provider: "zoom" | "google_meet", startTime: Date, durationMinutes: number = 30): Promise<MeetingLink> {
  // In a real implementation, this would call the respective APIs
  // For now, we return mock links
  const meetingId = Math.random().toString(36).substring(7);
  
  if (provider === "zoom") {
    return {
      provider: "zoom",
      link: `https://zoom.us/j/${meetingId}`,
      meetingId,
      password: "123456",
    };
  } else {
    return {
      provider: "google_meet",
      link: `https://meet.google.com/${meetingId.substring(0, 3)}-${meetingId.substring(3, 7)}-${meetingId.substring(7, 10)}`,
      meetingId,
    };
  }
}
