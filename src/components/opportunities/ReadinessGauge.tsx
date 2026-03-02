'use client';

interface ReadinessGaugeProps {
  score: number;
  size?: 'sm' | 'lg';
}

export function ReadinessGauge({ score, size = 'lg' }: ReadinessGaugeProps) {
  const color = score >= 70 ? '#4CAF81' : score >= 40 ? '#F59E0B' : '#EF4444';
  const bgColor = score >= 70 ? '#E8F5EE' : score >= 40 ? '#FEF3C7' : '#FEE2E2';
  const dimensions = size === 'lg' ? 'h-32 w-32' : 'h-20 w-20';
  const textSize = size === 'lg' ? 'text-3xl' : 'text-xl';
  const labelSize = size === 'lg' ? 'text-xs' : 'text-[10px]';
  const circumference = size === 'lg' ? 2 * Math.PI * 52 : 2 * Math.PI * 32;
  const radius = size === 'lg' ? 52 : 32;
  const svgSize = size === 'lg' ? 128 : 80;
  const strokeWidth = size === 'lg' ? 8 : 6;

  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative ${dimensions} flex items-center justify-center`}>
      <svg className="absolute -rotate-90" width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="text-center">
        <span className={`${textSize} font-bold`} style={{ color }}>{score}%</span>
        <p className={`${labelSize} text-muted-foreground`}>Ready</p>
      </div>
    </div>
  );
}
