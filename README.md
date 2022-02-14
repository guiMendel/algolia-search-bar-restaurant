# Restaurants Search Bar Demo

Hello and welcome to my demo!

It was originally designed in one week as the hiring challenge for my internship in Algolia — which was a huge success, fortunately 😃

The challenge required me to implement a restaurant searching webpage, and have them be sorted by distance.
The map and the tutorial were a result of me setting the bar a little higher than what was required.

I hope you'll enjoy what I've come up with.

> App hosted live at: https://guimendel.github.io/algolia-search-bar-restaurant/

The following sections will detail the engineering process behind it's implementation.

## App structure

### Frontend

The frontend tool I picked was Vue.

I broke the UI interface down mainly into components for the **search bar**, the **results index**, the **map** and the **tutorial**.

I used Vuex to manage state access for:

- The current **results**

- The results' **page**

- The user's **coordinates**

- Which restaurant is being **highlighted** by the user

- Several **indicators** of the current state of the app, such as `mapOpen`

And I also used it for a neat little implementation of the `Observer design pattern` for components to listen for **restaurant selection**.

### Data management

The restaurants were given as 2 separate files, one `JSON` and one `csv`

I decided to write a script for the manipulation that:

1. Firstly gets the `JSON` restaurant list

2. Then, using the `csv-parser` node library, reads the `csv` file

3. Merges the two lists

4. Treats the records to respect the requested business rules and better fit the search engine

5. Pushes the treated list to my Algolia `restaurants` index

## Some insight on the app design process

### It all begins with a whole lotta reading

The first thing I decided was to go for a more modern looking UI, so I started scratching a nice sleek one on my blackboard.

Next, I had to understand what all this indexing and faceting meant, so I got to studying Algolia's documentation, followed by the Algolia's helper's documentation.

Once I realized I had to push the dataset to an Algolia index, I started work on the data manipulation script (which you can find at `/src/resources/dataset`).

When that was done, I started work on the Vue project to get a functional search bar, and then the facet buttons, then facet search.

### Where is stuff?

The next major step was introducing geolocation, a feature that had me studying Algolia and Google Maps API's documentations for hours.

At first, I managed to get the search engine to sort based on the user's location.

Then I realized that me being in Belgium would keep me from being able to actually test this feature, so I decided to introduce the _New York location simulation feature_, an ideia which I'll have to admit I'm pretty proud of.

> I'm sure it will suit you just as well when testing the app!

Then came distance calculation, which was a bit of a big one, but nothing compared to what was to come: the **google map rendering**, which cost me several more long hours of documentation studying.

### Refactoring machine

Then I decided to implement pagination. As simple as this sounded, it made me realize I'd have to refactor all my code, because my components' dependencies were starting to get all over the place.

I needed to plug Vuex in. As much as I love Vuex, it was something I was trying to avoid in order to try and keep the prototype less complex. As a matter of fact, I eventually realized all this avoiding was actually making things _a lot more_ complex.

Then came hosting. It was another big challenge, as I used Vite to bundle my app, and it took me a long time to find out this choice would lead to some complications with GitHub Pages.

Fortunately, I eventually found out all I had to do was add a file called `.nojekyll` to the GitHub Pages repo, since Vite would _annoyingly_ build some assets under a folder named `_assets`, which is usually illegal syntax.

### Final stop

The last idea that I really wanted to implement was a tour of the page. I really wasn't sure I'd have enough time, so I left this for last — but fortunately, I did have time!

And so I spent a whole Sunday working on this interface that floats around the page and points the user to all the cool stuff I implemented. It was honestly quite fun revisiting everything this one last time.

I hope you enjoy the little tour I put together at the end. Go ahead and give it a go!
