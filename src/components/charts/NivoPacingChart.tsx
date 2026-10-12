import React from 'react';
import { ResponsiveLine } from '@nivo/line';

interface PacingChartProps {
  timeRange: 'today' | '7days' | '30days';
  accentColor?: string;
}

export const NivoPacingChart: React.FC<PacingChartProps> = ({
  timeRange,
  accentColor = '#1B4636',
}) => {
  const dataConfig: Record<
    'today' | '7days' | '30days',
    {
      data: Array<{ x: string; y: number; amount: string; orders: number }>;
      maxY: number;
      ticks: number;
    }
  > = {
    today: {
      maxY: 1000,
      ticks: 4,
      data: [
        { x: '8 AM', y: 180, amount: 'रु. 180', orders: 12 },
        { x: '10 AM', y: 340, amount: 'रु. 340', orders: 24 },
        { x: '12 PM', y: 680, amount: 'रु. 680', orders: 48 },
        { x: '2 PM', y: 420, amount: 'रु. 420', orders: 28 },
        { x: '4 PM', y: 540, amount: 'रु. 540', orders: 38 },
        { x: '6 PM', y: 890, amount: 'रु. 890', orders: 64 },
        { x: '8 PM', y: 720, amount: 'रु. 720', orders: 52 },
        { x: '10 PM', y: 210, amount: 'रु. 210', orders: 16 },
      ],
    },
    '7days': {
      maxY: 4500,
      ticks: 4,
      data: [
        { x: 'Mon', y: 1920, amount: 'रु. 1,920', orders: 68 },
        { x: 'Tue', y: 2150, amount: 'रु. 2,150', orders: 74 },
        { x: 'Wed', y: 2480, amount: 'रु. 2,480', orders: 86 },
        { x: 'Thu', y: 2310, amount: 'रु. 2,310', orders: 80 },
        { x: 'Fri', y: 3120, amount: 'रु. 3,120', orders: 104 },
        { x: 'Sat', y: 3890, amount: 'रु. 3,890', orders: 132 },
        { x: 'Sun', y: 3450, amount: 'रु. 3,450', orders: 118 },
      ],
    },
    '30days': {
      maxY: 26000,
      ticks: 4,
      data: [
        { x: 'W-1', y: 14200, amount: 'रु. 14,200', orders: 490 },
        { x: 'W-2', y: 16800, amount: 'रु. 16,800', orders: 570 },
        { x: 'W-3', y: 18400, amount: 'रु. 18,400', orders: 620 },
        { x: 'W-4', y: 22600, amount: 'रु. 22,600', orders: 780 },
      ],
    },
  };

  const currentConfig = dataConfig[timeRange];

  const seriesData = [
    {
      id: 'Revenue',
      data: currentConfig.data.map((d) => ({
        x: d.x,
        y: d.y,
        amount: d.amount,
        orders: d.orders,
      })),
    },
  ];

  const isToday = timeRange === 'today';

  return (
    <div className="w-full h-60 sm:h-64 relative min-w-0">
      <ResponsiveLine
        data={seriesData as any}
        margin={{
          top: 16,
          right: 20,
          bottom: isToday ? 44 : 34,
          left: 48,
        }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 0,
          max: currentConfig.maxY,
          stacked: false,
        }}
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 8,
          tickRotation: isToday ? -25 : 0,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 8,
          tickRotation: 0,
          tickValues: currentConfig.ticks,
          format: (val: any) => {
            const num = Number(val);
            if (num === 0) return 'रु 0';
            if (num >= 1000) return `रु ${(num / 1000).toFixed(0)}k`;
            return `रु ${num}`;
          },
        }}
        enableGridX={false}
        enableGridY={true}
        colors={[accentColor]}
        lineWidth={3.5}
        enablePoints={true}
        pointSize={7}
        pointColor="#ffffff"
        pointBorderWidth={2.5}
        pointBorderColor={accentColor}
        enableArea={true}
        areaOpacity={0.16}
        useMesh={true}
        enableTouchCrosshair={true}
        defs={[
          {
            id: 'clientPacingGradient',
            type: 'linearGradient',
            colors: [
              { offset: 0, color: accentColor, opacity: 0.35 },
              { offset: 100, color: accentColor, opacity: 0.02 },
            ],
          },
        ]}
        fill={[{ match: '*', id: 'clientPacingGradient' }]}
        theme={{
          background: 'transparent',
          text: {
            fontSize: 10,
            fill: '#78716C',
            fontFamily: 'JetBrains Mono, monospace, system-ui',
          },
          axis: {
            ticks: {
              text: {
                fill: '#A8A29E',
                fontSize: 10,
                fontFamily: 'JetBrains Mono, monospace',
              },
            },
          },
          grid: {
            line: {
              stroke: '#E7E5E4',
              strokeWidth: 1,
              strokeDasharray: '4 4',
            },
          },
          crosshair: {
            line: {
              stroke: accentColor,
              strokeWidth: 1.5,
              strokeDasharray: '3 3',
            },
          },
        }}
        tooltip={({ point }: any) => {
          const ptData = point.data as any;
          return (
            <div className="bg-stone-900 text-white px-3 py-2 rounded-xl shadow-xl font-mono text-xs border border-stone-800 space-y-1">
              <div className="flex items-center justify-between gap-3 font-bold border-b border-stone-700 pb-1">
                <span style={{ color: accentColor === '#18181B' ? '#FBBF24' : accentColor }}>
                  {String(ptData.x)}
                </span>
                <span className="text-amber-300">{ptData.amount}</span>
              </div>
              <div className="text-[11px] text-stone-300">
                <span>{ptData.orders} orders processed</span>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};
