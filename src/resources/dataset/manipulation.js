"use strict"

// Libs
import dotenv from "dotenv"
import path from "path"
import fs from "fs"
import csv from "csv-parser"
import algoliasearch from "algoliasearch"

// Get ENV variables
const envPath = path.join(process.cwd(), "..", "..", "..", ".env")
dotenv.config({ path: envPath })

// Let's get our beautiful algolia index
const client = algoliasearch(process.env.VITE_APP_ID, process.env.VITE_API_KEY)
const index = client.initIndex("restaurants")

// Get base list of restaurants
const rawData = fs.readFileSync("restaurants_list.json")
const restaurants = JSON.parse(rawData)

// Will hold the additional info
const additionalData = []

// This module automatically identifies headers and parses the csv into json
fs.createReadStream("restaurants_info.csv")
  .pipe(csv({ separator: ";" }))
  .on("data", (record) => {
    additionalData.push(record)
  })
  // When done, just join new data to base data and push it
  .on("end", joinAndPush)

// function for debugging
function show() {
  console.log(restaurants[0])
}

// Substitute Diners Club and Carte Blanche payment methods to Discover card
function substitutePaymentMethods(record) {
  let alreadyHasDiscover = false
  let shouldHaveDiscover = false

  const allowedPaymentMethods = ["Discover", "AMEX", "MasterCard", "Visa"]

  // Removes unallowed methods and substitutes Diners Club and Carte Blanche
  record.payment_options = record.payment_options.filter((option) => {
    if (!allowedPaymentMethods.includes(option)) {
      if (option === "Diners Club" || option === "Carte Blanche") {
        shouldHaveDiscover = true
      }
      return false
    } else if (option === "Discover") {
      alreadyHasDiscover = true
    }
    return true
  })

  // Inserts Discover, if necessary
  if (shouldHaveDiscover && !alreadyHasDiscover) {
    record.payment_options.push("Discover")
  }
}

// Alters a record's attributes to ones better suited for the search engine
function treatRecord(record) {
  // Drop the worst version of duplicated info
  delete record.phone

  // Price may be duplicated too, but one version's display ready
  // and the other is better suited for ranking purposes, so we'll keep the two

  // Treat Diners Club and Carte Blanche as Discover cards
  substitutePaymentMethods(record)

  // Let's have these ratings in ranges of 0.5
  record.stars_count = Math.round(record.stars_count * 2) / 2

  // Let's have these fields be numbers, so that we can properly use them to rank results
  record.reviews_count = parseInt(record.reviews_count)
  record.stars_count = parseFloat(record.stars_count)
}

// Joins additional data with JSON data and pushes to algolia index
function joinAndPush() {
  // Let's join the records
  for (const restaurant of restaurants) {
    // Get the additional data counterpart
    const counterpart = additionalData.find(
      // Two =s because one is string and other is number
      (record) => record.objectID == restaurant.objectID,
    )

    // Join'em
    // We want id's as string, so let it be overwritten
    Object.assign(restaurant, counterpart)

    // Treat the attributes to a more desirable state
    treatRecord(restaurant)
  }

  // All's left to do now is push this list to the restaurants index
  index.saveObjects(restaurants)

  // Uncomment this to update index
  // index.partialUpdateObjects(restaurants);

  show()
}
