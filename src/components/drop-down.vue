<template>
	<section>
        <p>{{payload.title}}</p>
        <select>
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
    console.log("drop-down loaded with payload:", this.payload)
  }
}
</script>
