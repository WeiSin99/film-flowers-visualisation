import * as d3 from 'd3';
import lodash from 'lodash';
import { calculateData, calculateGraph } from './utils';
import { movies, topGenres } from './data';

const simulate = (graph) => {
  const link = d3
    .select('svg')
    .selectAll('.link')
    .data(graph.links, (d) => d.id)
    .join('line')
    .classed('link', true)
    .attr('stroke', '#ccc')
    .attr('opacity', 0.5);

  const flower = d3
    .select('svg')
    .selectAll('g')
    .data(graph.nodes, (d) => d.title)
    .join((enter) => {
      const g = enter.append('g');

      g.selectAll('path')
        .data((d) => {
          return Array.from({ length: d.numPetals }).map((_, i) => {
            return { rotate: i * (360 / d.numPetals), ...d };
          });
        })
        .enter()
        .append('path')
        .attr('d', (d) => d.path)
        .attr('transform', (d) => `rotate(${d.rotate})scale(${d.scale})`)
        .attr('fill', (d) => d.color)
        .attr('stroke', (d) => d.color)
        .attr('fill-opacity', '0.5')
        .attr('stroke-width', '2');

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .style('font-size', '.7em')
        .style('font-style', 'italic')
        .text((d) => lodash.truncate(d.title, { length: 20 }));

      return g;
    });

  const genres = d3
    .select('svg')
    .selectAll('.genre')
    .data(graph.genres, (d) => d.label)
    .join('text')
    .classed('genre', true)
    .text((d) => d.label)
    .attr('text-anchor', 'middle');

  const nodes = graph.nodes.concat(graph.genres);
  d3.forceSimulation(nodes)
    .force('link', d3.forceLink(graph.links))
    .force(
      'collide',
      d3.forceCollide((d) => d.scale * 100)
    )
    .force('center', d3.forceCenter(600, 600))
    .on('tick', () => {
      flower.attr('transform', (d) => `translate(${d.x}, ${d.y})`);
      genres.attr('transform', (d) => `translate(${d.x}, ${d.y})`);
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);
    });
};

const init = () => {
  const flowers = calculateData(movies);
  const graph = calculateGraph(movies, flowers);
  simulate(graph);
};
init();

document.querySelector('.container').addEventListener('change', function (e) {
  if (e.target.tagName !== 'INPUT') return;

  const filteredGenres = Array.from(
    document.querySelector('.genre-filter').querySelectorAll('input')
  ).reduce((arr, input) => {
    if (input.checked) {
      arr.push(input.value);
    }
    return arr;
  }, []);

  const filteredPG = Array.from(
    document.querySelector('.pg-filter').querySelectorAll('input')
  ).reduce((arr, input) => {
    if (input.checked) {
      arr.push(input.value);
    }
    return arr;
  }, []);

  const filteredMovies = movies.filter((movie) => {
    return (
      (filteredGenres.includes(movie.genres[0]) ||
        (filteredGenres.includes('Other') &&
          !topGenres.includes(movie.genres[0]))) &&
      filteredPG.includes(movie.rated)
    );
  });
  const filteredFlowers = calculateData(filteredMovies);

  const filteredGraph = calculateGraph(filteredMovies, filteredFlowers);
  simulate(filteredGraph);
});
