import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Pending', value: 200 },
  { name: 'Confirmed', value: 300 },
  { name: 'Processing', value: 150 },
  { name: 'Out for Delivery', value: 250 },
];

const COLORS = ['#1976d2', '#90caf9', '#64b5f6', '#42a5f5'];

function PieChartCMN() {
    console.log("re rending ... pie")
  return (
    <div className='chart-container cmn-shadow'>
      <h5 className='mb-3'>Order status statistics</h5>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            dataKey="value"
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"            
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default React.memo(PieChartCMN)