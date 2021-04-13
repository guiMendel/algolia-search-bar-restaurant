"use strict";

// Libs
import fs from "fs";
import csv from "csv-parser";

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
    const counterpart = additionalData.find(
      // Two =s because one is string and other is number
      (entry) => entry.objectID == restaurant.objectID,
    );

    // Let's get rid of the string id to avoid overwriting
    delete counterpart.objectID;

    Object.assign(restaurant, counterpart);
  }

  // All's left to do now is push this list to the restaurants index

  show();
}
