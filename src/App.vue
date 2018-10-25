<template>
  <div id="app">
    <h1>De nieuwe ✨Vakkenvuller✨</h1>
    <form id="signup-form" @submit.prevent="postCourse">
      <drop-down 
        v-if="loaded.faculties" 
        v-bind:payload="{options:faculties, lang:lang, title:'Onder welke faculteit valt dit vak?'}"
        v-on:input="facultyChosen"
        />
      <drop-down 
        v-if="loaded.program" 
        v-bind:payload="{options:program, lang:lang, title:'Bij welk studie programma hoort dit vak?'}"
        />
      <section>
        <p>Wat is de naam van het vak?</p>
        <input v-model="name" placeholder="type hier">
      </section>
      <section>
        <p>Geef een beschrijving van het vak voor in de studiegids</p>
        <textarea v-model="description" placeholder="type hier" />
      </section>
      <section v-if="loaded.indicators">
        <p>Welke competentie indicatoren zijn vertegenwoordigd/komen terug in dit vak? Je kan er meerdere selecteren of een woord typen om te zoeken</p>
        <multiselect 
          v-model="cIndicators" 
          :options="indicators" 
          :multiple="true" 
          :close-on-select="false" 
          :clear-on-select="false" 
          :preserve-search="true" 
          placeholder="Kies relevante indicatoren" 
          label="value" 
          track-by="_id">
        </multiselect>
      </section>
      <section>
        <p>Op basis van de hierboven geselecteerde indicatoren zijn de volgende competencies vertegenwoordigd in dit vak. Als deze lijst onvolledig is, controleer dan of je wel de goede indicatoren hebt geselecteerd</p>
        <ul>
          <li v-for="competency in competenciesChosen" :key="competency._id">
            {{ competency.value }}
          </li>
        </ul>
      </section>
      <drop-down 
        v-if="false"
        v-bind:payload="{options:followingLearningYears('2017', '3'), lang:lang, title:'In welke leerjaar wordt dit vak gegeven?'}"
        />
      <section>
        <p>Wat is het aantal studiepunten bij dit vak?</p>
        <input type="number" min="0"> 
      </section>
      <section>
        <p>Welke werkvormen worden er gebruikt in dit vak?</p>
        <multiselect
          v-model="cMethods"
          :options="methods"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          placeholder="Kies een of meerdere werkvormen"
        />
      </section>
      <section>
        <p>Geef een toelichting van de werkvormen</p>
        <textarea v-model="methodsSummary" placeholder="type hier" />
      </section>
      <section v-if="loaded.staff">
        <p>Welke personen coördineren dit vak? Je kan meerdere personen selecteren of een naam typen om te zoeken</p>
        <multiselect
          v-model="cCoordinators"
          :options="staff"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="true"
          placeholder="Kies betrokken personen"
          label="name"
          track-by="_id"
        />
      </section>
      <section v-if="loaded.staff">
        <p>Welke docenten geven dit vak? Je kan meerdere docenten selecteren of een naam typen om te zoeken</p>
        <multiselect
          v-model="cTeachers"
          :options="staff"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="true"
          placeholder="Kies betrokken docenten"
          label="name"
          track-by="_id"
        />
      </section>
      <section>
        <p>Welke leerdoelen zijn er bij dit vak?</p>
        <textarea v-model="objectivesSummary" placeholder="type hier" />
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
        staff: false,
        indicators: false,
        faculties: false,
        program: false,
        competencies: false
      },
      name: "",
      program: "",
      faculties: "",
      cFaculty: {},
      staff: "",
      cCoordinators: [],
      cTeachers: [],
      indicators: "",
      cIndicators: [],
      competencies: "",
      description: "",
      methods: ["practicum", "lecture", "lab", "coaching", "hoorcollege"],
      cMethods: [],
      methodsSummary: "",
      objectivesSummary: ""
      // years: "",
      // learningYears: ""
      // cCompetencies: [],
      //
      // years: "",
      // learningYears: "",
      // periods: "",
      // start: "",
      // end: "",
      //
      // coordinatorsSummary: "",
      // teachersSummary: "",
      //
      // indicatorSummary: "",
      //
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
        this.staff = json
        this.loaded.staff = true
      })
    fetch(APIUrl + "indicator/")
      .then(response => response.json())
      .then(json => {
        this.indicators = json
        this.loaded.indicators = true
      })
    fetch(APIUrl + "competency/")
      .then(response => response.json())
      .then(json => {
        this.competencies = json
        this.loaded.competencies = true
      })
  },
  methods: {
    facultyChosen: function(val) {
      console.log("fac chosen!", val)
      this.cFaculty = val
      //In the future, this could do a get to the programs in the faculty's programs data field. Then those programs would be the only options further on in the form
    },
    //Not yet functional.
    // followingLearningYears: function(rootYear, range) {
    //   return [new Date()]
    // },
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
  },
  computed: {
    competenciesChosen: function() {
      //If indicators have been chose, find out which unique competencies are connected to those indicators
      if (this.cIndicators.length) {
        //console.log("computing comps with cindicators:", this.cIndicators)
        let comps = this.cIndicators.map(indicator => indicator.competency)
        return this.competencies.filter(comp => comps.indexOf(comp._id) > -1)
      }
      return []
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
  color: #2c3e50;
  margin-top: 60px;
  max-width: 36em;
  margin: 0 auto;
}
</style>
