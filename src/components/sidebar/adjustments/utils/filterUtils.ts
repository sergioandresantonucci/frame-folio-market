
/**
 * Builds a CSS filter string from adjustment values
 */
export const buildFilterString = (
  brightness: number,
  contrast: number,
  saturation: number,
  clarity: number,
  temperature: number,
  highlights: number
): string => {
  return `
    brightness(${1 + brightness/100})
    contrast(${1 + contrast/100})
    saturate(${1 + saturation/100})
    blur(${clarity < 0 ? Math.abs(clarity/200) : 0}px)
    ${temperature > 0 ? `sepia(${temperature/100})` : ''}
    ${temperature < 0 ? `hue-rotate(${temperature * 1.8}deg)` : ''}
    ${highlights > 0 ? `opacity(${1 - highlights/400})` : ''}
    ${highlights < 0 ? `drop-shadow(0 0 ${Math.abs(highlights)/50}px rgba(255,255,255,0.5))` : ''}
  `;
};

/**
 * Extracts adjustment values from a filter string
 */
export const extractValuesFromFilter = (
  filterString: string
): {
  brightness: number;
  contrast: number;
  saturation: number;
  clarity: number;
  temperature: number;
  highlights: number;
} => {
  const defaultValues = {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    clarity: 0,
    temperature: 0,
    highlights: 0
  };
  
  const brightnessMatch = filterString.match(/brightness\(([0-9.]+)\)/);
  const contrastMatch = filterString.match(/contrast\(([0-9.]+)\)/);
  const saturateMatch = filterString.match(/saturate\(([0-9.]+)\)/);
  const blurMatch = filterString.match(/blur\(([0-9.]+)px\)/);
  const sepiaMatch = filterString.match(/sepia\(([0-9.]+)\)/);
  const hueRotateMatch = filterString.match(/hue-rotate\(([0-9.-]+)deg\)/);
  const opacityMatch = filterString.match(/opacity\(([0-9.]+)\)/);
  const dropShadowMatch = filterString.match(/drop-shadow\(0 0 ([0-9.]+)px/);
  
  if (brightnessMatch) defaultValues.brightness = Math.round((parseFloat(brightnessMatch[1]) - 1) * 100);
  if (contrastMatch) defaultValues.contrast = Math.round((parseFloat(contrastMatch[1]) - 1) * 100);
  if (saturateMatch) defaultValues.saturation = Math.round((parseFloat(saturateMatch[1]) - 1) * 100);
  if (blurMatch) defaultValues.clarity = -Math.round(parseFloat(blurMatch[1]) * 200);
  
  if (sepiaMatch) {
    defaultValues.temperature = Math.round(parseFloat(sepiaMatch[1]) * 100);
  } else if (hueRotateMatch) {
    defaultValues.temperature = Math.round(parseFloat(hueRotateMatch[1]) / 1.8);
  }
  
  if (opacityMatch) {
    defaultValues.highlights = Math.round((1 - parseFloat(opacityMatch[1])) * 400);
  } else if (dropShadowMatch) {
    defaultValues.highlights = -Math.round(parseFloat(dropShadowMatch[1]) * 50);
  }
  
  return defaultValues;
};
