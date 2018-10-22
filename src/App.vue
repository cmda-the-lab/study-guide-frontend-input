<template>
  <div id="app">
    <h1>De nieuwe ✨Vakkenvuller✨</h1>
    <form id="signup-form" @submit.prevent="postCourse">
      <drop-down v-bind:payload="{options:faculties, lang:lang, title:'Onder welke faculteit valt dit vak?'}"
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
      <multiselect v-model="cTeachers" :options="teachers" :multiple="true" :close-on-select="false" :clear-on-select="false" :preserve-search="true" placeholder="Pick some" label="name" track-by="name" :preselect-first="true">
        <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} options selected</span></template>
      </multiselect>
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
      cTeachers: [],
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
    fetch(APIUrl + "person/")
      .then(response => response.json())
      .then(json => {
        this.teachers = json
        console.log(this.teachers)
      })
    fetch(APIUrl + "indicator/")
      .then(response => response.json())
      .then(json => {
        this.indicators = json
      })
  },
  methods: {
    facultyChosen: function(val) {
      console.log("fac chosen!", val)
      this.cFaculty = val
      //In the future, this could do a get to the programs in the faculty's programs data field. Then those programs would be the only options further on in the form
    },
    postCourse: function() {
      console.log(this.$data)
      fetch(APIUrl + "course/", {
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
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
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
