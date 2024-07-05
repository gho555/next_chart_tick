import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ScaleCalculator from "./ScaleCalculator.js";
import { format, parseISO } from "date-fns";

let label_type = 0;
let last_tick = new Date();
let label_format = "MM/dd";

const CustomizedXAxisTick = (props) => {
  const { x, y, payload } = props;

  const date = parseISO(payload.value);
  const formattedDate = format(date, label_format);
  const islabel =
    label_type == 0 || last_tick.getMonth() != date.getMonth() ? true : false;

  last_tick = date;
  return (
    <g transform={`translate(${x},${y})`}>
      {
        <>
          <line x1={0} y1={-3} x2={0} y2={islabel ? 12 : 5} stroke="#FFF" />
          {islabel && (
            <text dy={30} textAnchor="middle" fill="#fff">
              {formattedDate.toUpperCase()}
            </text>
          )}
        </>
      }
    </g>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white	rounded-2xl text-3xl">
        <p className="label">${`${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export default function Chart({ data, meta }) {
  const interval = meta.interval;
  const range = data.length;
  console.log(interval, range);
  if (interval === "1week" && range == 52) label_type = 1;
  else if (interval === "1day" && range >= 180 && range < 190) label_type = 1;
  else if (interval === "1day" && range >= 90 && range < 100) label_type = 1;
  else if (interval === "1day" && range >= 28 && range < 32) label_type = 0;
  else if (interval === "1day" && range == 7) label_type = 0;
  else if (interval === "1h" && range == 24) label_type = 0;

  if (interval === "1day") label_format = "MM/dd";
  else if(interval === "1h") label_format = "hh:mm"
  if (label_type === 1) label_format = "MMM yyyy";

  last_tick = parseISO(data[0].datetime);

  let previousClose = [];
  let ticks = [];
  let closeIndex = "";

  if (data) {
    var closePrices = data.map(function (o) {
      return o.close;
    });

    const scaleCalculator = new ScaleCalculator(
      Math.min.apply(Math, closePrices),
      Math.max.apply(Math, closePrices)
    );

    if (data.length >= 2) {
      let outputSize = data.length - 2;

      previousClose = data[outputSize].close;
    }

    const ticks = [];

    for (
      let i = scaleCalculator.getComputedLowerBound();
      i <= scaleCalculator.getComputedUpperBound();
      i += scaleCalculator.getTickSpacing()
    ) {
      ticks.push(i);
    }
  }
  return (
    <div className="chart-section">
      <ResponsiveContainer width="97%" height={570}>
        <AreaChart data={data} overflow="visible">
          <defs>
            <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1.5">
              <stop offset="5%" stopColor="#c2b9cc" stopOpacity={0.5} />
              <stop offset="80%" stopColor="#8c422c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <text
            x={"90%"}
            y={"84%"}
            className=" font-bold fill-[#198D83]  text-[18px]"
            textAnchor="left"
            verticalAnchor="center"
          >
            PREVIOUS CLOSE
          </text>

          <text
            x={"90%"}
            y={"91%"}
            className=" text-[45px] font-light fill-white "
            width={200}
            height={300}
            scaleToFit={false}
            textAnchor="left"
            verticalAnchor="left"
          >
            ${previousClose}
          </text>

          <CartesianGrid strokeDasharray="5 5" vertical={false} />
          <XAxis
            tickLine={false}
            axisLine={{ stroke: "white" }}
            dataKey="datetime"
            allowDuplicatedCategory={false}
            className="font-g"
            // tick={{ fill: "#fff", fontSize: 18, fontWeight: 200 }}
            tick={<CustomizedXAxisTick />}
            padding={{ left: 30, right: 30 }}
            interval={0}
          />

          <YAxis
            dataKey="close"
            type="number"
            domain={["auto", "auto"]}
            allowDuplicatedCategory={false}
            axisLine={{ stroke: "white" }}
            tickLine={{ stroke: "#ffffff" }}
            className="font-Lexend"
            padding={{ top: 50, bottom: 90 }}
            tick={{ fill: "#199692", fontSize: 18, fontWeight: 500 }}
            tickFormatter={(value) => `$ ${value.toFixed()}`}
            allowDecimals={false}
            interval="equidistantPreserveStart"
          />

          <Tooltip
            active="true"
            allowEscapeViewBox={{ x: false, y: true }}
            cursor={false}
            animationDuration={1500}
            defaultIndex={data.length - 1}
            itemSorter={function noRefCheck() {}}
            position="top"
            content={<CustomTooltip />}
            wrapperStyle={{
              border: "1px solid #fff",
              borderRadius: "3em",
              backgroundColor: "white",
              position: "absolute",
              top: "30px",
              left: "-20px",
              paddingLeft: "1rem",
              paddingRight: "1rem",
              opacity: 0.8,
              "&:hover": {
                opacity: 1,
              },
            }}
          />

          <Area
            type="monotone"
            dataKey="close"
            stroke="#9586a3"
            fillOpacity={1}
            strokeWidth={4}
            fill="url(#chartColor)"
            margin={{
              top: 20,
              right: 150,
              bottom: 20,
              left: 150,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
