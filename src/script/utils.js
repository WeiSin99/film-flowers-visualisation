import * as d3 from 'd3';
import { movies, topGenres, petalColors, colorObj, petalPaths } from './data';

const calculateGridPos = (i) => {
  const width = 1152;
  const pathWidth = 120;
  const perRow = Math.floor(width / pathWidth);

  return [
    ((i % perRow) + 0.5) * pathWidth,
    (Math.floor(i / perRow) + 0.5) * pathWidth,
  ];
};

const calculateData = (filteredMovies) => {
  const colorScale = d3
    .scaleOrdinal()
    .domain(topGenres)
    .range(petalColors)
    .unknown(colorObj.Other);

  const pathScale = d3
    .scaleOrdinal()
    .domain(['G', 'PG', 'PG-13', 'R'])
    .range(petalPaths);

  const minMaxRating = d3.extent(movies, (d) => d.rating);
  const sizeScale = d3.scaleLinear().domain(minMaxRating).range([0.2, 0.6]);

  const minMaxVoting = d3.extent(movies, (d) => d.votes);
  const numPetalScale = d3
    .scaleQuantize()
    .domain(minMaxVoting)
    .range([5, 6, 7, 8, 9, 10]);

  return filteredMovies.map((movie, i) => {
    return {
      color: colorScale(movie.genres[0]),
      path: pathScale(movie.rated),
      scale: sizeScale(movie.rating),
      numPetals: numPetalScale(movie.votes),
      title: movie.title,
      translate: calculateGridPos(i),
    };
  });
};

const calculateGraph = (movies, flowers) => {
  const genres = {};
  const nodes = [];
  const links = [];

  movies.forEach((movie, i) => {
    nodes.push(flowers[i]);

    movie.genres.forEach((genre) => {
      if (!genres[genre]) {
        genres[genre] = {
          label: genre,
          size: 0,
        };
      }
      genres[genre].size += 1;

      links.push({
        source: genres[genre],
        target: flowers[i],
        id: `${genre}-movie${i}`,
      });
    });
  });

  return { nodes, genres: Object.values(genres), links };
};
export { calculateGridPos, calculateData, calculateGraph };
