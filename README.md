This is a music genre visualizer and recommendation application. The goal is to visualize the interconnectivity of music with relevancy towards its subgenres. This will occur by generating artist nodes and each visible edge connecting the nodes will be shared subgenres. The graph will be interactive and will allow the user to filter subgenres and target nodes based on data points such as artist popularity and follower count.

The application will make use of Spotify's API to generate curated results based on the user's saved data. This will allow for more personal usage and meaningful results. Lastly, the application will provide subgenre based recommendations for music discovery. This will be popular artists, niche artists, and rising artists in each subgenre. 

I originally wanted to develop this application due to my curiosity of learning about my favourite subgenres and exploring. Rather than creating a spreadsheet and keeping track of each subgenre through google searches, I figured creating an interactive application would be a more fun experience. As I understand that many people love spotify data (think spotify wrapped), I figured this would be an application that many would find exciting to use to visualize their trends and learn of new artists in their favorite genres!

A more detailed guide will be created as the project furthers along development. 

## Libraries

### Next.js
The application is built with Next.js which allows for both front-end (React) and back-end (Node) actions to be performed on the same server.

https://nextjs.org/

### Tailwind
The styling for the application is primarily done through Tailwind

https://tailwindcss.com/

### Cytoscape
Javascript graph library utilized for music visualizations through a weighted node graph. There are invisible anchor nodes for each main genre, and each artist is assigned a collection of genre weights which will pull the artist towards the anchor(s). For example, an artist may be a rock band with pop influences. This will produce a weight such as [rock: 100, pop: 20] which will make it primarily pulled towards the rock anchor but will also be slightly pulled in the direction of the pop anchor. 

Each connection is made through an edge. The edges for simulating physics are invisible while the visual edges show the related subgenres between artists.

https://js.cytoscape.org/ 

### Chroma.js
Chroma is a javascript library utilized for generating unique colors for each subgenre within a range of its main genre's designated color.

https://www.npmjs.com/package/chroma-js 

### MongoDB

The application will eventually be connected to a noSQL MongoDB database for storing a user's artist list. While the artist list can be generated through spotify API queries, the user will also have the ability to favourite artists, save recommendations, and add artists not found on their saved spotify lists.

https://www.mongodb.com/ 

### Spotify API

The spotify API which will be utilized for two reasons.

1. Access to an extremely large collection of artists and subgenre data
2. Provide personal and meaningful data visualizations for the user

There are also further benefits such as artist images which allows for recognizable visualizations!

https://developer.spotify.com/documentation/web-api


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
