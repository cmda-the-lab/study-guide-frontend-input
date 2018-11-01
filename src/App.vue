<template>
  <div id="app">
    <h1>De nieuwe ✨Vakkenvuller✨</h1>
    <form id="signup-form" @submit.prevent>
      <section>
        <p>Onder welke faculteit valt dit vak?</p>
        <select v-if="loaded.faculties" v-model="newCourse.faculty">
          <option v-for="option in courseOptions.faculties" :key="option.id" v-bind:value="option">
              {{ option.name[lang].value }}
          </option>
        </select>
      </section>
        <section>
        <p>Bij welk studie programma hoort dit vak?</p>
         <select v-if="loaded.program" v-model="newCourse.program">
          <option v-for="option in courseOptions.program" :key="option.id" v-bind:value="option">
              {{ option.name[lang].value }}
          </option>
        </select>
      </section>
      <section>
        <p>Wat is de naam van het vak?</p>
        <input v-model="newCourse.name" placeholder="type hier">
      </section>
      <section>
        <p>Geef een beschrijving van het vak voor in de studiegids</p>
        <textarea v-model="newCourse.description" placeholder="type hier" />
      </section>
      <section>
        <p>Welke leerdoelen zijn er bij dit vak?</p>
        <textarea v-model="newCourse.objectivesSummary" placeholder="type hier" />
      </section>
      <section v-if="loaded.competencies">
        <p>Welke competenties komen terug in dit vak? Je kan er meerdere selecteren of een woord typen om te zoeken</p>
        <multiselect 
          v-model="newCourse.competencies" 
          :options="courseOptions.competencies" 
          :multiple="true" 
          :close-on-select="false" 
          :clear-on-select="false" 
          :preserve-search="true" 
          placeholder="Kies relevante competencies" 
          label="value" 
          track-by="_id"
          />
      </section>
      <section>
        <p>Wat is het aantal studiepunten bij dit vak?</p>
        <input type="number" min="0" v-model="newCourse.credits"> 
      </section>
      <section>
        <p>Welke werkvormen worden er gebruikt in dit vak?</p>
        <multiselect
          v-model="newCourse.methods"
          :options="courseOptions.methods"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          placeholder="Kies een of meerdere werkvormen"
        />
      </section>
      <section>
        <p>Geef een toelichting van de werkvormen</p>
        <textarea v-model="newCourse.methodsSummary" placeholder="type hier" />
      </section>
      <section v-if="loaded.staff">
        <p>Welke personen coördineren dit vak? Je kan meerdere personen selecteren of een naam typen om te zoeken</p>
        <multiselect
          v-model="newCourse.coordinators"
          :options="courseOptions.staff"
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
          v-model="newCourse.teachers"
          :options="courseOptions.staff"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="true"
          placeholder="Kies betrokken docenten"
          label="name"
          track-by="_id"
        />
      </section>
      <p v-if="errors.length">
        <b>Het vak kan pas worden opgeslagen als de volgende fouten worden gecorrigeerd</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>
      <button v-on:click="checkForm">Sla het vak op in de database</button>
    </form>
  </div>
</template>

<script>
const APIUrl = process.env.NODE_ENV === "production" ? "https://study-guide-api.herokuapp.com/" : "http://localhost:8000/"

export default {
  name: "app",
  components: {},
  data: function() {
    return {
      lang: 0,
      errors: [],
      loaded: {
        staff: false,
        indicators: false,
        faculties: false,
        program: false,
        competencies: false
      },
      newCourse: {
        name: null,
        description: null,
        credits: null,
        methods: null,
        methodsSummary: null,
        coordinators: null,
        teachers: null,
        competencies: null,
        indicators: null,
        objectivesSummary: null,
        program: null,
        faculty: null
      },
      courseOptions: {
        faculties: "",
        program: "",
        staff: "",
        indicators: "",
        competencies: "",
        methods: ["practicum", "lecture", "lab", "coaching", "hoorcollege"]
      }
    }
  },
  created: function() {
    console.log("Page loaded")
    fetch(APIUrl + "faculty/")
      .then(response => response.json())
      .then(json => {
        this.courseOptions.faculties = json
        this.newCourse.faculty = json[0] //Auto select the first faculty in the array
        this.loaded.faculties = true
      })
    fetch(APIUrl + "program/")
      .then(response => response.json())
      .then(json => {
        this.courseOptions.program = json
        this.newCourse.program = json[0] //Auto select the first program in the array
        this.loaded.program = true
      })
    fetch(APIUrl + "person/")
      .then(response => response.json())
      .then(json => {
        this.courseOptions.staff = json
        this.loaded.staff = true
      })
    fetch(APIUrl + "indicator/")
      .then(response => response.json())
      .then(json => {
        this.courseOptions.indicators = json
        this.loaded.indicators = true
      })
    fetch(APIUrl + "competency/")
      .then(response => response.json())
      .then(json => {
        this.courseOptions.competencies = json
        this.loaded.competencies = true
      })
  },
  methods: {
    checkForm: function() {
      //Check if the input is valid. If it is, post the course to the API
      this.errors = []
      if (!this.newCourse.name) {
        this.errors.push("De naam voor het vak ontbreekt")
      }
      if (!this.newCourse.competencies) {
        this.errors.push("Er zijn nog geen competenties gekozen")
      }
      if (!this.newCourse.description) {
        this.errors.push("De beschrijving van het vak ontbreekt")
      }
      if (!this.newCourse.credits) {
        this.errors.push("De studiepunten van het vak ontbreken")
      }
      if (!this.newCourse.coordinators) {
        //this.errors.push('Er is nog geen coördinator ingevuld')
      }
      if (!this.newCourse.indicators) {
        this.errors.push("Er zijn geen competentie indicatoren gekozen")
      }
      if (!this.newCourse.objectivesSummary) {
        this.errors.push("De leerdoelen van het vak ontbreken")
      }
      if (!this.newCourse.program) {
        this.errors.push("Er is nog geen studie programma gekozen")
      }
      if (!this.newCourse.faculty) {
        this.errors.push("De faculteit waar dit vak bij hoort ontbreekt")
      }
      this.errors = [...new Set(this.errors)]
      if (!this.errors.length) this.postCourse()
    },
    postCourse: function() {
      let courseData = this.$data.newCourse
      courseData.name = [{ language: "nl", value: courseData.name }]
      courseData.description = [{ language: "nl", value: courseData.description }]
      if (courseData.coordinators) {
        courseData.coordinators = courseData.coordinators.map(coordinator => coordinator._id)
      }
      if (courseData.teachers) {
        courseData.teachers = courseData.teachers.map(teacher => teacher._id)
      }
      courseData.competencies = courseData.competencies.map(competency => competency._id)
      courseData.indicators = courseData.indicators.map(indicator => indicator._id)
      courseData.program = courseData.program._id
      courseData.faculty = courseData.faculty._id
      console.log("Sending Course to API:", courseData)
      fetch(APIUrl + "course/", {
        method: "post",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(courseData)
      }).then(response => console.log(response))
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
