export const validatePdf = (file) => {
  if (!file) return "Please select a file";
  if (file.type !== "application/pdf") return "Only PDF files allowed";
  if (file.size > 5 * 1024 * 1024) return "File must be under 5MB";
  return null;
};

export const validateVideo = (file) => {
  if (!file) return "Please select a video";
  const allowed = ["video/mp4", "video/webm", "video/ogg"];
  if (!allowed.includes(file.type)) return "Only MP4/WebM/OGG allowed";
  if (file.size > 50 * 1024 * 1024) return "Video must be under 50MB";
  return null;
};
