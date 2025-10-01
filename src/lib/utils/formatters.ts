/**
 * Formats a string by replacing underscores with spaces and converting to proper case
 * @param value - The string to format (e.g., "PROFESSIONAL_SERVICES" or "PROFESSIONAL SERVICES")
 * @returns The formatted string (e.g., "Professional Services")
 */
export const formatProperCase = (value: string): string => {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
