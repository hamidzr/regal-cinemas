var app = new Vue({
  el: '#app',
  data: {
    isFetchingSeats: false,
    theaterId: '',
    seats: [],
  },

  methods: {
    async getSeats() {
      this.isFetchingSeats = true;
      if (!this.validateInput()) throw new Error(`invalid theaterId ${this.theaterId}`);
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

  }
})
