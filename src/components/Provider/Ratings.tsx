"use client";
import { BarChart } from "@tremor/react";
import { useEffect, useState } from "react";
import { calculateAverageRatings } from "@/lib/utils";
interface RatingData {
  date: string;
  Rating: any;
}
const Ratings = ({ provider }: { provider: any }) => {
  const [chartData, setChartData] = useState<RatingData[]>();

  useEffect(() => {
    const calculateAverage = async () => {
      const averageRating = await calculateAverageRatings(
        provider?.ratings || []
      );
      const data = Object.entries(averageRating).map(([category, value]) => ({
        date: category,
        Rating: value,
      }));
      setChartData(data);
    };

    calculateAverage();
  }, [provider]);

  // Custom tooltip function
  const customTooltip = (props: any) => {
    const { payload, active } = props;
    if (!active || !payload) return null;
    return (
      <div className="w-56 rounded-tremor-default border border-tremor-border bg-tremor-background p-2 text-tremor-default shadow-tremor-dropdown">
        {payload.map((category: any, idx: number) => (
          <div key={idx} className="flex flex-1 space-x-2.5">
            <div
              className={`flex w-1 flex-col bg-${category.color}-500 rounded`}
            />
            <div className="space-y-1">
              <p className="text-tremor-content">{category.dataKey}</p>
              <p className="font-medium text-tremor-content-emphasis">
                {category.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        Average Ratings
      </h3>
      <BarChart
        className="mt-4 h-72"
        data={chartData || []}
        index="date"
        categories={["Rating"]}
        colors={["blue"]}
        yAxisWidth={30}
        
        customTooltip={customTooltip}
      />
    </div>
  );
};

export default Ratings;
