<template>
  <div id="app">
    <div class="page-container">
      <md-app md-waterfall md-mode="overlap">
        <md-app-toolbar class="md-primary md-large">
          <div class="md-toolbar-row">
            <h1 class="md-title">Competentie Monitor</h1>
          </div>
        </md-app-toolbar>

        <md-app-content>

          <form @submit.prevent>
            <md-field v-if="options.faculties && options.faculties.length > 1">
              <label>Faculteit</label>
              <md-select v-model="course.faculty">
                <md-option
                  v-for="option in options.faculties"
                  :value="option._id"
                  :key="option._id"
                >{{ option.name[lang].value }}</md-option>
              </md-select>
            </md-field>

            <md-field v-if="options.program && options.program.length > 1">
              <label>Opleiding</label>
              <md-select v-model="course.program">
                <md-option
                  v-for="option in options.program"
                  :value="option._id"
                  :key="option._id"
                >{{ option.name[lang].value }}</md-option>
              </md-select>
            </md-field>

            <md-field>
              <label>Naam</label>
              <md-input v-model="course.name"></md-input>
            </md-field>
            <p class="help">Wat is de naam van de module? Bijvoorbeeld, “Design Ethics”</p>

            <md-field>
              <label>Korte beschrijving</label>
              <md-textarea v-model="course.shortDescription" md-autogrow maxlength="120"></md-textarea>
            </md-field>
            <p class="help">Beschrijf de module in één zin. Bijvoorbeeld, “Design ethics is a course that allows you to integrate ethical thinking into your design practice.”</p>

            <md-field>
              <label>Beschrijving van module</label>
              <md-textarea v-model="course.description" maxlength="480"></md-textarea>
            </md-field>
            <p class="help">Beschrijf de module in twee tot vier alineas</p>

            <md-field>
              <label>Leerdoelen</label>
              <md-textarea v-model="course.objectivesSummary"></md-textarea>
            </md-field>
            <p class="help">Beschrijf wat de student leert. Gebruik streepjes en enters. Bijvoorbeeld, “- You learn to be aware of the ethical issues involved in design and designing”</p>

            <md-field v-if="options.competencies">
              <label>Competenties</label>
              <md-select v-model="course.competencies" multiple>
                <md-option
                  v-for="option in options.competencies"
                  :value="option._id"
                  :key="option._id"
                >{{ option.value }}</md-option>
              </md-select>
            </md-field>
            <p class="help">Kies de CMD competenties die van toepassing zijn op deze module</p>

            <md-field>
              <label>Studiepunten (ECTS)</label>
              <md-input v-model="course.credits" min="0" max="30" type="number"></md-input>
            </md-field>
            <p class="help">Wat is het aantal studiepuntent van de module? Bijvoorbeeld 3 voor een vak, 5 voor een project.</p>

            <md-field>
              <label>Werkvormen</label>
              <md-select v-model="course.methods" multiple>
                <md-option
                  v-for="(option, index) in options.methods"
                  :value="option"
                  :key="index"
                >{{ option }}</md-option>
              </md-select>
            </md-field>
            <p class="help">Kies de een of meer werkvormen die van toepassing zijn op deze module</p>

            <md-field>
              <label>Beschrijving van werkvormen</label>
              <md-textarea v-model="course.methodsSummary" maxlength="480"></md-textarea>
            </md-field>
            <p class="help">Twee tot vier alineas</p>

            <md-field v-if="options.staff">
              <label>Coördinatoren</label>
              <md-select v-model="course.coordinators" multiple>
                <md-option
                  v-for="option in options.staff"
                  :value="option._id"
                  :key="option._id"
                >{{ option.name }}</md-option>
              </md-select>
            </md-field>
            <p class="help">Kies welke mensen deze module coördineren.</p>


            <md-field v-if="options.staff">
              <label>Docenten</label>
              <md-select v-model="course.teachers" multiple>
                <md-option
                  v-for="option in options.staff"
                  :value="option._id"
                  :key="option._id"
                >{{ option.name }}</md-option>
              </md-select>
            </md-field>
            <p class="help">Kies welke mensen deze module geven.</p>


            <p v-if="errors.length">
              <b>Het vak kan pas worden opgeslagen als de volgende fouten worden gecorrigeerd</b>
              <ul>
                <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
              </ul>
            </p>

            <md-button class="md-dense md-raised md-primary" v-on:click="checkForm">Sla op</md-button>

          </form>
        </md-app-content>
      </md-app>


      <md-dialog-confirm
        :md-active.sync="showDialog"
        md-title="Gelukt!"
        md-content="Bedankt voor invullen van deze cursus! 💖 De data is opgestuurd naar de database. 👾 Wil je de pagina herladen om een nieuwe module in te vullen? ♻️"
        md-confirm-text="Ja, herlaad"
        md-cancel-text="Nee"
        @md-confirm="onConfirm"
      />
    </div>
  </div>
</template>

<script>
const alphaSort = require('alpha-sort')

const APIUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://study-guide-api.herokuapp.com/'
    : 'http://localhost:8000/'

export default {
  name: 'app',
  components: {},
  data: function() {
    return {
      showDialog: false,
      lang: 0,
      errors: [],
      course: {
        name: null,
        shortDescription: null,
        description: null,
        credits: null,
        methods: [],
        methodsSummary: null,
        coordinators: [],
        teachers: [],
        competencies: [],
        indicators: null,
        objectivesSummary: null,
        program: null,
        faculty: null
      },
      options: {
        faculties: null,
        program: null,
        staff: null,
        indicators: null,
        competencies: null,
        methods: ['practicum', 'hoorcollege', 'werkgroep', 'coaching']
      }
    }
  },
  created: function() {
    fetch(APIUrl + 'faculty/')
      .then(response => response.json())
      .then(json => {
        this.options.faculties = json
        this.course.faculty = json[0]._id //Auto select the first faculty in the array
      })
    fetch(APIUrl + 'program/')
      .then(response => response.json())
      .then(json => {
        this.options.program = json
        this.course.program = json[0]._id //Auto select the first program in the array
      })
    fetch(APIUrl + 'person/')
      .then(response => response.json())
      .then(json => {
        this.options.staff = json.sort((a, b) => alphaSort.asc(a.name, b.name))
      })
    fetch(APIUrl + 'indicator/')
      .then(response => response.json())
      .then(json => {
        this.options.indicators = json
      })
    fetch(APIUrl + 'competency/')
      .then(response => response.json())
      .then(json => {
        this.options.competencies = json
      })
  },
  methods: {
    checkForm: function() {
      //Check if the input is valid. If it is, post the course to the API
      this.errors = []
      if (!this.course.name) {
        this.errors.push('De naam voor het vak ontbreekt')
      }
      if (this.course.competencies.length === 0) {
        this.errors.push('Er zijn nog geen competenties gekozen')
      }
      if (!this.course.shortDescription) {
        this.errors.push('De korte beschrijving van het vak ontbreekt')
      }
      if (!this.course.description) {
        this.errors.push('De lange beschrijving van het vak ontbreekt')
      }
      if (!this.course.credits) {
        this.errors.push('De studiepunten van het vak ontbreken')
      }
      if (!this.course.coordinators.length === 0) {
        this.errors.push('Er is nog geen coördinator ingevuld')
      }
      if (!this.course.objectivesSummary) {
        this.errors.push('De leerdoelen van het vak ontbreken')
      }
      if (!this.course.program) {
        this.errors.push('Er is nog geen studie programma gekozen')
      }
      if (!this.course.faculty) {
        this.errors.push('De faculteit waar dit vak bij hoort ontbreekt')
      }
      this.errors = [...new Set(this.errors)]

      if (!this.errors.length) {
        this.postCourse()
      }
    },
    onConfirm: function() {
      window.location.reload()
    },
    postCourse: function() {
      let raw = this.$data.course

      fetch(APIUrl + 'course/', {
        method: 'post',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        body: JSON.stringify({
          name: [{language: 'nl', value: raw.name}],
          shortDescription: [{language: 'nl', value: raw.shortDescription}],
          description: [{language: 'nl', value: raw.description}],
          // year: null,
          credits: parseInt(raw.credits, 10),
          // start: null,
          // end: null,
          // languages: null,
          coordinators: raw.coordinators,
          // coordinatorsSummary: null,
          teachers: raw.teachers,
          // teachersSummary: null,
          objectivesSummary: [{language: 'nl', content: raw.objectivesSummary}],
          methods: raw.methods.map(method => {
            return {hoorcollege: 'lecture', werkgroep: 'lab'}[method] || method
          }),
          methodsSummary: [{language: 'nl', content: raw.methodsSummary}],
          // indicators: null,
          competencies: raw.competencies,
          // competenciesSummary: null,
          program: raw.program,
          faculty: raw.faculty
        })
      }).then(() => {
        this.showDialog = true
      })
    }
  }
}
</script>

<style scoped>
#app {
  font-family: system-ui, serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.md-app-content,
.md-title {
  width: 48rem;
  margin-left: auto !important;
  margin-right: auto !important;
}

.help {
  font-size: small;
}

.md-field + .help {
  margin-top: -1rem;
  margin-bottom: 2rem;
  margin-right: 5rem;
}

.md-app.md-overlap .md-app-content {
  margin-bottom: 64px;
}
</style>

<style>
.md-menu-content {
  max-width: 50rem !important;
  margin-left: -1rem;
}
</style>
