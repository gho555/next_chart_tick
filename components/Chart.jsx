"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
  Line,
} from "recharts";
import ScaleCalculator from "./ScaleCalculator.js";
import { format, parseISO, differenceInDays, addDays } from "date-fns";
let displayedMonths = {};

const CustomizedXAxisTick = (props) => {
  const { x, y, payload } = props;

  const date = parseISO(payload.value);
  const formattedDate = format(date, "MMMM");
  const monthKey = format(date, "MMMM");

  const isMonthDisplayed = !!displayedMonths[monthKey];

  if (!isMonthDisplayed) {
    displayedMonths[monthKey] = true;
  }

  return (
    <g transform={`translate(${x},${y})`}>
      {
        <>
          <line
            x1={0}
            y1={-3}
            x2={0}
            y2={isMonthDisplayed ? 6 : 12}
            stroke="#ccc"
            strokeWidth={2}
          />

          {!isMonthDisplayed && (
            <text dy={25} textAnchor="middle" fill="#fff">
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

export default function Chart({ data }) {
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
        <AreaChart data={data}>
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
