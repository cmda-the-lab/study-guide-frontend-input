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
      <form novalidate v-on:submit="submit">
        <md-field v-if="options.faculty && options.faculty.length > 1">
          <label>Faculteit</label>
          <md-select v-model="course.faculty">
            <md-option
              v-for="option in options.faculty"
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

        <md-field :class="{'md-invalid': $v.course.name.$dirty && $v.course.name.$invalid}">
          <label>Naam</label>
          <md-input v-model.trim="$v.course.name.$model" required></md-input>
          <span class="md-error">Dit veld is verplicht</span>
        </md-field>
        <p class="help">Wat is de naam van de module? Bijvoorbeeld, “Design Ethics”</p>

        <md-field :class="{'md-invalid': $v.course.shortDescription.$dirty && $v.course.shortDescription.$invalid}">
          <label>Korte beschrijving</label>
          <md-textarea
            v-model.trim="$v.course.shortDescription.$model"
            md-autogrow
            required
            :maxlength="$v.course.shortDescription.$params.maxLength.max"
          ></md-textarea>
          <span class="md-error" v-if="!$v.course.shortDescription.required">Dit veld is verplicht</span>
          <span class="md-error" v-if="!$v.course.shortDescription.maxLength">Dit veld is te lang (max. {{$v.course.shortDescription.$params.maxLength.max}} karakters)</span>
        </md-field>
        <p class="help">Beschrijf de module in één zin. Bijvoorbeeld, “Design ethics is a course that allows you to integrate ethical thinking into your design practice.”</p>

        <md-field :class="{'md-invalid': $v.course.description.$dirty && $v.course.description.$invalid}">
          <label>Beschrijving van module</label>
          <md-textarea
            v-model.trim="$v.course.description.$model"
            required
            :maxlength="$v.course.description.$params.maxLength.max"
          ></md-textarea>
          <span class="md-error" v-if="!$v.course.description.required">Dit veld is verplicht</span>
          <span class="md-error" v-if="!$v.course.description.maxLength">Dit veld is te lang (max. {{$v.course.description.$params.maxLength.max}} karakters)</span>
        </md-field>
        <p class="help">Beschrijf de module in twee tot vier alineas</p>
        
        <div>
          <h2 class="lab-fake-label">Type *</h2>
          <md-radio
            v-model="$v.course.type.$model"
            v-for="(option, index) in options.type"
            :key="index"
            :value="option"
          >{{ option }}</md-radio>
          <span class="lab-fake-error" v-if="$v.course.type.$dirty && !$v.course.type.required">Dit veld is verplicht</span>
        </div>
        <p class="help">Is deze module een project of een vak?</p>

        <div>
          <h2 class="lab-fake-label">Fase *</h2>
          <md-radio
            v-model="$v.course.phase.$model"
            v-for="(option, index) in options.phase"
            :key="index"
            :value="option"
          >{{ option }}</md-radio>
          <span class="lab-fake-error" v-if="$v.course.phase.$dirty && !$v.course.phase.required">Dit veld is verplicht</span>
        </div>
        <p class="help">Kies de fase waarin deze module valt</p>

        <div>
          <h2 class="lab-fake-label">Leerjaar *</h2>
          <md-radio
            v-model="$v.course.learningYear.$model"
            v-for="(option, index) in options.learningYear"
            :key="index"
            :value="option"
          >{{ "Jaar " + option }}</md-radio>
          <span class="lab-fake-error" v-if="$v.course.learningYear.$dirty && !$v.course.learningYear.required">Dit veld is verplicht</span>
        </div>
        <p class="help">Kies het leerjaar waarin deze module valt</p>

        <div>
          <h2 class="lab-fake-label">Kwartaal *</h2>
          <md-checkbox
            v-model="$v.course.quarter.$model"
            v-for="(option, index) in options.quarter"
            :key="index"
            :value="option"
          >{{ "Kwartaal "+ option }}</md-checkbox>
          <span class="lab-fake-error" v-if="$v.course.quarter.$dirty && !$v.course.quarter.required">Dit veld is verplicht</span>
        </div>
        <p class="help">Kies het kwartaal waarin deze module valt</p>

        <md-field :class="{'md-invalid': $v.course.objectivesSummary.$dirty && $v.course.objectivesSummary.$invalid}">
          <label>Leerdoelen</label>
          <md-textarea
            v-model.trim="$v.course.objectivesSummary.$model"
            required
            :maxlength="$v.course.objectivesSummary.$params.maxLength.max"
          ></md-textarea>
          <span class="md-error" v-if="!$v.course.objectivesSummary.required">Dit veld is verplicht</span>
          <span class="md-error" v-if="!$v.course.objectivesSummary.maxLength">Dit veld is te lang (max. {{$v.course.objectivesSummary.$params.maxLength.max}} karakters)</span>
        </md-field>
        <p class="help">Beschrijf wat de student leert. Gebruik streepjes en enters. Bijvoorbeeld, “- You learn to be aware of the ethical issues involved in design and designing”</p>

        <div>
          <h2 class="lab-fake-label">Competenties *</h2>
          <div v-for="option in options.competency" :key="option._id">
            <p class="description">{{option.description[lang].value}}</p>
            <md-checkbox
              class="many" 
              :key="option._id" 
              :value="option._id"
              v-model="$v.course.competencies.$model"
            >{{ option.value}}</md-checkbox>
          </div>
          <span class="lab-fake-error" v-if="$v.course.competencies.$dirty && !$v.course.competencies.required">Dit veld is verplicht</span>
        </div>
        <p class="help">Kies de CMD competenties die van toepassing zijn op deze module</p>

        <div v-if="course.type == 'Vak'">
          <img src='./assets/circles.png' />
          <h2 class="lab-fake-label">Cirkels *</h2>
          <md-radio class='radio-vertical'
            v-model="$v.course.circles.$model"
            v-for="(option, index) in options.circles"
            :key="index"
            :value="option"
          >{{ (index+1) +": "+ option }}</md-radio>
          <span class="lab-fake-error" v-if="$v.course.circles.$dirty && !$v.course.circles.required">Dit veld is verplicht</span>
        </div>
        <p class="help">In welk van deze gebieden valt de kern van het vak?</p>

        <md-field :class="{'md-invalid': $v.course.credits.$dirty && $v.course.credits.$invalid}">
          <label>Studiepunten (ECTS)</label>
          <md-input
            v-model="$v.course.credits.$model"
            type="number"
            :min="$v.course.credits.$params.minValue.min"
            :max="$v.course.credits.$params.maxValue.max"
            required
          ></md-input>
          <span class="md-error" v-if="!$v.course.credits.required">Dit veld is verplicht</span>
        </md-field>
        <p class="help">Wat is het aantal studiepuntent van de module? Bijvoorbeeld 3 voor een vak, 5 voor een project.</p>

        <div>
          <h2 class="lab-fake-label">Werkvormen *</h2>
          <md-checkbox
            v-model="$v.course.methods.$model"
            v-for="(option, index) in options.method"
            :key="index"
            :value="option"
          >{{ option }}</md-checkbox>
          <span class="lab-fake-error" v-if="$v.course.methods.$dirty && !$v.course.methods.required">Dit veld is verplicht</span>
        </div>
        <p class="help">Kies de een of meer werkvormen die van toepassing zijn op deze module</p>

        <md-field :class="{'md-invalid': $v.course.methodsSummary.$dirty && $v.course.methodsSummary.$invalid}">
          <label>Beschrijving van werkvormen</label>
          <md-textarea
            v-model.trim="$v.course.methodsSummary.$model"
            required
            :maxlength="$v.course.methodsSummary.$params.maxLength.max"
          ></md-textarea>
          <span class="md-error" v-if="!$v.course.methodsSummary.required">Dit veld is verplicht</span>
          <span class="md-error" v-if="!$v.course.methodsSummary.maxLength">Dit veld is te lang (max. {{$v.course.methodsSummary.$params.maxLength.max}} karakters)</span>
        </md-field>
        <p class="help">Twee tot vier alineas</p>

        <md-field v-if="options.person" :class="{'md-invalid': $v.course.coordinators.$dirty && $v.course.coordinators.$invalid}">
          <label>Coördinatoren</label>
          <md-select v-model="$v.course.coordinators.$model" multiple>
            <md-option
              v-for="option in options.person"
              :value="option._id"
              :key="option._id"
            >{{ option.name }}</md-option>
          </md-select>
          <span class="md-error" v-if="!$v.course.coordinators.required">Dit veld is verplicht</span>
        </md-field>
        <p class="help">Kies welke mensen deze module coördineren.</p>

        <md-field v-if="options.person" :class="{'md-invalid': $v.course.teachers.$dirty && $v.course.teachers.$invalid}">
          <label>Docenten</label>
          <md-select v-model="$v.course.teachers.$model" multiple>
            <md-option
              v-for="option in options.person"
              :value="option._id"
              :key="option._id"
            >{{ option.name }}</md-option>
          </md-select>
        </md-field>
        <p class="help">Kies welke mensen deze module geven.</p>

        <p v-if="$v.$dirty && $v.$invalid" class="lab-fake-error">
          Het vak kan pas worden opgeslagen als de fouten per veld worden gecorrigeerd.
        </p>
        <md-button type="submit" class="md-dense md-raised md-primary">Sla op</md-button>
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

import {identity, noop} from 'lodash'
import {
  required,
  maxLength,
  minValue,
  maxValue
} from 'vuelidate/lib/validators'

const apiUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://study-guide-api.herokuapp.com'
    : 'http://localhost:8000'

export default {
  name: 'app',
  components: {},
  data: function() {
    return {
      showDialog: false,
      lang: 0,
      course: {
        name: '',
        shortDescription: '',
        description: '',
        phase: '',
        type: '',
        quarter: [],
        learningYear: '',
        credits: null,
        methods: [],
        methodsSummary: '',
        coordinators: [],
        teachers: [],
        competencies: [],
        circles: '',
        objectivesSummary: '',
        program: null,
        faculty: null
      },
      options: {
        faculty: null,
        program: null,
        person: null,
        competency: null,
        method: ['practicum', 'hoorcollege', 'werkgroep', 'coaching'],
        phase: ['fundament', 'verdieping', 'minor', 'afstuderen'],
        learningYear: [1,2,3,4],
        quarter: [1,2,3,4],
        circles: ['Ontwerpvraag/Probleem/Content/Strategie', 'Interactie', 'Techniek', 'Vormgeving','Interactie/Techniek', 'Interactie/Vormgeving','Techniek/Vormgeving','Interactie/Techniek/Vormgeving'],
        type: ["Project", "Vak"],
      }
    }
  },
  validations: {
    course: {
      name: {required},
      shortDescription: {required, maxLength: maxLength(240)},
      description: {required, maxLength: maxLength(1024)},
      objectivesSummary: {required, maxLength: maxLength(1024)},
      competencies: {required},
      circles: {},
      type: {required},
      credits: {required, minValue: minValue(1), maxValue: maxValue(30)},
      methods: {required},
      phase: {required},
      learningYear: {required},
      quarter: {required},
      methodsSummary: {required, maxLength: maxLength(1024)},
      coordinators: {required},
      teachers: {}
    }
  },
  created: function() {
    const resources = [
      {name: 'faculty', sideEffect: x => (this.course.faculty = x[0]._id)},
      {name: 'program', sideEffect: x => (this.course.program = x[0]._id)},
      {
        name: 'person',
        map: x => x.sort((a, b) => alphaSort.asc(a.name, b.name))
      },
      {name: 'competency'}
    ]

    Promise.all(
      resources.map(({name, map = identity, sideEffect = noop}) =>
        fetch([apiUrl, name, ''].join('/'))
          .then(res => res.json())
          .then(map)
          .then(data => {
            sideEffect(data)
            this.options[name] = data
            return name
          })
      )
    )
  },
  methods: {
    onConfirm: function() {
      window.location.reload()
    },
    submit: function(ev) {
      const uri = [apiUrl, "course", ''].join('/')
      const {course} = this.$data

      ev.preventDefault()

      // Mark every input as dirty.
      this.$v.$touch()

      if (this.$v.$invalid) {
        return
      }
      const body = {
        name: [{language: 'nl', value: course.name}],
        shortDescription: [{language: 'nl', value: course.shortDescription}],
        description: [{language: 'nl', value: course.description}],
        learningYears: [course.learningYear],
        phase: {fundament: 'foundation', verdieping: 'profiling', afstuderen: 'graduation'}[course.phase] || course.phase,
        type: course.type,
        periods: course.quarter,
        credits: parseInt(course.credits, 10),
        // start: null,
        // end: null,
        // languages: null,
        coordinators: course.coordinators,
        // coordinatorsSummary: null,
        teachers: course.teachers,
        // teachersSummary: null,
        objectivesSummary: [
          {language: 'nl', content: course.objectivesSummary}
        ],
        methods: course.methods.map(method => {
          return {hoorcollege: 'lecture', werkgroep: 'lab'}[method] || method
        }),
        methodsSummary: [{language: 'nl', content: course.methodsSummary}],
        // indicators: null,
        competencies: course.competencies,
        circles: course.circles,
        // competenciesSummary: null,
        program: course.program,
        faculty: course.faculty
      }

      fetch(uri, {
        method: 'post',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        body: JSON.stringify(body)
      }).then(() => (this.showDialog = true), () => alert('Could not send'))
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

img {
  width: 50%;
  float: right;
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
  transition: transform 200ms;
  transform: translateY(0rem);
}

.md-field.md-invalid + .help {
  transform: translateY(1rem);
}

.md-app.md-overlap .md-app-content {
  margin-bottom: 64px;
}

.md-checkbox.many {
  display: flex;
}

.radio-vertical {
    display: flex;
}
.lab-fake-label {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.54);
  font-weight: normal;
}

.lab-fake-error {
  color: #ff1744;
  font-size: 12px;
}

.description {
  font-style: italic;
}
</style>

<style>
.md-menu-content {
  max-width: 50rem !important;
  margin-left: -1rem;
}
</style>