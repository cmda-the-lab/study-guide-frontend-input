<template>
	<section>
        <p>{{payload.title}}</p>
        <select v-model="payload.chosen" v-on:input="updateValue($event.target.value)">
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
      lang: Number,
      chosen: Object,
    }
  },
  methods: {
    updateValue: function (chosen) {
    console.log("update triggered", chosen)
      this.$emit('input', chosen);
    }
  },
  created: function() {
    console.log("drop-down loaded with payload:", this.payload)
  }
}
</script>
