import * as d3 from 'd3';
import { movies, topGenres, petalColors, colorObj, petalPaths } from './data';
import { calculateGridPos } from './utils';

const colorScale = d3
  .scaleOrdinal()
  .domain(topGenres)
  .range(petalColors)
  .unknown(colorObj.Other);

const pathScale = d3.scaleOrdinal().range(petalPaths);

const minMaxRating = d3.extent(movies, (d) => d.rating);
const sizeScale = d3.scaleLinear().domain(minMaxRating).range([0.2, 0.75]);

const minMaxVoting = d3.extent(movies, (d) => d.votes);
const numPetalScale = d3
  .scaleQuantize()
  .domain(minMaxVoting)
  .range([5, 6, 7, 8, 9, 10]);

const flowers = movies.map((movie, i) => {
  return {
    color: colorScale(movie.genres[0]),
    path: pathScale(movie.rated),
    scale: sizeScale(movie.rating),
    numPetals: numPetalScale(movie.votes),
    title: movie.title,
    translate: calculateGridPos(i),
  };
});

d3.select('svg')
  .selectAll('path')
  .data(flowers)
  .enter()
  .append('path')
  .attr('d', (d) => d.path)
  .attr('transform', (d) => `translate(${d.translate})scale(${d.scale})`)
  .attr('fill', (d) => d.color)
  .attr('stroke', (d) => d.color)
  .attr('fill-opacity', '0.5')
  .attr('stroke-width', '2');
