import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Select from 'react-select';
import React from 'react';
const data = [
  { month: 'Jan', value: 240 },
  { month: 'Feb', value: 320 },
  { month: 'Mar', value: 180 },
  { month: 'Apr', value: 260 },
  { month: 'May', value: 300 },
  { month: 'Jun', value: 270 },
  { month: 'Jul', value: 250 },
  { month: 'Aug', value: 280 },
  { month: 'Sep', value: 340 },
  { month: 'Oct', value: 260 },
  { month: 'Nov', value: 310 },
  { month: 'Dec', value: 100 },
];

const options = [
  { value: 'year', label: 'This Year' },
  { value: 'month', label: 'This Month' },
  { value: 'week', label: 'This Week' }
]
const customStyles = {
  container: (base) => ({
    ...base,
    fontSize:'10px',
  }),
  menu:(base)=>({
    ...base,
    fontSize:"10px"
  }),
  input:(base)=>({
    ...base,
    fontSize: '10px',
  })
};


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '8px',
        fontSize: '12px',
        boxShadow: '0px 0px 5px rgba(0,0,0,0.1)'
      }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
        <p style={{ margin: 0 }}>Earnings: ₹{payload[0].value}</p>
      </div>
    );
  }

  return null;
};



function AreaChartCMN() {
  
  return (
    <div className='chart-container cmn-shadow' >
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h5 className=''>Earning statistics</h5>        
        <Select options={options} styles={customStyles}/>         
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1976d2" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#1976d2" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#e0e0e0" />
          <XAxis dataKey="month" stroke="#999" tick={{fontSize: 12}}/>
          <YAxis stroke="#999" tick={{fontSize: 12}} width={28}/>
          <Tooltip content={CustomTooltip}/>
          <Area
            type="monotone"
            dataKey="value"
            stroke="#1976d2"
            strokeWidth={3}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
export default React.memo(AreaChartCMN)