// Isolates algolia's api setup

import algoliasearch from "algoliasearch";
import algoliasearchHelper from "algoliasearch-helper";

const client = algoliasearch(
  import.meta.env.VITE_APP_ID,
  import.meta.env.VITE_API_KEY,
);

const helper = algoliasearchHelper(client, "restaurants", {
  facets: [
    "payment_options",
    "country",
    "city",
    "neighborhood",
    "payment_options",
    "price_range",
    "stars_count",
  ],
});

export default helper;
