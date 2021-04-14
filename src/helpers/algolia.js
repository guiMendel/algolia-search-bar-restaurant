// Isolates algolia's api setup

import algoliasearch from "algoliasearch";
import algoliasearchHelper from "algoliasearch-helper";

const client = algoliasearch(
  import.meta.env.VITE_APP_ID,
  import.meta.env.VITE_API_KEY,
);

// Also decribes the order in which the facets ought to be displayed
const facets = [
  "food_type",
  "stars_count",
  "payment_options",
  "price_range",
  "dining_style",
  "neighborhood",
  "city",
  "country",
];

const helper = algoliasearchHelper(client, "restaurants", {
  disjunctiveFacets: facets,
});

export default helper;
