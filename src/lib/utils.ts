import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Rating {
  punctuality: number;
  professionalism: number;
  problemResolution: number;
  efficiency: number;
  cleanliness: number;
  responseTime: number;
  resolutionTime: number;
}
export async function calculateAverageRatings(ratings: any[]): Promise<Rating> {
  const initialAverage: Rating = {
    punctuality: 0,
    professionalism: 0,
    problemResolution: 0,
    efficiency: 0,
    cleanliness: 0,
    responseTime: 0,
    resolutionTime: 0,
  };

  if (!ratings.length) {
    return initialAverage;
  }

  const totalRatings = ratings.length;
  const total: any = {};

  for (const rating of ratings) {
    for (const key in rating) {
      if (rating.hasOwnProperty(key) && typeof rating[key] === "number") {
        total[key] = (total[key] || 0) + rating[key];
      }
    }
  }

  const average: Partial<Rating> = {};
  for (const key in total) {
    if (total.hasOwnProperty(key)) {
      average[key as keyof Rating] = (total[key] || 0) / totalRatings;
    } else {
      average[key as keyof Rating] = initialAverage[key as keyof Rating];
    }
  }

  return average as Rating;
}
