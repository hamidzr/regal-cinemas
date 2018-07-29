const axios = require('axios'),
  express = require('express'),
  app = express(),
  jsdom = require('jsdom'),
  { JSDOM } = jsdom;

const PORT = process.env.PORT || 3000;

function getSeats(id) {
  if (!id) throw new Error('no id');
  console.log(`getting seats for theater/movie ${id}`)

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

app.use(express.static('public'));

app.get('/theaters/:theaterId/seats', async (req, res) => {
  let theaterId = req.params.theaterId;
  let seats;
  if (!theaterId) {
    return res.status(404).send('theater not found');
  }
  try {
    seats = await getSeats(theaterId);
  } catch (e) {
    return res.status(500).send(`something went wrong`);
  }
  res.json(seats);
})

app.get('/theaters/:theaterId/seats/occupied', async (req, res) => {
  let theaterId = req.params.theaterId;
  let seats;
  if (!theaterId) {
    return res.status(404).send('theater not found');
  }
  try {
    seats = await getSeats(theaterId);
  } catch (e) {
    return res.status(500).send(`something went wrong`);
  }
  let unavailableSeats = seats
    .filter(s => !s.isAvailable)
    .map(s => s.name);
  res.send(unavailableSeats.join(', '));
})

app.listen(PORT, () => console.log('app listening on port', PORT))
