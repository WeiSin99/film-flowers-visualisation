import * as d3 from 'd3';
import lodash from 'lodash';
import { calculateGridPos } from './utils';
import { movies, topGenres, petalColors, colorObj, petalPaths } from './data';

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

const init = () => {
  const flowers = calculateData(movies);

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
};
init();

document.querySelector('.container').addEventListener('change', function (e) {
  if (e.target.tagName === 'INPUT') {
    // e.preventDefault();
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
    const t = d3.select('svg').transition().duration(1000);

    d3.select('svg')
      .selectAll('g')
      .data(filteredFlowers, (d) => d.title)
      .join(
        (enter) => {
          const g = enter
            .append('g')
            .attr('opacity', 0)
            .attr('transform', (d) => `translate(${d.translate})`);

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
        },
        (update) => update,
        (exit) => {
          exit.transition(t).attr('opacity', 0).remove();
        }
      )
      .transition(t)
      .attr('opacity', 1)
      .attr('transform', (d) => `translate(${d.translate})`);
  }
});
