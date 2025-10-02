'use client';
import React, { memo } from 'react';
import useTradingViewWidget from '@/hooks/useTradinViewWidget';
import { cn } from '@/lib/utils';

interface TradingViewWidgetProps {
  title?: string;
  scriptUrl: string;
  config: Record<string, unknown>;
  height?: number;
  className?: string;
}

const TradingViewWidget = ({ title, scriptUrl, config, height, className }: TradingViewWidgetProps) => {
  const containerRef = useTradingViewWidget(scriptUrl, config, height);

  return (
    <div className='w-full'>
      {title && <h3 className='mb-5 text-2xl font-semibold text-gray-100'>{title}</h3>}
      <div className={cn("tradingview-widget-container", className)} ref={containerRef}>
        <div className="tradingview-widget-container__widget" style={{ height, width: "100%" }}></div>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
