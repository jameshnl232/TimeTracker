export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const validateTimeFormat = (time: string): boolean => {
  const regex = /^([0-9]|1[0-9]|2[0-3])\.([0-5][0-9])$/;
  return regex.test(time);
};

export const validateStartHour = (value: string): string => {
  if (!value) return "Start hour is required";
  if (!validateTimeFormat(value)) return "Invalid format. Use h.mm or hh.mm";
  return "";
};

export const validateEndHour = (value: string): string => {
  if (!value) return "End hour is required";
  if (!validateTimeFormat(value)) return "Invalid format. Use h.mm or hh.mm";
  return "";
};

export const calculateHoursWorked = (
  startTime: string,
  endTime: string,
  pause?: string,
) => {
  // Convert times to Date objects for easier calculation
  const [startHour, startMinute] = startTime.split(".").map(Number);
  const [endHour, endMinute] = endTime.split(".").map(Number);

  // Create Date objects (using arbitrary date)
  const start = new Date(2024, 0, 1, startHour, startMinute);
  const end = new Date(2024, 0, 1, endHour, endMinute);

  // Handle cases that cross midnight
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }

  // Calculate time difference in hours
  const timeDiff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

  console.log("start", start);
  console.log("end", end);
  console.log("timeDiff", timeDiff);


  // Subtract pause time if provided
  const pauseTime = pause ? parseFloat(pause) / 60 : 0;

  console.log("pauseTime", pauseTime);

  const hoursWorked = Math.max(0, timeDiff - pauseTime);

  return hoursWorked.toFixed(2);
};
