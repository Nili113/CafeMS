import React from 'react';
import { ResponsiveLine } from '@nivo/line';

export interface GrowthDatum {
  x: string;
  y: number;
}

export interface GrowthSeries {
  id: string;
  data: GrowthDatum[];
}

const defaultData: GrowthSeries[] = [
  {
    id: 'Clients',
    data: [
      { x: 'May', y: 24 },
      { x: 'Jun', y: 31 },
      { x: 'Jul', y: 36 },
      { x: 'Aug', y: 43 },
      { x: 'Sep', y: 51 },
      { x: 'Oct', y: 58 },
    ],
  },
];

interface NetworkGrowthChartProps {
  data?: GrowthSeries[];
}

export const NivoNetworkGrowthChart: React.FC<NetworkGrowthChartProps> = ({
  data = defaultData,
}) => {
  return (
    <div className="w-full h-56 sm:h-64 relative min-w-0">
      <ResponsiveLine
        data={data as any}
        margin={{ top: 16, right: 20, bottom: 32, left: 38 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 0,
          max: 65,
          stacked: false,
        }}
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 8,
          tickRotation: 0,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 8,
          tickRotation: 0,
          tickValues: [0, 20, 40, 60],
        }}
        enableGridX={false}
        enableGridY={true}
        colors={['#059669']}
        lineWidth={3.5}
        enablePoints={true}
        pointSize={7}
        pointColor="#ffffff"
        pointBorderWidth={2.5}
        pointBorderColor="#059669"
        enableArea={true}
        areaOpacity={0.16}
        useMesh={true}
        enableTouchCrosshair={true}
        defs={[
          {
            id: 'emeraldGrowthGradient',
            type: 'linearGradient',
            colors: [
              { offset: 0, color: '#10B981', opacity: 0.4 },
              { offset: 100, color: '#10B981', opacity: 0.02 },
            ],
          },
        ]}
        fill={[{ match: '*', id: 'emeraldGrowthGradient' }]}
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
              stroke: '#059669',
              strokeWidth: 1.5,
              strokeDasharray: '3 3',
            },
          },
        }}
        tooltip={({ point }: any) => {
          return (
            <div className="bg-stone-900 text-white px-3 py-1.5 rounded-xl shadow-xl font-mono text-xs border border-stone-800 flex items-center gap-2">
              <span className="font-bold text-emerald-400">{String(point.data.x)}:</span>
              <span className="font-bold">{String(point.data.y)} venues</span>
            </div>
          );
        }}
      />
    </div>
  );
};
