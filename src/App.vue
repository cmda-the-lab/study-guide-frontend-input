<template>
  <div id="app">
    <h1>De nieuwe ✨Vakkenvuller✨</h1>
    <section id="Faculteit">
      <p>Onder welke faculteit valt dit vak?</p>
      <select v-model="selected">
        <option>{{ selected }}</option>
        <option>B</option>
        <option>C</option>
      </select>
    </section>
    <section id="vakNaam">
      <p>Wat is de naam van het vak?</p>
      <input v-model="message" placeholder="type hier">
      <p>Naam: {{ message }}</p>
    </section>
  </div>
</template>

<script>

export default {
  name: "app",
  data: function(){
    return {
      message: "",
      selected: ""
    }
  },
  created() {
    console.log("Page loaded")
    fetch("http://localhost:8000/faculty/")
      .then(response => response.json())
      .then(json => { this.selected = json[0].name[0].value })
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
