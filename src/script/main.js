import * as d3 from 'd3';
import lodash from 'lodash';
import { movies, topGenres, petalColors, colorObj, petalPaths } from './data';
import { calculateGridPos } from './utils';

const colorScale = d3
  .scaleOrdinal()
  .domain(topGenres)
  .range(petalColors)
  .unknown(colorObj.Other);

const pathScale = d3.scaleOrdinal().range(petalPaths);

const minMaxRating = d3.extent(movies, (d) => d.rating);
const sizeScale = d3.scaleLinear().domain(minMaxRating).range([0.2, 0.6]);

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

const g = d3.select('svg').selectAll('g').data(flowers).enter().append('g');

const path = g
  .selectAll('path')
  .data((d) => {
    return Array.from({ length: d.numPetals }).map((_, i) => {
      return Object.assign({}, d, { rotate: i * (360 / d.numPetals) });
    });
  })
  .enter()
  .append('path');

const text = g.append('text');

g.attr('transform', (d) => `translate(${d.translate})`);

text
  .attr('text-anchor', 'middle')
  .attr('dy', '.35em')
  .style('font-size', '.7em')
  .style('font-style', 'italic')
  .text((d) => lodash.truncate(d.title, { length: 20 }));

path
  .attr('d', (d) => d.path)
  .attr('transform', (d) => `rotate(${d.rotate})scale(${d.scale})`)
  .attr('fill', (d) => d.color)
  .attr('stroke', (d) => d.color)
  .attr('fill-opacity', '0.5')
  .attr('stroke-width', '2');
