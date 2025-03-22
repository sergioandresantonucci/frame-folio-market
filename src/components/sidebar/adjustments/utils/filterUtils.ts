
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
  // Build each filter component
  const filters = [];
  
  // Only add non-zero/non-default values to avoid unnecessary filters
  if (brightness !== 0) {
    filters.push(`brightness(${(100 + brightness) / 100})`);
  }
  
  if (contrast !== 0) {
    filters.push(`contrast(${(100 + contrast) / 100})`);
  }
  
  if (saturation !== 0) {
    filters.push(`saturate(${(100 + saturation) / 100})`);
  }
  
  // Clarity is implemented as blur with inverse relationship
  if (clarity < 0) {
    filters.push(`blur(${Math.abs(clarity/200)}px)`);
  }
  
  // Temperature adjustments use sepia (warm) or hue-rotate (cool)
  if (temperature > 0) {
    filters.push(`sepia(${temperature/100})`);
  } else if (temperature < 0) {
    filters.push(`hue-rotate(${temperature * 1.8}deg)`);
  }
  
  // Highlights adjustments
  if (highlights > 0) {
    filters.push(`opacity(${1 - highlights/400})`);
  } else if (highlights < 0) {
    filters.push(`drop-shadow(0 0 ${Math.abs(highlights)/50}px rgba(255,255,255,0.5))`);
  }

  // If no filters were added, return 'none' instead of an empty string
  return filters.length > 0 ? filters.join(' ') : 'none';
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
  
  if (!filterString || filterString === 'none') {
    return defaultValues;
  }
  
  try {
    // Match each filter component
    const brightnessMatch = filterString.match(/brightness\(([0-9.]+)\)/);
    const contrastMatch = filterString.match(/contrast\(([0-9.]+)\)/);
    const saturateMatch = filterString.match(/saturate\(([0-9.]+)\)/);
    const blurMatch = filterString.match(/blur\(([0-9.]+)px\)/);
    const sepiaMatch = filterString.match(/sepia\(([0-9.]+)\)/);
    const hueRotateMatch = filterString.match(/hue-rotate\(([0-9.-]+)deg\)/);
    const opacityMatch = filterString.match(/opacity\(([0-9.]+)\)/);
    const dropShadowMatch = filterString.match(/drop-shadow\(0 0 ([0-9.]+)px/);
    
    // Parse brightness (0-2 scale in CSS, -100 to 100 in our UI)
    if (brightnessMatch) {
      defaultValues.brightness = Math.round((parseFloat(brightnessMatch[1]) * 100) - 100);
    }
    
    // Parse contrast (0-2 scale in CSS, -100 to 100 in our UI)
    if (contrastMatch) {
      defaultValues.contrast = Math.round((parseFloat(contrastMatch[1]) * 100) - 100);
    }
    
    // Parse saturation (0-2 scale in CSS, -100 to 100 in our UI)
    if (saturateMatch) {
      defaultValues.saturation = Math.round((parseFloat(saturateMatch[1]) * 100) - 100);
    }
    
    // Parse clarity (implemented as inverse of blur)
    if (blurMatch) {
      defaultValues.clarity = -Math.round(parseFloat(blurMatch[1]) * 200);
    }
    
    // Parse temperature (sepia for warm, hue-rotate for cool)
    if (sepiaMatch) {
      defaultValues.temperature = Math.round(parseFloat(sepiaMatch[1]) * 100);
    } else if (hueRotateMatch) {
      defaultValues.temperature = Math.round(parseFloat(hueRotateMatch[1]) / 1.8);
    }
    
    // Parse highlights (opacity for positive, drop-shadow for negative)
    if (opacityMatch) {
      defaultValues.highlights = Math.round((1 - parseFloat(opacityMatch[1])) * 400);
    } else if (dropShadowMatch) {
      defaultValues.highlights = -Math.round(parseFloat(dropShadowMatch[1]) * 50);
    }
  } catch (error) {
    console.error("Error extracting values from filter:", error);
    return defaultValues;
  }
  
  return defaultValues;
};
