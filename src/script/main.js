import * as d3 from 'd3';
import { movies, colorObj } from './movies';

d3.select('svg')
  .selectAll('path')
  .data(movies)
  .attr('fill', (d) => colorObj[d.genres[0]] ?? colorObj.Other)
  .attr('stroke', (d) => colorObj[d.genres[0]] ?? colorObj.Other)
  .attr('fill-opacity', '0.5')
  .attr('stroke-width', '2');
