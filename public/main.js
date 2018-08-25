var app = new Vue({
  el: '#app',
  data: {
    isFetchingSeats: false,
    theaterId: '',
    seats: [],
  },

  computed: {
    occupiedSeats() {
      return this.seats.filter(s => !s.isAvailable);
    },

    availableSeats() {
      return this.seats.filter(s => s.isAvailable);
    },
  },

  created() {
    this.theaterId = this.readTheaterIdHash() || this.readTheaterIdCookie();
  },

  methods: {
    async getSeats() {
      this.isFetchingSeats = true;
      if (!this.validateInput()) throw new Error(`invalid theaterId ${this.theaterId}`);
      this.setTheaterIdCookie(this.theaterId);
      let seats = await this.fetchSeats(this.theaterId);
      this.isFetchingSeats = false;
      this.seats = seats;
    },

    async fetchSeats(id) {
      let { data: seats } = await axios({
        url: `/theaters/${id}/seats`,
        method: 'get',
      });
      return seats;
    },

    // cleans and validates input
    validateInput() {
      let curInput = this.theaterId;
      try {
        let id = curInput.match(/\d{7,11}/)[0];
        if (id.length.length < 7) return false;
        this.theaterId = id;
        return true;
      } catch(e) {
        return false;
      }
    },

    readTheaterIdHash() {
      if (!location.hash) return null;
      return location.hash.substring(1);
    },

    readTheaterIdCookie() {
      let c = document.cookie
      let id = '';
      if (c.match(/theaterId=(\d+)/)) id = c.match(/theaterId=(\d+)/)[1];
      return id;
    },

    setTheaterIdCookie(id) {
      document.cookie = 'theaterId=' + id;
    },

  }
})
