<template>
	<section>
        <p>{{payload.title}}</p>
        <select v-model="payload.chosen" v-on:input="chosen($event.target.value)">
          <option v-for="option in payload.options" :key="option.id">
            {{ option.name[payload.lang].value }}
          </option>
        </select>
      </section>
</template>

 <script>
export default {
  name: "drop-down",
  props: {
    payload: {
      title: String,
      options: Array,
      lang: Number
    }
  },
  created: function() {
    //console.log("drop-down loaded with payload:", this.payload)
  },
  methods: {
    chosen: function(val) {
      const choice = this.payload.options.find(option => option.name[this.payload.lang].value == val)
      this.$emit("input", choice)
    }
  }
}
</script>
