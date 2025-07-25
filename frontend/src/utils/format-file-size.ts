export const formatFileSize = (size: number, decimals = 2): string => {
  if (size < 1024) return `${size} B`;

  const units = ["KB", "MB", "GB", "TB"];
  let unitIndex = -1;
  let readableSize = size;

  do {
    readableSize /= 1024;
    unitIndex++;
  } while (readableSize >= 1024 && unitIndex < units.length - 1);

  return `${readableSize.toFixed(decimals)} ${units[unitIndex]}`;
};
