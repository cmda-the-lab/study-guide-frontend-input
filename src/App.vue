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
      <section v-if="loaded.indicators">
        <p>Welke competentie indicatoren zijn vertegenwoordigd/komen terug in dit vak? Je kan er meerdere selecteren of een woord typen om te zoeken</p>
        <multiselect 
          v-model="newCourse.indicators" 
          :options="courseOptions.indicators" 
          :multiple="true" 
          :close-on-select="false" 
          :clear-on-select="false" 
          :preserve-search="true" 
          placeholder="Kies relevante indicatoren" 
          label="value" 
          track-by="_id"
          @input="calculateCompetencies"
          />
      </section>
      <section>
        <p>Op basis van de hierboven geselecteerde indicatoren zijn de volgende competencies vertegenwoordigd in dit vak. Als deze lijst onvolledig is, controleer dan of je wel de goede indicatoren hebt geselecteerd</p>
        <ul>
          <li v-for="competency in newCourse.competencies" :key="competency._id">
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
      <section>
        <p>Welke leerdoelen zijn er bij dit vak?</p>
        <textarea v-model="newCourse.objectivesSummary" placeholder="type hier" />
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
const APIUrl = "http://localhost:8000/"

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
        faculty: null,
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
        this.loaded.faculties = true
      })
    fetch(APIUrl + "program/")
      .then(response => response.json())
      .then(json => {
        this.courseOptions.program = json
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
    facultyChosen: function(val) {
      console.log("fac chosen!", val)
      this.newCourse.cFaculty = val
      //In the future, this could do a get to the programs in the faculty's programs data field. Then those programs would be the only options further on in the form
    },
    calculateCompetencies: function() {
      //find out which unique competencies are connected to those indicators
      //TODO: Now that this is no longer a computed but a method, it can be simplified by just adding the relevant comp to the newCourse.competencies list.

      //console.log("computing comps with indicators:", this.newCourse.indicators)
      let comps = this.newCourse.indicators.map(indicator => indicator.competency)
      console.log("comps", comps)
      this.newCourse.competencies = this.courseOptions.competencies.filter(comp => comps.indexOf(comp._id) > -1)
    },
    checkForm: function (e) {
      //Check if the input is valid. If it is, post the course to the API
      this.errors = []
      if (!this.newCourse.name) {
        this.errors.push('Vul de vaknaam in')
      }
      if (!this.newCourse.competencies) {
        this.errors.push('Er zijn nog geen competenties gekozen')
      }
      this.errors = [...new Set(this.errors)]
      if (!this.errors.length) this.postCourse()
    },
    //Not yet functional.
    // followingLearningYears: function(rootYear, range) {
    //   return [new Date()]
    // },
    postCourse: function() {
      
      //TODO: Validate data before it is sent. The API is way too "nice" right now and will allow empty fields. There should be clients-side and server side validation.
      //TODO: Disable the form being sent on enter or other events except for when the relevant button is pushed.
      let courseData = this.$data.newCourse
      courseData.name = [{ language: "nl", value: courseData.name }]
      courseData.description = [{ language: "nl", value: courseData.description }]
      courseData.coordinators = courseData.coordinators.map(coordinator => coordinator._id)
      courseData.teachers = courseData.teachers.map(teacher => teacher._id)
      courseData.competencies = courseData.competencies.map(competency => competency._id)
      courseData.indicators = courseData.indicators.map(indicator => indicator._id)
      courseData.program = courseData.program._id
      courseData.faculty = courseData.faculty._id
      console.log("Sending Course to API:", courseData)
      // fetch(APIUrl + "course/", {
      //   method: "post",
      //   headers: {
      //     "Content-Type": "application/json; charset=utf-8"
      //   },
      //   body: JSON.stringify(courseData)
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
  color: #2c3e50;
  margin-top: 60px;
  max-width: 36em;
  margin: 0 auto;
}
</style>
