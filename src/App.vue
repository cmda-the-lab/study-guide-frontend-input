<template>
<div id="app">
<div class="page-container">
  <md-app md-waterfall md-mode="overlap">
    <md-app-toolbar class="md-primary md-large">
      <div class="md-toolbar-row">
        <h1 class="md-title">CMD Monitor</h1>
      </div>
    </md-app-toolbar>

    <md-app-content>
      <md-steppers :md-active-step.sync="step" md-vertical md-linear>
        <md-step
          id="intro"
          md-label="Introductie"
          md-description="Informatie over de module"
          :md-error="$v.intro.$dirty && $v.intro.$invalid ? 'Informatie mist' : ''"
          :md-done="!$v.intro.$invalid"
        >
          <p>
            In dit onderdeel van de monitor vragen we je om globale informatie over een module in te vullen.
            Deze informatie kunnen we later gebruiken om het curriculum van volgend jaar te visualiseren, maar ook voor in de studiegids.
          </p>
          <form novalidate v-on:submit="next($event, 'intro', 'matter')">
            <md-field :class="{'md-invalid': $v.intro.name.$dirty && $v.intro.name.$invalid}">
              <label>Naam</label>
              <md-input v-model.trim="$v.intro.name.$model" required></md-input>
              <span class="md-error">Dit veld is verplicht</span>
            </md-field>
            <p class="help">Wat is de naam van de module? Bijvoorbeeld, “Design Ethics”</p>

            <md-field :class="{'md-invalid': $v.intro.shortDescription.$dirty && $v.intro.shortDescription.$invalid}">
              <label>Korte beschrijving</label>
              <md-textarea
                v-model.trim="$v.intro.shortDescription.$model"
                md-autogrow
                required
                :maxlength="$v.intro.shortDescription.$params.maxLength.max"
              ></md-textarea>
              <span class="md-error" v-if="!$v.intro.shortDescription.required">Dit veld is verplicht</span>
              <span class="md-error" v-if="!$v.intro.shortDescription.maxLength">Dit veld is te lang (max. {{$v.intro.shortDescription.$params.maxLength.max}} karakters)</span>
            </md-field>
            <p class="help">Beschrijf de module in één zin. Bijvoorbeeld, “Design ethics is a course that allows you to integrate ethical thinking into your design practice.”</p>

            <md-field :class="{'md-invalid': $v.intro.description.$dirty && $v.intro.description.$invalid}">
              <label>Lange beschrijving</label>
              <md-textarea
                v-model.trim="$v.intro.description.$model"
                md-autogrow
                required
                :maxlength="$v.intro.description.$params.maxLength.max"
              ></md-textarea>
              <span class="md-error" v-if="!$v.intro.description.required">Dit veld is verplicht</span>
              <span class="md-error" v-if="!$v.intro.description.maxLength">Dit veld is te lang (max. {{$v.intro.description.$params.maxLength.max}} karakters)</span>
            </md-field>
            <p class="help">Beschrijf de module in twee tot vier alineas</p>

            <div class="lab-fake-field">
              <h2 class="lab-fake-label">Type *</h2>
              <p class="help">Is deze module een project of een vak?</p>
              <md-radio
                v-model="$v.intro.type.$model"
                v-for="(option, index) in options.type"
                :key="index"
                :value="option"
              >{{ option }}</md-radio>
              <p class="lab-fake-error" v-if="$v.intro.type.$dirty && !$v.intro.type.required">Dit veld is verplicht</p>
            </div>

            <div class="lab-fake-field">
              <h2 class="lab-fake-label">Fase *</h2>
              <p class="help">In welke fase valt deze module?</p>
              <md-radio
                v-model="$v.intro.phase.$model"
                v-for="(option, index) in options.phase"
                :key="index"
                :value="option"
              >{{ option }}</md-radio>
              <p class="lab-fake-error" v-if="$v.intro.phase.$dirty && !$v.intro.phase.required">Dit veld is verplicht</p>
            </div>

            <div class="lab-fake-field">
              <h2 class="lab-fake-label">Leerjaar *</h2>
              <p class="help">In welk leerjaar wordt deze module gegeven?</p>
              <md-radio
                v-model="$v.intro.learningYear.$model"
                v-for="(option, index) in options.learningYear"
                :key="index"
                :value="option"
              >{{ "Jaar " + option }}</md-radio>
              <p class="lab-fake-error" v-if="$v.intro.learningYear.$dirty && !$v.intro.learningYear.required">Dit veld is verplicht</p>
            </div>

            <div class="lab-fake-field">
              <h2 class="lab-fake-label">Kwartaal *</h2>
              <p class="help">In welk kwartaal wordt deze module gegeven? Als de module in meerdere kwartalen gegeven wordt, of een semester overbrugt, vul dan meerdere kwartalen in.</p>
              <md-checkbox
                v-model="$v.intro.quarter.$model"
                v-for="(option, index) in options.quarter"
                :key="index"
                :value="option"
              >{{ "Kwartaal "+ option }}</md-checkbox>
              <p class="lab-fake-error" v-if="$v.intro.quarter.$dirty && !$v.intro.quarter.required">Dit veld is verplicht</p>
            </div>
            
            <div class="lab-fake-field" v-if="intro.phase == 'verdieping'">
              <h2 class="lab-fake-label">Project *</h2>
              <p class="help">Bij welk project hoort deze module?</p>
              <md-checkbox class="vertical"
                v-model="$v.intro.cluster.$model"
                v-for="(option, index) in options.cluster.filter(opt => opt.phase == 'verdieping')"
                :key="index"
                :value="option._id"
              >{{ option.name[lang].value}}</md-checkbox>
              <p class="lab-fake-error" v-if="$v.intro.cluster.$dirty && !$v.intro.cluster.required">Dit veld is verplicht</p>
            </div>

            <div class="lab-fake-field" v-if="intro.phase == 'minor'">
              <h2 class="lab-fake-label">Minor *</h2>
              <p class="help">Bij welke minor hoort deze module?</p>
              <md-checkbox class="vertical"
                v-model="$v.intro.cluster.$model"
                v-for="(option, index) in options.cluster.filter(opt => opt.phase == 'minor')"
                :key="index"
                :value="option._id"
              >{{ option.name[lang].value}}</md-checkbox>
              <p class="lab-fake-error" v-if="$v.intro.cluster.$dirty && !$v.intro.cluster.required">Dit veld is verplicht</p>
            </div>

            <md-field :class="{'md-invalid': $v.intro.credits.$dirty && $v.intro.credits.$invalid}">
              <label>Studiepunten (ECTS)</label>
              <md-input
                v-model="$v.intro.credits.$model"
                type="number"
                :min="$v.intro.credits.$params.minValue.min"
                :max="$v.intro.credits.$params.maxValue.max"
                required
              ></md-input>
              <span class="md-error" v-if="!$v.intro.credits.required">Dit veld is verplicht</span>
            </md-field>
            <p class="help">
              Wat is het aantal studiepuntent van de module?
              <span v-if="intro.type == 'Vak'">Een vak is doorgaans <strong>3 punten</strong>.</span>
              <span v-if="intro.type == 'Project'">Een project is doorgaans <strong>5 punten</strong>.</span>
            </p>

            <md-button type="submit" class="md-dense md-raised md-primary">Verder</md-button>
          </form>
        </md-step>

        <md-step
          id="matter"
          md-label="Materie"
          md-description="Wat studenten leren, en hoe"
          :md-error="$v.matter.$dirty && $v.matter.$invalid ? 'Informatie mist' : ''"
          :md-done="!$v.matter.$invalid"
        >
          <p>
            In dit onderdeel van de monitor vragen we je na te denken over wat de student leert, en hoe er gewerkt wordt.
          </p>

          <form novalidate v-on:submit="next($event, 'matter', 'people')">
            <md-field :class="{'md-invalid': $v.matter.objectivesSummary.$dirty && $v.matter.objectivesSummary.$invalid}">
              <label>Leerdoelen</label>
              <md-textarea
                v-model.trim="$v.matter.objectivesSummary.$model"
                md-autogrow
                required
                :maxlength="$v.matter.objectivesSummary.$params.maxLength.max"
              ></md-textarea>
              <span class="md-error" v-if="!$v.matter.objectivesSummary.required">Dit veld is verplicht</span>
              <span class="md-error" v-if="!$v.matter.objectivesSummary.maxLength">Dit veld is te lang (max. {{$v.matter.objectivesSummary.$params.maxLength.max}} karakters)</span>
            </md-field>
            <p class="help">Beschrijf wat de student leert.<br>Gebruik streepjes en enters. Bijvoorbeeld, “- You learn to be aware of the ethical issues involved in design and designing”</p>

            <div class="lab-fake-field">
              <h2 class="lab-fake-label">Competenties *</h2>
              <p class="lab-fake-error" v-if="$v.matter.competencies.$dirty && !$v.matter.competencies.required">Dit veld is verplicht</p>
              <p class="help">Kies de CMD competenties die van toepassing zijn op deze module</p>
              <div v-for="option in options.competency" :key="option._id">
                <md-checkbox
                  class="lab-check-vertical"
                  :key="option._id" 
                  :value="option._id"
                  v-model="$v.matter.competencies.$model"
                >{{ option.value}}</md-checkbox>
                <p class="lab-check-description">{{option.description[lang].value}}</p>
              </div>
            </div>

           
            <div v-if="intro.type == 'Vak'" class="lab-fake-field">
              <h2 class="lab-fake-label">Cirkels *</h2>
              <img class="lab-circles" src="./assets/circles.png">
              <p class="help">In welk van deze gebieden valt het vak?</p>
              <md-radio
                class="lab-check-vertical"
                v-model="$v.matter.circles.$model"
                v-for="(option, index) in options.circles"
                :key="index"
                :value="option"
              ><strong>{{ index + 1 }}</strong>: {{ option }}</md-radio>
              <p class="lab-fake-error" v-if="$v.matter.circles.$dirty && !$v.matter.circles.required">Dit veld is verplicht</p>
            </div>

            
            <div v-if="intro.type == 'Project'">
              <p class="help">In welk gebied valt deze module.?</p>
              <img  src="./assets/spaces.png">
              <md-field :class="{'md-invalid': $v.matter.spaces.$dirty && $v.matter.spaces.$invalid}">
                <label>Spaces</label>
                <md-select v-model="$v.matter.spaces.$model">
                  <md-option
                    v-for="(option, index) in options.spaces"
                    :value="option"
                    :key="option"
                  >{{ index +": "}}{{ option }}</md-option>
                </md-select>
                <span class="md-error" v-if="!$v.matter.spaces.required">Dit veld is verplicht</span>
              </md-field>
            </div>

            <div class="lab-fake-field">
              <h2 class="lab-fake-label">Werkvormen *</h2>
              <p class="help">Kies één of meer werkvormen die van toepassing zijn op deze module</p>
              <md-checkbox
                v-model="$v.matter.methods.$model"
                v-for="(option, index) in options.method"
                :key="index"
                :value="option"
              >{{ option }}</md-checkbox>
              <p class="lab-fake-error" v-if="$v.matter.methods.$dirty && !$v.matter.methods.required">Dit veld is verplicht</p>
            </div>

            <md-field :class="{'md-invalid': $v.matter.methodsSummary.$dirty && $v.matter.methodsSummary.$invalid}">
              <label>Beschrijving van werkvormen</label>
              <md-textarea
                v-model.trim="$v.matter.methodsSummary.$model"
                md-autogrow
                required
                :maxlength="$v.matter.methodsSummary.$params.maxLength.max"
              ></md-textarea>
              <span class="md-error" v-if="!$v.matter.methodsSummary.required">Dit veld is verplicht</span>
              <span class="md-error" v-if="!$v.matter.methodsSummary.maxLength">Dit veld is te lang (max. {{$v.matter.methodsSummary.$params.maxLength.max}} karakters)</span>
            </md-field>
            <p class="help">Twee tot vier alineas</p>
            
            <md-field :class="{'md-invalid': $v.matter.productsLearned.$dirty && $v.matter.productsLearned.$invalid}">
              <label>Producten aangeleerd</label>
              <md-select v-model="$v.matter.productsLearned.$model" multiple>
                <md-option
                  v-for="option in options.products"
                  :value="option"
                  :key="option"
                >{{ option }}</md-option>
              </md-select>
              <span class="md-error" v-if="!$v.matter.productsLearned.required">Dit veld is verplicht</span>
            </md-field>
            <p class="help">Kies welke beroepsproducten er worden aangeleerd bij deze module.</p>

            <md-field :class="{'md-invalid': $v.matter.productsAsked.$dirty && $v.matter.productsAsked.$invalid}">
              <label>Producten getoetst</label>
              <md-select v-model="$v.matter.productsAsked.$model" multiple>
                <md-option
                  v-for="option in options.products"
                  :value="option"
                  :key="option"
                >{{ option }}</md-option>
              </md-select>
              <span class="md-error" v-if="!$v.matter.productsAsked.required">Dit veld is verplicht</span>
            </md-field>
            <p class="help">Kies op welke beroepsproducten er getoetst wordt bij deze module.</p>

            <md-field :class="{'md-invalid': $v.matter.researchMethodsLearned.$dirty && $v.matter.researchMethodsLearned.$invalid}">
              <label>Onderzoeksmethoden aangeleerd</label>
              <md-select v-model="$v.matter.researchMethodsLearned.$model" multiple>
                <md-option
                  v-for="option in options.researchMethods"
                  :value="option"
                  :key="option"
                >{{ option }}</md-option>
              </md-select>
              <span class="md-error" v-if="!$v.matter.researchMethodsLearned.required">Dit veld is verplicht</span>
            </md-field>
            <p class="help">Kies welke onderzoeksmethoden er worden aangeleerd in deze module. Kijk op <a href="http://www.cmdmethods.nl/">cmdmethods.nl</a> om te zien wat elke methode inhoudt</p>

            <md-field :class="{'md-invalid': $v.matter.researchMethodsAsked.$dirty && $v.matter.researchMethodsAsked.$invalid}">
              <label>Onderzoeksmethoden getoetst</label>
              <md-select v-model="$v.matter.researchMethodsAsked.$model" multiple>
                <md-option
                  v-for="option in options.researchMethods"
                  :value="option"
                  :key="option"
                >{{ option }}</md-option>
              </md-select>
              <span class="md-error" v-if="!$v.matter.researchMethodsAsked.required">Dit veld is verplicht</span>
            </md-field>
            <p class="help">Kies op welke onderzoeksmethoden er getoetst wordt bij deze module. Kijk op <a href="http://www.cmdmethods.nl/">cmdmethods.nl</a> om te zien wat elke methode inhoudt</p>

            <div class="lab-fake-field">
              <h2 class="lab-fake-label">Toetsvorm *</h2>
              <p class="help">Welke toesvormen worden er gebruikt in deze module?</p>
              <md-checkbox
                v-model="$v.matter.assessments.$model"
                v-for="(option, index) in options.assessments"
                :key="index"
                :value="option"
              >{{ option }}</md-checkbox>
            </div>

            <md-field :class="{'md-invalid': $v.matter.studyMaterialsRequired.$dirty && $v.matter.studyMaterialsRequired.$invalid}">
              <label>Studiemateriaal verplicht</label>
              <md-textarea
                v-model.trim="$v.matter.studyMaterialsRequired.$model"
                md-autogrow
                required
                :maxlength="$v.matter.studyMaterialsRequired.$params.maxLength.max"
              ></md-textarea>
              <span class="md-error" v-if="!$v.matter.studyMaterialsRequired.maxLength">Dit veld is te lang (max. {{$v.matter.studyMaterialsRequired.$params.maxLength.max}} karakters)</span>
            </md-field>
            <p class="help">Som de verplichte studie materialen op die studenten zelf moeten regelen/kopen om de module te volgen.<br>Gebruik streepjes en enters. Bijvoorbeeld, '- "Creating Significant Learning Experiences - Fink, L. Dee(2003) "'</p>

            <md-field :class="{'md-invalid': $v.matter.studyMaterialsUsed.$dirty && $v.matter.studyMaterialsUsed.$invalid}">
              <label>Studiemateriaal gebruikt</label>
              <md-textarea
                v-model.trim="$v.matter.studyMaterialsUsed.$model"
                md-autogrow
                required
                :maxlength="$v.matter.studyMaterialsUsed.$params.maxLength.max"
              ></md-textarea>
              <span class="md-error" v-if="!$v.matter.studyMaterialsUsed.maxLength">Dit veld is te lang (max. {{$v.matter.studyMaterialsUsed.$params.maxLength.max}} karakters)</span>
            </md-field>
            <p class="help">Som de specifieke studie materialen op die binnen deze module gebruikt worden. Denk aan artikelen, video's, tutorial's etc.<br>Gebruik streepjes en enters. Bijvoorbeeld, '- "Introduction to asynchronous iteration" Mike Bostock (2018)'</p>

            <md-button type="submit" class="md-dense md-raised md-primary">Verder</md-button>
          </form>
        </md-step>

        <md-step
          id="people"
          md-label="Mensen"
          md-description="De betrokken docenten en coordinatoren van deze module"
          :md-error="$v.people.$dirty && $v.people.$invalid ? 'Informatie mist' : ''"
          :md-done="!$v.people.$invalid"
        >
          <p>
            In dit onderdeel vragen we je om aan te geven wie de module coördineren en doceren.
          </p>

          <form novalidate v-on:submit="next($event, 'people')">
            <md-field :class="{'md-invalid': $v.people.coordinators.$dirty && $v.people.coordinators.$invalid}">
              <label>Coördinatoren</label>
              <md-select v-model="$v.people.coordinators.$model" multiple>
                <md-option
                  v-for="option in options.person"
                  :value="option._id"
                  :key="option._id"
                >{{ option.name }}</md-option>
              </md-select>
              <span class="md-error" v-if="!$v.people.coordinators.required">Dit veld is verplicht</span>
            </md-field>
            <p class="help">Kies welke mensen deze module coördineren.</p>

            <md-field :class="{'md-invalid': $v.people.teachers.$dirty && $v.people.teachers.$invalid}">
              <label>Docenten</label>
              <md-select v-model="$v.people.teachers.$model" multiple>
                <md-option
                  v-for="option in options.person"
                  :value="option._id"
                  :key="option._id"
                >{{ option.name }}</md-option>
              </md-select>
            </md-field>
            <p class="help">Kies welke mensen deze module geven.</p>

            <md-button type="submit" class="md-dense md-raised md-primary">Verder</md-button>
          </form>
        </md-step>
      </md-steppers>
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

import {identity} from 'lodash'
import {required, maxLength, minValue, maxValue} from 'vuelidate/lib/validators'

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
      step: null,
      lang: 0,
      intro: {
        name: '',
        shortDescription: '',
        description: '',
        type: '',
        phase: '',
        quarter: [],
        learningYear: '',
        cluster: [],
        credits: null,
      },
      matter: {
        objectivesSummary: '',
        competencies: [],
        circles: '',
        spaces: '',
        methods: [],
        methodsSummary: '',
        productsLearned: [],
        productsAsked: [],
        researchMethodsLearned: [],
        researchMethodsAsked: [],
        assessments: [],
        studyMaterialsRequired: '',
        studyMaterialsUsed: '',
      },
      people: {
        coordinators: [],
        teachers: [],
      },
      options: {
        person: null,
        competency: null,
        method: ['practicum', 'hoorcollege', 'werkgroep', 'coaching'],
        phase: ['fundament', 'verdieping', 'minor', 'afstuderen'],
        learningYear: [1, 2, 3, 4],
        quarter: [1, 2, 3, 4],
        circles: [
          'Ontwerpvraag/Probleem/Content/Strategie',
          'Interactie',
          'Techniek',
          'Vormgeving',
          'Interactie/Techniek',
          'Interactie/Vormgeving',
          'Techniek/Vormgeving',
          'Interactie/Techniek/Vormgeving'
        ],
        spaces: ['problem space', 'concept space','design&build space', 'market space', 'problem space, concept space', 'concept space, design&build space', 'design&build space, market space', 'problem space, concept space, design&build space', 'concept space, design&build space, market space', 'problem space, concept space, design&build space, market space'],
        type: ['Project', 'Vak'],
        cluster: null,
        products: ["geen beroepsproducten", "analyse" , "business model canvas" , "concept" , "customer journey" , "design system" , "empathy map" , "flows/wireframe" , "installatie" , "interactieve applicatie" , "job story" , "logboek" , "mockup / schermontwerp" , "moodboard" , "ontwerp document / design spec" , "persona" , "prototype" , "requirement list" , "schetsen" , " scenario" , "service blueprint" , "sitemap" , "styleguide" , "storyboard" , "testplan/testrapport" , "video" , "visual design"],
        researchMethods: ["Geen methodes", "Library", "Benchmark creation", "Best, good & bad practices", "Competitive Analysis", "Design Pattern Search", "Expert Interview", "Literature Study", "Trend analysis", "Field", "Bag tour", "Card sorting", "Context mapping", "Cultural probes", "Day in the life", "Diary study", "Fly on the wall", "Focus group", "Interview", "Participant observation", "Survey", "Lab", "A/B Testing", "Biometrics", "Field Trial", "Online analytics", "Thinking aloud", "Usability Testing", "Wizard of Oz", "Showroom", "Co-reflection", "Expo", "Heuristic Evaluation", "Peer Review", "Pitch", "Provocative Prototyping", "(Product) Quality Review", "USP (Unique Selling Points)", "Workshop", "Co-creation", "Ideation", "Morphological chart", "Proof of Concept", "Prototyping", "Scamper", "Sketching", "Storytelling ", "Tinkering", "Stepping Stones", "Business Model Canvas", "Concept", "Comparison Chart", "Customer Journey", "Design Specification", "Empathy Map", "Expert Review Report", "Inspiration Wall", "Mood Board", "Persona", "Prototype", "Requirement List", "Risk Analysis", "Scenario", "Task Analysis", "Test Report"],
        assessments: ["Schriftelijke toets", "Product assessment", "Competentie assessment"],
      }
    }
  },
  validations: function() {
    return {
      intro: {
        name: {required},
        shortDescription: {required, maxLength: maxLength(240)},
        description: {required, maxLength: maxLength(1024)},
        type: {required},
        phase: {required},
        learningYear: {required},
        quarter: {required},
        cluster: this.intro.phase === 'verdieping' ||  this.intro.phase === 'minor'? {required} : {},
        credits: {required, minValue: minValue(1), maxValue: maxValue(30)}
      },
      matter: {
        objectivesSummary: {required, maxLength: maxLength(1024)},
        competencies: {required},
        circles: this.intro.type === 'Vak' ? {required} : {},
        spaces: this.intro.type === 'Project' ? {required} : {},
        methods: {required},
        methodsSummary: {required, maxLength: maxLength(1024)},
        productsLearned: {required},
        productsAsked: {required},
        researchMethodsLearned: {required},
        researchMethodsAsked: {required},
        assessments: {},
        studyMaterialsRequired: {maxLength: maxLength(1024)},
        studyMaterialsUsed: {maxLength: maxLength(1024)},
      },
      people: {
        coordinators: {required},
        teachers: {}
      }
    }
  },
  created: function() {
    const resources = [
      {name: 'faculty'},
      {name: 'program'},
      {
        name: 'person',
        map: x => x.sort((a, b) => alphaSort.asc(a.name, b.name))
      },
      {name: 'competency'},
      {name: 'cluster'}
    ]

    Promise.all(
      resources.map(({name, map = identity}) =>
        fetch([apiUrl, name, ''].join('/'))
          .then(res => res.json())
          .then(map)
          .then(data => {
            this.options[name] = data
            return name
          })
      )
    )
  },
  methods: {
    next: function(ev, curr, next) {
      ev.preventDefault()

      this.$v[curr].$touch()

      if (this.$v[curr].$invalid) {
        return
      }

      if (next) {
        this.step = next
      } else {
        this.submit()
      }
    },
    submit: function() {
      const uri = [apiUrl, 'course', ''].join('/')
      const options = this.options
      const {intro, matter, people} = this.$data

      const body = {
        name: [{language: 'nl', value: intro.name}],
        shortDescription: [{language: 'nl', value: intro.shortDescription}],
        description: [{language: 'nl', value: intro.description}],
        learningYears: [intro.learningYear],
        phase:
          {
            fundament: 'foundation',
            verdieping: 'profiling',
            afstuderen: 'graduation'
          }[intro.phase] || intro.phase,
        type: intro.type,
        periods: intro.quarter,
        cluster: intro.cluster,
        credits: parseInt(intro.credits, 10),
        // start: null,
        // end: null,
        // languages: null,
        coordinators: people.coordinators,
        // coordinatorsSummary: null,
        teachers: people.teachers,
        // teachersSummary: null,
        objectivesSummary: [
          {language: 'nl', content: matter.objectivesSummary}
        ],
        methods: matter.methods.map(method => {
          return {hoorcollege: 'lecture', werkgroep: 'lab'}[method] || method
        }),
        methodsSummary: [{language: 'nl', content: matter.methodsSummary}],
        productsLearned: matter.productsLearned,
        productsAsked: matter.productsAsked,
        researchMethodsLearned: matter.researchMethodsLearned,
        researchMethodsAsked: matter.researchMethodsAsked,
        assessments: matter.assessments,
        studyMaterialsRequired: matter.studyMaterialsRequired,
        studyMaterialsUsed: matter.studyMaterialsUsed,
        competencies: matter.competencies,
        circles: matter.circles,
        spaces: matter.spaces,
        // competenciesSummary: null,
        program: options.program[0]._id,
        faculty: options.faculty[0]._id
      }

      fetch(uri, {
        method: 'post',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        body: JSON.stringify(body)
      }).then(() => (this.showDialog = true), () => alert('Could not send'))
    },
    onConfirm: function() {
      window.location.reload()
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

.md-toolbar.md-theme-default.md-primary {
  background-color: #feca2f;
}

@media (min-width: 48rem) {
  .lab-circles{
    width: 50%;
    float: right;
  }
}

.help {
  font-size: small;
}

.md-field {
  margin-top: 0;
  margin-bottom: 3rem;
}

.md-field + .help {
  margin-top: -2.5rem;
  margin-bottom: 3rem;
  margin-right: 5rem;
  transition: transform 200ms;
  transform: translateY(0rem);
}

.md-field.md-invalid + .help {
  transform: translateY(1rem);
}

.md-app.md-overlap .md-app-content {
  margin-bottom: 64px;
  padding-left: 0;
  padding-right: 0;
}

.lab-check-vertical {
  display: flex;
}

.lab-check-description {
  font-size: small;
  margin-bottom: 0.75rem;
  padding-left: 2.25rem;
  margin-top: -0.75rem;
  color: rgba(0, 0, 0, 0.75);
}

.lab-fake-field .help {
  margin-bottom: 0;
}

.lab-fake-field {
  width: 100%;
  min-height: 48px;
  margin: 4px 0 24px;
  margin-bottom: 3rem;
  padding-top: 16px;
  position: relative;
  font-family: inherit;
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
</style>

<style>
.md-app-content,
.md-toolbar-row {
  max-width: 48rem;
  margin-left: auto !important;
  margin-right: auto !important;
}

@media (max-width: 48rem) {
  .md-app-content {
    border-radius: 0 !important;
  }
}

.md-toolbar-row {
  height: 132px;
  vertical-align: bottom;
}

.md-toolbar-row .md-title {
  align-self: flex-end !important;
  margin: 1rem 0 !important;
  color: black !important;
  font-weight: 500 !important;
}

.md-menu-content {
  max-width: 50rem !important;
  margin-left: -1rem;
}

.md-radio.vertical {
  display: flex;
}

.md-checkbox.vertical {
  display: flex;
}
</style>
