<template>
  <div id="app">
    <h1>De nieuwe ✨Vakkenvuller✨</h1>
    <form id="signup-form" @submit.prevent="postCourse">
      <drop-down v-if="loaded.faculties" v-bind:payload="{options:faculties, lang:lang, title:'Onder welke faculteit valt dit vak?'}"
                v-on:input="facultyChosen"></drop-down>
      <drop-down v-if="loaded.program" v-bind:payload="{options:program, lang:lang, title:'Bij welk studie programma hoort dit vak?'}"></drop-down>
      <section id="Indicatoren" v-if="loaded.indicators">
        <p>Welke competentie indicatoren zijn vertegenwoordigd/komen terug in dit vak? Je kan er meerdere selecteren of een woord typen om te zoeken</p>
        <multiselect v-model="cIndicators" :options="indicators" :multiple="true" :close-on-select="false" :clear-on-select="false" :preserve-search="true" placeholder="Kies relevante indicatoren" label="value" track-by="_id">
        </multiselect>
      </section>
      <section id="vakNaam">
        <p>Wat is de naam van het vak?</p>
        <input v-model="name" placeholder="type hier">
      </section>
      <section v-if="loaded.teachers">
        <p>Welke docenten geven dit vak? Je kan meerdere docenten selecteren of een naam typen om te zoeken</p>
        <multiselect v-model="cTeachers" :options="teachers" :multiple="true" :close-on-select="false" :clear-on-select="false" :preserve-search="true" placeholder="Kies betrokken docenten" label="name" track-by="_id">
        </multiselect>
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
      loaded: {
        teachers: false,
        indicators: false,
        faculties: false,
        program: false
      },
      name: "",
      program: "",
      faculties: "",
      cFaculty: {},
      teachers: "",
      cTeachers: [],
      indicators: "",
      cIndicators: []
      // description: "",
      // years: "",
      // learningYears: "",
      // periods: "",
      // credits: "",
      // start: "",
      // end: "",
      // methods: "",
      // methodsSummary: "",
      // coordinators: "",
      // coordinatorsSummary: "",
      // teachersSummary: "",
      // competencies: "",
      // indicatorSummary: "",
      // objectivesSummary: "",
    }
  },
  created: function() {
    console.log("Page loaded")
    fetch(APIUrl + "faculty/")
      .then(response => response.json())
      .then(json => {
        this.faculties = json
        this.loaded.faculties = true
      })
    fetch(APIUrl + "program/")
      .then(response => response.json())
      .then(json => {
        this.program = json
        this.loaded.program = true
      })
    fetch(APIUrl + "person/")
      .then(response => response.json())
      .then(json => {
        this.teachers = json
        this.loaded.teachers = true
      })
    fetch(APIUrl + "indicator/")
      .then(response => response.json())
      .then(json => {
        this.indicators = json
        this.loaded.indicators = true
      })
  },
  methods: {
    facultyChosen: function(val) {
      console.log("fac chosen!", val)
      this.cFaculty = val
      //In the future, this could do a get to the programs in the faculty's programs data field. Then those programs would be the only options further on in the form
    },
    postCourse: function() {
      console.log("Sending Course to API:", this.$data)
      //TODO: Validate data before it is sent. The API is way too "nice" right now and will allow empty fields. There should be clients-side and server side validation.
      //TODO: Disable the form being sent on enter or other events except for when the relevant button is pushed.
      // fetch(APIUrl + "course/", {
      //   method: "post",
      //   headers: {
      //     "Content-Type": "application/json; charset=utf-8"
      //   },
      //   body: JSON.stringify(this.$data)
      // })
      //   .then(response => response.json())
      //   .then(json => {
      //     console.log(json)
      //   })
    }
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css">
</style>
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
