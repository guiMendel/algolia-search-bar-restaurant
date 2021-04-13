"use strict";

// Libs
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import csv from "csv-parser";
import algoliasearch from "algoliasearch";

// Get ENV variables (which would be in my gitignore if this weren't an assignment)
const envPath = path.join(process.cwd(), "..", "..", "..", ".env");
dotenv.config({ path: envPath });

// Let's get our beautiful algolia index
const client = algoliasearch(process.env.APP_ID, process.env.API_KEY);
const index = client.initIndex("restaurants");

// Get base list of restaurants
const rawData = fs.readFileSync("restaurants_list.json");
const restaurants = JSON.parse(rawData);

// Will hold the additional info
const additionalData = [];

// This module automatically identifies headers and parses the csv into json
fs.createReadStream("restaurants_info.csv")
  .pipe(csv({ separator: ";" }))
  .on("data", (entry) => {
    additionalData.push(entry);
  })
  // When done, just join new data to base data and push it
  .on("end", joinAndPush);

// function for debugging
function show() {
  console.log(restaurants[0]);
}

// Joins additional data with JSON data and pushes to algolia index
function joinAndPush() {
  // Let's join the records
  for (const restaurant of restaurants) {
    // Get the additional data counterpart
    const counterpart = additionalData.find(
      // Two =s because one is string and other is number
      (entry) => entry.objectID == restaurant.objectID,
    );
    if (!restaurant.phone || !counterpart.phone_number)
      console.log(counterpart);

    // Drop the worst version of duplicated info
    delete restaurant.phone;

    // Price may be duplicated too, but one version's better to show to the client
    // and the other is better for ranking purposes, so we'll keep the two

    // Join'em
    // We want id's as string, so let's have it be overwritten as well
    Object.assign(restaurant, counterpart);
  }

  // All's left to do now is push this list to the restaurants index
  index.saveObjects(restaurants);

  show();
}
