import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export function AQIGraph({ forecast }: { forecast: any[] }) {
  return (
    <LineChart width={300} height={200} data={forecast}>
      <XAxis dataKey="hour" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="aqi" strokeWidth={2} />
    </LineChart>
  );
}
