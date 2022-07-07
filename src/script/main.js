import * as d3 from 'd3';
import { movies, colorObj, pathObj } from './data';
import { calculateGridPos } from './utils';

d3.select('svg')
  .selectAll('path')
  .data(movies)
  .enter()
  .append('path')
  .attr('d', (d) => pathObj[d.rated])
  .attr('transform', (_, i) => `translate(${calculateGridPos(i)})`)
  .attr('fill', (d) => colorObj[d.genres[0]] ?? colorObj.Other)
  .attr('stroke', (d) => colorObj[d.genres[0]] ?? colorObj.Other)
  .attr('fill-opacity', '0.5')
  .attr('stroke-width', '2');
