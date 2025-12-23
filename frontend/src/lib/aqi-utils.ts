export type AQILevel = 'safe' | 'moderate' | 'unhealthy-sensitive' | 'unhealthy' | 'very-unhealthy' | 'hazardous';

export interface AQIInfo {
  level: AQILevel;
  label: string;
  description: string;
  healthAdvice: string;
  colorClass: string;
  bgClass: string;
  glowClass: string;
}

export function getAQIInfo(aqi: number): AQIInfo {
  if (aqi <= 50) {
    return {
      level: 'safe',
      label: 'Good',
      description: 'Air quality is satisfactory',
      healthAdvice: '✓ Air quality is excellent — enjoy outdoor activities freely.',
      colorClass: 'text-aqi-safe',
      bgClass: 'bg-aqi-safe',
      glowClass: 'aqi-glow-safe',
    };
  } else if (aqi <= 100) {
    return {
      level: 'moderate',
      label: 'Moderate',
      description: 'Acceptable air quality',
      healthAdvice: '⚠️ Air is moderately polluted — limit outdoor exposure and use a mask if necessary.',
      colorClass: 'text-aqi-moderate',
      bgClass: 'bg-aqi-moderate',
      glowClass: 'aqi-glow-moderate',
    };
  } else if (aqi <= 150) {
    return {
      level: 'unhealthy-sensitive',
      label: 'Unhealthy for Sensitive',
      description: 'Sensitive groups may experience effects',
      healthAdvice: '⚠️ Sensitive groups should reduce outdoor exertion. Consider wearing an N95 mask.',
      colorClass: 'text-aqi-unhealthy-sensitive',
      bgClass: 'bg-aqi-unhealthy-sensitive',
      glowClass: 'aqi-glow-unhealthy',
    };
  } else if (aqi <= 200) {
    return {
      level: 'unhealthy',
      label: 'Unhealthy',
      description: 'Everyone may experience health effects',
      healthAdvice: '🚨 Unhealthy air — avoid outdoor activities. Keep windows closed and use air purifiers.',
      colorClass: 'text-aqi-unhealthy',
      bgClass: 'bg-aqi-unhealthy',
      glowClass: 'aqi-glow-unhealthy',
    };
  } else if (aqi <= 300) {
    return {
      level: 'very-unhealthy',
      label: 'Very Unhealthy',
      description: 'Health alert: serious effects possible',
      healthAdvice: '🚨 Very unhealthy air — stay indoors. Wear N95 mask if going outside is unavoidable.',
      colorClass: 'text-aqi-very-unhealthy',
      bgClass: 'bg-aqi-very-unhealthy',
      glowClass: 'aqi-glow-very-unhealthy',
    };
  } else {
    return {
      level: 'hazardous',
      label: 'Hazardous',
      description: 'Emergency conditions',
      healthAdvice: '🆘 Hazardous air quality — remain indoors. Seek medical attention if experiencing symptoms.',
      colorClass: 'text-aqi-hazardous',
      bgClass: 'bg-aqi-hazardous',
      glowClass: 'aqi-glow-hazardous',
    };
  }
}

export function getAQIPercentage(aqi: number): number {
  return Math.min((aqi / 500) * 100, 100);
}
