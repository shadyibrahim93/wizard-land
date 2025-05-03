const fs = require('fs');
const path = require('path');
const { SitemapStream } = require('sitemap');
const { Readable } = require('stream');

// Assuming your React app uses react-router
const routes = [
  '/',
  '/games/bingo-quest',
  '/games/orbito-quest',
  '/games/chess-quest',
  '/games/connect-four-quest',
  '/games/tic-tac-toe-quest',
  '/games/checker-quest',
  '/games/scramble-quest',
  '/games/sudoku-quest',
  '/games/math-quest',
  '/games/puzzle-quest',
  '/games/personal-puzzle-quest',
  '/games/match-quest',
  '/games/memory-quest',
  '/games/dropzone-quest'
];

const generateSitemap = () => {
  // Create a readable stream from the routes
  const links = routes.map((route) => ({
    url: route,
    changefreq: 'daily',
    priority: 0.8
  }));
  const stream = new SitemapStream({ hostname: 'https://www.wizardland.net' });

  // Pipe the sitemap stream to a writable stream to create the XML file
  const writeStream = fs.createWriteStream(
    path.resolve(__dirname, 'public', 'sitemap.xml')
  );
  stream.pipe(writeStream);

  // Push each route as a URL into the stream
  links.forEach((link) => stream.write(link));

  // End the stream to finalize the sitemap
  stream.end();

  writeStream.on('finish', () => {
    console.log('Sitemap generated successfully!');
  });
};

generateSitemap();
