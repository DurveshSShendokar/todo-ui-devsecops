import * as React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled, useTheme } from "@mui/material/styles"; // Import useTheme
import axios from "axios";

export default function PieChartWithCustomizedLabel({
  todaysData,
  centerLabel,
}) {
  const [todaysCompletedTaskCount, setTodaysCompletedTaskCount] =
    React.useState(0);
  const [todaysTodoTaskCount, setTodaysTodoTaskCount] = React.useState(0);
  const [todaysInprogressTaskCount, setTodaysInprogressTaskCount] =
    React.useState(0);
  const [tadaysTotalCount, setTodaysTotalCount] = React.useState(0);
  React.useEffect(() => {
    taskscount();
  }, [todaysData]);

  const taskscount = () => {
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;
    setTodaysTotalCount(todaysData.length);
    todaysData.map((data) => {
      if (data.status === "todo") count1++;
      else if (data.status === "inprogress") count2++;
      else count3++;
    });
    setTodaysCompletedTaskCount(count3);
    setTodaysInprogressTaskCount(count2);
    setTodaysTodoTaskCount(count1);
  };

  const data = [
    { label: "Todo", value: todaysTodoTaskCount, color: "#0088FE" },
    {
      label: "Completed",
      value: todaysCompletedTaskCount,
      color: "#05ac45",
    },
    {
      label: "Inprogress",
      value: todaysInprogressTaskCount,
      color: "#202020",
    },
  ];

  const sizing = {
    margin: 1,
    width: 300,
    height: 200,
    legend: { hidden: true },
  };

  const theme = useTheme(); // Get current theme

  const StyledText = styled("text")(({ theme }) => ({
    fill: theme.palette.mode === "dark" ? "white" : "black", 
    textAnchor: "middle",
    dominantBaseline: "central",
    fontSize: 20,
  }));

  function PieCenterLabel({ children }) {
    const { width, height, left, top } = useDrawingArea();
    return (
      <StyledText x={left + width / 2} y={top + height / 2}>
        {children}
      </StyledText>
    );
  }

  return (
    <PieChart
      series={[{
        data,
        innerRadius: 70,
      }]}
      sx={{
        paddingLeft: 5,
      }}
      {...sizing}
    >
      <PieCenterLabel>
        {centerLabel}
        {tadaysTotalCount}
      </PieCenterLabel>
    </PieChart>
  );
}
