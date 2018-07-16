const axios = require('axios'),
  jsdom = require('jsdom'),
  { JSDOM } = jsdom;

const id = 265364694;

function getSeats(id) {
  if (!id) throw new Error('no id');

  return axios({
    method: 'get',
    url: `https://www.regmovies.com/checkout/${id}/seat-map?numTickets=1`
  })
    .then(({ data }) => {
      const dom = new JSDOM(data);
      const document = dom.window.document;
      let seatsNodeList = document.querySelectorAll('div.seat-map-container g.seat');
      let seats = Array.prototype.slice.call(seatsNodeList, 0);
      seats = seats.map(s => {
        let avail = s.getAttribute('is-available');
        return {
          name: s.getAttribute('seat-name'),
          isAvailable: avail === 'true' ? true : false,
          label: s.getAttribute('aria-label'),
          rowNum: s.getAttribute('row-number'),
        };
      });
      return seats;
    });
}

getSeats(id)
  .then(seats => {
    // console.log(seats);
    console.log(seats
      .filter(s => !s.isAvailable)
      .map(s => s.name));
  })
  .catch(console.error);
