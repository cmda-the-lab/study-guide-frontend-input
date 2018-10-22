<template>
  <div id="app">
    <h1>De nieuwe ✨Vakkenvuller✨</h1>
    <form id="signup-form" @submit.prevent="postCourse">
      <drop-down v-bind:payload="{options:faculties, lang:lang, title:'Onder welke faculteit valt dit vak?', chosen:cFaculty}"
                v-on:input="facultyChosen"></drop-down>
      <drop-down v-bind:payload="{options:program, lang:lang, title:'Bij welk studie programma hoort dit vak?'}"></drop-down>
      <section id="Indicatoren">
        <p>Welke competentie indicatoren zijn vertegenwoordigd/komen terug in dit vak?</p>
        <select >
          <option v-for="indicator in indicators" :key="indicator.id">
            {{ indicator.value }}
          </option>
        </select>
      </section>
      <section id="vakNaam">
        <p>Wat is de naam van het vak?</p>
        <input v-model="name" placeholder="type hier">
        <p>Naam: {{ name }}</p>
      </section>
      <button>Sla het vak op</button>
    </form>
  </div>
</template>

<script>
const APIUrl = "http://localhost:8000/"

export default {
  name: "app",
  components: {},
  data: function() {
    return {
      lang: 0,
      name: "",
      faculties: "",
      cFaculty: {},
      description: "",
      years: "",
      learningYears: "",
      periods: "",
      credits: "",
      start: "",
      end: "",
      methods: "",
      methodsSummary: "",
      coordinators: "",
      coordinatorsSummary: "",
      teachers: "",
      teachersSummary: "",
      competencies: "",
      indicators: "",
      indicatorSummary: "",
      objectivesSummary: "",
      program: ""
    }
  },
  created: function() {
    console.log("Page loaded")
    fetch(APIUrl + "faculty/")
      .then(response => response.json())
      .then(json => {
        this.faculties = json
      })
    fetch(APIUrl + "program/")
      .then(response => response.json())
      .then(json => {
        this.program = json
      })
    fetch(APIUrl + "indicator/")
      .then(response => response.json())
      .then(json => {
        this.indicators = json
      })
  },
  methods: {
    facultyChosen: function(val){
      console.log("val!", val)
    },
    postCourse: function() {
      console.log(this.$data)
      fetch("http://localhost:8000/course/", {
        method: "post",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(this.$data)
      })
        .then(response => response.json())
        .then(json => {
          console.log(json)
        })
    }
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
