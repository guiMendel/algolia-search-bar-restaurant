# Restaurants Search Bar Demo
Hello and welcome to my demo!

I hope you'll enjoy what I've come up with. I will be very happy to tell you all about my design process and decisions, and I'm already looking forward to our interview!

> App hosted live at: https://guimendel.github.io/algolia-search-bar-restaurant/

I have come up with a little documentation thingy ahead, in case you have some spare time and are willing to get some more insight into my designing process!

Hope you have a great day!

## App structure

### Frontend
The frontend tool I picked was Vue.

I broke the UI interface down mainly into components for the **search bar**, the **results index** and the **map**.

I used Vuex to manage state access for:
 - The current **results**
 - The results' **page**
 - The user's **coordinates**
 - Which restaurant is being **highlighted** by the user

And I also used it for a neat little implementation of the `Observer design pattern` for components to listen for **restaurant selection**.

### Data management
I decided to write a script for the manipulation that:

 1. Firstly gets the `JSON` restaurant list
 2. Then, using the `csv-parser` node library, reads the csv file
 3. Merges the two lists
 4. Treats the records to respect the requested business rules and better fit the search engine
 5. Pushes the treated list to my Algolia `restaurants` index

## Some insight on the app design process

### It all begins with a whole lotta reading

The first thing I decided was to go for a more modern looking UI, and so I started scratching a nice sleek one on my blackboard.

Next, I had to understand what all this indexing and faceting meant, so I got to studying Algolia's documentation, followed by the Algolia's helper's documentation.

Once I realized I had to push the dataset to an Algolia index, I started work on the data manipulation script (which you can find at `/src/resources/dataset`).

When that was done, I started work on the Vue project to get a functional search bar, and then the facet buttons, then facet search.

### Where is stuff?

The next major step was introducing geolocation, a feature that had me studying Algolia and Google Maps API's documentations for hours.

At first, I managed to get the search engine to sort based on the user's location.

Then I realized that me being in Belgium would keep me from being able to actually test this feature, so I decided to introduce the *New York location simulation feature*, an ideia which I'll have to admit I'm pretty proud of.
> I'm sure it will suit you just as well when testing the app!

Then came distance calculation, which was a bit of a big one, but nothing compared to what was to come:  the **google map rendering**, which cost me several more long hours of documentation studying.

### Refactoring machine

Then I decided to implement pagination. As simple as this sounded, it made me realize I'd have to refactor all my code, because my components' dependencies were starting to get all over the place.

I needed to plug in Vuex. As much as I love Vuex, it was something I was trying to avoid in order to try and keep the prototype less complex. Well at the end I eventually realized all this avoiding was actually making things *a lot more* complex.

Then came hosting. It was another big challenge, as I used Vite to bundle my app, and it took me a long time to find out this choice would lead to some complications with GitHub Pages.

Fortunately, I eventually found out all I had to do was add a file called `.nojekyll` to the GitHub Pages repo. Go figure.
