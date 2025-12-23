import { getAQIInfo } from '@/lib/aqi-utils';
import { AlertTriangle, CheckCircle, XCircle, AlertOctagon } from 'lucide-react';

interface CriticalityBannerProps {
  aqi: number;
}

export function CriticalityBanner({ aqi }: CriticalityBannerProps) {
  const aqiInfo = getAQIInfo(aqi);

  const getIcon = () => {
    if (aqi <= 50) return <CheckCircle className="w-5 h-5 flex-shrink-0" />;
    if (aqi <= 150) return <AlertTriangle className="w-5 h-5 flex-shrink-0" />;
    if (aqi <= 300) return <XCircle className="w-5 h-5 flex-shrink-0" />;
    return <AlertOctagon className="w-5 h-5 flex-shrink-0 animate-pulse" />;
  };

  return (
    <div 
      className={`w-full px-4 py-3 rounded-xl ${aqiInfo.bgClass}/15 border ${aqiInfo.bgClass}/30 ${aqiInfo.colorClass} animate-slide-up`}
      style={{ animationDelay: '0.3s' }}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <p className="text-sm font-medium leading-relaxed">
          {aqiInfo.healthAdvice}
        </p>
      </div>
    </div>
  );
}
