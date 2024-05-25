import { Request, Response, query } from "express";
import Restaurant from "../models/restaurant";

const searchRestaurants = async (req: Request, res: Response) => {
  try {
    const city = req.params.city;

    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisine = (req.query.selectedCuisine as string) || "";
    const sortOption = (req.query.sortOption as string) || "lastUpdated";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    let query: any = {};

    query["city"] = new RegExp(city, "i");
    const cityCheck = await Restaurant.countDocuments(query);
    if (cityCheck === 0) {
      return res.status(404).json({
        data: [],
        pagination: {
          page: 1,
          totalPages: 1,
          total: 0,
        },
      });
    }

    if (selectedCuisine) {
      const cuisineArray = selectedCuisine
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));
      query["cuisine"] = { $all: cuisineArray };
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { restaurantName: searchRegex },
        { cuisine: { $in: [searchRegex] } },
      ];
    }
    const skip = (page - 1) * limit;

    const restaurants = await Restaurant.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalRestaurants = await Restaurant.countDocuments(query);

    const response = {
      data: restaurants,
      pagination: {
        page,
        totalPages: Math.ceil(totalRestaurants / limit),
        total: totalRestaurants,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.log("🚀 ~ searchRestaurants ~ error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { searchRestaurants };
