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
              md-description="Introductie van de monitor"
            >
              <p>
                In deze monitor vragen vragen we je om informatie over een
                module in te vullen. Deze informatie kunnen we later gebruiken
                om het curriculum van volgend jaar te visualiseren, maar ook
                voor in de studiegids.
              </p>
              <p>
                Deze monitor is bedoelt voor coördinatoren om modules, zoals een
                vak, in te vullen. Deze monitor is <strong>niet</strong> bedoelt
                voor modules waar studenten zelfstandig bepalen wat ze leren
                (zoals SLC of een stage) of modules bestaand uit weer andere
                modules (zoals een minor of een keuze semester).
              </p>
              <md-button
                v-on:click="next($event, 'intro', 'info')"
                class="md-dense md-raised md-primary"
              >
                Begin
              </md-button>
            </md-step>

            <md-step
              id="info"
              md-label="Informatie"
              md-description="Informatie over de module"
              :md-error="
                $v.info.$dirty && $v.info.$invalid ? 'Informatie mist' : ''
              "
              :md-done="!$v.info.$invalid"
            >
              <p>
                In dit onderdeel van de monitor vragen we je globale informatie
                over de module in te vullen. <br />
                <em>
                  Vul geen groepen van vakken in, zoals bijvoorbeeld een minor
                  of een keuzesemester.
                </em>
              </p>
              <form novalidate v-on:submit="next($event, 'info', 'matter')">
                <md-field
                  :class="{
                    'md-invalid': $v.info.name.$dirty && $v.info.name.$invalid
                  }"
                >
                  <label>Naam</label>
                  <md-input v-model.trim="$v.info.name.$model" required />
                  <span class="md-error">Dit veld is verplicht</span>
                </md-field>
                <p class="help">
                  Wat is de naam van de module? Bijvoorbeeld,
                  <samp>Design Ethics</samp>.
                </p>

                <md-field
                  :class="{
                    'md-invalid':
                      $v.info.shortDescription.$dirty &&
                      $v.info.shortDescription.$invalid
                  }"
                >
                  <label>Korte beschrijving</label>
                  <md-textarea
                    v-model.trim="$v.info.shortDescription.$model"
                    md-autogrow
                    required
                    :maxlength="$v.info.shortDescription.$params.maxLength.max"
                  />
                  <span
                    v-if="!$v.info.shortDescription.required"
                    class="md-error"
                  >
                    Dit veld is verplicht
                  </span>
                  <span
                    v-if="!$v.info.shortDescription.maxLength"
                    class="md-error"
                  >
                    Dit veld is te lang (max.
                    {{
                      $v.info.shortDescription.$params.maxLength.max
                    }}
                    karakters)
                  </span>
                </md-field>
                <p class="help">
                  Beschrijf de module in één zin. Bijvoorbeeld,
                  <samp
                    >Design ethics is a course that allows you to integrate
                    ethical thinking into your design practice.
                  </samp>
                </p>

                <md-field
                  :class="{
                    'md-invalid':
                      $v.info.description.$dirty && $v.info.description.$invalid
                  }"
                >
                  <label>Lange beschrijving</label>
                  <md-textarea
                    v-model.trim="$v.info.description.$model"
                    md-autogrow
                    required
                    :maxlength="$v.info.description.$params.maxLength.max"
                  />
                  <span v-if="!$v.info.description.required" class="md-error">
                    Dit veld is verplicht
                  </span>
                  <span v-if="!$v.info.description.maxLength" class="md-error">
                    Dit veld is te lang (max.
                    {{ $v.info.description.$params.maxLength.max }} karakters)
                  </span>
                </md-field>
                <p class="help">Beschrijf de module in twee tot vier alineas</p>

                <div class="lab-fake-field">
                  <h2 class="lab-fake-label lab-fake-label-required">Type</h2>
                  <p class="help">Wat is het type van de module?</p>
                  <md-radio
                    v-model="$v.info.type.$model"
                    v-for="option in options.type"
                    :key="option._id"
                    :value="option._id"
                  >
                    {{ option.values[lang].value }}
                  </md-radio>
                  <p
                    v-if="$v.info.type.$dirty && !$v.info.type.required"
                    class="lab-fake-error"
                  >
                    Dit veld is verplicht
                  </p>
                </div>

                <md-field
                  :class="{
                    'md-invalid':
                      $v.info.credits.$dirty && $v.info.credits.$invalid
                  }"
                >
                  <label>Studiepunten (ECTS)</label>
                  <md-input
                    v-model="$v.info.credits.$model"
                    :min="$v.info.credits.$params.minValue.min"
                    :max="$v.info.credits.$params.maxValue.max"
                    type="number"
                    required
                  />
                  <span v-if="!$v.info.credits.required" class="md-error">
                    Dit veld is verplicht
                  </span>
                  <span v-if="!$v.info.credits.minValue" class="md-error">
                    Dit veld is te laag (min.
                    {{ $v.info.credits.$params.minValue.min }})
                  </span>
                  <span v-if="!$v.info.credits.maxValue" class="md-error">
                    Dit veld is te hoog (max.
                    {{ $v.info.credits.$params.maxValue.max }})
                  </span>
                </md-field>
                <p class="help">
                  Hoeveel studiepunten staan voor {{ unit }}?
                  <span v-if="info.type == 'course'">
                    Een vak is doorgaans
                    <strong v-on:click="info.credits = 3">3 punten</strong>.
                  </span>
                  <span v-if="info.type == 'project'">
                    Een project is doorgaans
                    <strong v-on:click="info.credits = 5">5 punten</strong>.
                  </span>
                </p>

                <div class="lab-fake-field">
                  <h2 class="lab-fake-label lab-fake-label-required">Fase</h2>
                  <p class="help">In welk fase wordt {{ unit }} aangeboden?</p>
                  <md-radio
                    v-model="$v.info.phase.$model"
                    v-for="option in options.phase"
                    :key="option._id"
                    :value="option._id"
                  >
                    {{ option.values[lang].value }}
                  </md-radio>
                  <p
                    v-if="$v.info.phase.$dirty && !$v.info.phase.required"
                    class="lab-fake-error"
                  >
                    Dit veld is verplicht
                  </p>
                </div>

                <div class="lab-fake-field">
                  <h2 class="lab-fake-label lab-fake-label-required">
                    Leerjaar
                  </h2>
                  <p class="help">
                    In welk leerjaar wordt {{ unit }} aangeboden?
                  </p>
                  <md-radio
                    v-model="$v.info.learningYear.$model"
                    v-for="option in options.learningYear"
                    :key="option._id"
                    :value="option._id"
                  >
                    {{ option.values[lang].value }}
                  </md-radio>
                  <p
                    v-if="
                      $v.info.learningYear.$dirty &&
                        !$v.info.learningYear.required
                    "
                    class="lab-fake-error"
                  >
                    Dit veld is verplicht
                  </p>
                </div>

                <div class="lab-fake-field">
                  <h2 class="lab-fake-label lab-fake-label-required">
                    Kwartaal
                  </h2>
                  <p class="help">
                    In welk kwartaal wordt {{ unit }} aangeboden? Als
                    {{ unit }} in meerdere kwartalen wordt aangeboden, of een
                    semester overbrugt, maak dan meerdere keuzes.
                  </p>
                  <md-checkbox
                    v-model="$v.info.quarter.$model"
                    v-for="option in options.quarter"
                    :key="option._id"
                    :value="option._id"
                  >
                    {{ option.values[lang].value }}
                  </md-checkbox>
                  <p
                    v-if="$v.info.quarter.$dirty && !$v.info.quarter.required"
                    class="lab-fake-error"
                  >
                    Dit veld is verplicht
                  </p>
                </div>

                <div
                  v-if="info.phase == 'profiling' || info.phase == 'minor'"
                  class="lab-fake-field"
                >
                  <h2 class="lab-fake-label lab-fake-label-required">
                    <span v-if="info.phase == 'profiling'">Project</span>
                    <span v-if="info.phase == 'minor'">Minor</span>
                  </h2>
                  <p class="help">Bij welke groep hoort {{ unit }}?</p>
                  <!-- TODO: change to english -->
                  <md-checkbox
                    class="lab-check-vertical"
                    v-model="$v.info.cluster.$model"
                    v-for="option in options.cluster.filter(
                      o =>
                        o.phase ==
                        (info.phase == 'profiling' ? 'verdieping' : info.phase)
                    )"
                    :key="option._id"
                    :value="option._id"
                  >
                    {{ option.name[lang].value }}
                  </md-checkbox>
                  <p
                    v-if="$v.info.cluster.$dirty && !$v.info.cluster.required"
                    class="lab-fake-error"
                  >
                    Dit veld is verplicht
                  </p>
                </div>

                <md-button type="submit" class="md-dense md-raised md-primary">
                  Verder
                </md-button>
              </form>
            </md-step>

            <md-step
              id="matter"
              md-label="Materie"
              md-description="Wat studenten leren, en hoe"
              :md-error="
                $v.matter.$dirty && $v.matter.$invalid ? 'Informatie mist' : ''
              "
              :md-done="!$v.matter.$invalid"
            >
              <p>
                In dit onderdeel van de monitor vragen we je naar de inhoud van
                {{ unit }}. Wat is de stof? Hoe wordt er gewerkt?
              </p>

              <form
                novalidate
                v-on:submit="next($event, 'matter', 'classification')"
              >
                <md-field
                  :class="{
                    'md-invalid':
                      $v.matter.objectivesSummary.$dirty &&
                      $v.matter.objectivesSummary.$invalid
                  }"
                >
                  <label>Leerdoelen</label>
                  <md-textarea
                    v-model.trim="$v.matter.objectivesSummary.$model"
                    :maxlength="
                      $v.matter.objectivesSummary.$params.maxLength.max
                    "
                    md-autogrow
                    required
                  />
                  <span
                    class="md-error"
                    v-if="!$v.matter.objectivesSummary.required"
                    >Dit veld is verplicht</span
                  >
                  <span
                    class="md-error"
                    v-if="!$v.matter.objectivesSummary.maxLength"
                    >Dit veld is te lang (max.
                    {{
                      $v.matter.objectivesSummary.$params.maxLength.max
                    }}
                    karakters)</span
                  >
                </md-field>
                <p class="help">
                  Beschrijf wat de student leert. Vul meerdere leerdoelen in.
                  Gebruik streepjes en enters. Bijvoorbeeld,
                  <samp
                    >- You learn to be aware of the ethical issues involved in
                    design and designing</samp
                  >
                </p>

                <div class="lab-fake-field">
                  <h2 class="lab-fake-label lab-fake-label-required">
                    Werkvormen
                  </h2>
                  <p class="help">
                    Geef aan welke werkvormen worden gebruikt binnen {{ unit }}.
                  </p>
                  <md-checkbox
                    v-model="$v.matter.methods.$model"
                    v-for="option in options.method"
                    :key="option._id"
                    :value="option._id"
                    class="lab-check-vertical"
                  >
                    <strong>{{ option.values[lang].value }}</strong>
                    <span v-if="option.values[lang].description">
                      ({{ option.values[lang].description }})
                    </span>
                  </md-checkbox>
                  <p
                    class="lab-fake-error"
                    v-if="
                      $v.matter.methods.$dirty && !$v.matter.methods.required
                    "
                  >
                    Dit veld is verplicht
                  </p>
                </div>

                <md-field
                  :class="{
                    'md-invalid':
                      $v.matter.methodsSummary.$dirty &&
                      $v.matter.methodsSummary.$invalid
                  }"
                >
                  <label>Beschrijving van werkvormen</label>
                  <md-textarea
                    v-model.trim="$v.matter.methodsSummary.$model"
                    md-autogrow
                    required
                    :maxlength="$v.matter.methodsSummary.$params.maxLength.max"
                  />
                  <span
                    class="md-error"
                    v-if="!$v.matter.methodsSummary.required"
                    >Dit veld is verplicht</span
                  >
                  <span
                    class="md-error"
                    v-if="!$v.matter.methodsSummary.maxLength"
                    >Dit veld is te lang (max.
                    {{
                      $v.matter.methodsSummary.$params.maxLength.max
                    }}
                    karakters)</span
                  >
                </md-field>
                <p class="help">
                  Beschrijf in twee tot vier alineas er binnen {{ unit }} en
                  tijdens de werkvormen gewerkt wordt.
                </p>

                <div class="lab-fake-field">
                  <h2 class="lab-fake-label lab-fake-label-required">
                    Toetsvormen
                  </h2>
                  <p class="help">
                    Geef aan welke toetsvormen worden gebruikt binnen
                    {{ unit }}.
                  </p>
                  <md-checkbox
                    v-model="$v.matter.assessments.$model"
                    v-for="option in options.assessments"
                    :key="option._id"
                    :value="option._id"
                    class="lab-check-vertical"
                  >
                    <strong>{{ option.values[lang].value }}</strong>
                    <span v-if="option.values[lang].description">
                      ({{ option.values[lang].description }})
                    </span>
                  </md-checkbox>
                  <p
                    class="lab-fake-error"
                    v-if="
                      $v.matter.assessments.$dirty &&
                        !$v.matter.assessments.required
                    "
                  >
                    Dit veld is verplicht
                  </p>
                </div>

                <md-field
                  :class="{
                    'md-invalid':
                      $v.matter.assessmentsSummary.$dirty &&
                      $v.matter.assessmentsSummary.$invalid
                  }"
                >
                  <label>Beschrijving van toetsvormen</label>
                  <md-textarea
                    v-model.trim="$v.matter.assessmentsSummary.$model"
                    md-autogrow
                    required
                    :maxlength="
                      $v.matter.assessmentsSummary.$params.maxLength.max
                    "
                  />
                  <span
                    class="md-error"
                    v-if="!$v.matter.assessmentsSummary.required"
                    >Dit veld is verplicht</span
                  >
                  <span
                    class="md-error"
                    v-if="!$v.matter.assessmentsSummary.maxLength"
                    >Dit veld is te lang (max.
                    {{
                      $v.matter.assessmentsSummary.$params.maxLength.max
                    }}
                    karakters)</span
                  >
                </md-field>
                <p class="help">
                  Beschrijf in twee tot vier alineas hoe er binnen
                  {{ unit }} getoetst wordt.
                </p>

                <md-field
                  :class="{
                    'md-invalid':
                      $v.matter.studyMaterialsRequired.$dirty &&
                      $v.matter.studyMaterialsRequired.$invalid
                  }"
                >
                  <label>Studiemateriaal verplicht</label>
                  <md-textarea
                    v-model.trim="$v.matter.studyMaterialsRequired.$model"
                    md-autogrow
                    :maxlength="
                      $v.matter.studyMaterialsRequired.$params.maxLength.max
                    "
                  />
                  <span
                    v-if="!$v.matter.studyMaterialsRequired.maxLength"
                    class="md-error"
                  >
                    Dit veld is te lang (max.
                    {{
                      $v.matter.studyMaterialsRequired.$params.maxLength.max
                    }}
                    karakters)
                  </span>
                </md-field>
                <p class="help">
                  Vul de verplichte studie materialen in die studenten zelf
                  moeten aanschaffen voor {{ unit }}. Gebruik streepjes en
                  enters. Bijvoorbeeld,
                  <samp
                    >- Fink, L. Dee. Creating Significant Learning Experiences.
                    Jossey-Bass, 2013.</samp
                  >
                </p>

                <md-field
                  :class="{
                    'md-invalid':
                      $v.matter.studyMaterialsUsed.$dirty &&
                      $v.matter.studyMaterialsUsed.$invalid
                  }"
                >
                  <label>Studiemateriaal specifiek</label>
                  <md-textarea
                    v-model.trim="$v.matter.studyMaterialsUsed.$model"
                    md-autogrow
                    :maxlength="
                      $v.matter.studyMaterialsUsed.$params.maxLength.max
                    "
                  />
                  <span
                    v-if="!$v.matter.studyMaterialsUsed.maxLength"
                    class="md-error"
                  >
                    Dit veld is te lang (max.
                    {{
                      $v.matter.studyMaterialsUsed.$params.maxLength.max
                    }}
                    karakters)
                  </span>
                </md-field>
                <p class="help">
                  Vul de specifieke studie materialen in die gebruikt worden
                  binnen {{ unit }}. Denk aan artikelen, video’s, tutorial’s,
                  &amp;c. Gebruik streepjes en enters. Bijvoorbeeld,
                  <samp
                    >- Bostock, M. ‘Introduction to asynchronous iteration’.
                    2018.</samp
                  >
                </p>

                <div class="lab-fake-field">
                  <h2 class="lab-fake-label">Beroepsproducten</h2>
                  <p class="help">
                    Geef aan welke beroepsproducten er worden gebruikt en
                    getoetst binnen {{ unit }}.
                  </p>

                  <md-table v-model="options.products">
                    <md-table-row slot="md-table-row" slot-scope="{item}">
                      <md-table-cell md-label="Product">
                        {{ item.values[lang].value }}
                      </md-table-cell>
                      <md-table-cell md-label="Gebruikt">
                        <md-checkbox
                          v-model="$v.matter.productsLearned.$model"
                          :value="item._id"
                          class="lab-check-no-margin"
                        />
                      </md-table-cell>
                      <md-table-cell md-label="Getoetst">
                        <md-checkbox
                          v-model="$v.matter.productsAsked.$model"
                          :value="item._id"
                          class="lab-check-no-margin"
                        />
                      </md-table-cell>
                    </md-table-row>
                  </md-table>
                </div>

                <div class="lab-fake-field">
                  <h2 class="lab-fake-label lab-fake-label-required">
                    Onderzoeksmethoden
                  </h2>
                  <p class="help">
                    Geef aan welke onderzoeksmethoden er worden gebruikt en
                    getoetst binnen {{ unit }}.
                  </p>

                  <div class="lab-methods">
                    <md-card
                      v-for="option in options.cards"
                      :key="option.id"
                      class="lab-method"
                      md-with-hover
                    >
                      <md-card-media>
                        <img
                          class="lab-method-cover"
                          :src="'http://www.cmdmethods.nl/' + option.image"
                          :width="option.width"
                          :height="option.height"
                          alt=""
                        />
                      </md-card-media>

                      <md-card-header>
                        <div class="md-title">
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            :href="
                              'http://www.cmdmethods.nl/cards/' +
                                option.strategy +
                                '/' +
                                option.id
                            "
                          >
                            {{ option.name }}
                          </a>
                        </div>
                      </md-card-header>

                      <md-card-actions
                        md-alignment="space-between"
                        class="lab-method-checks"
                      >
                        <md-checkbox
                          v-model="$v.matter.researchMethodsLearned.$model"
                          :value="option.id"
                          class="lab-method-check"
                        >
                          Gebruikt
                        </md-checkbox>
                        <md-checkbox
                          v-model="$v.matter.researchMethodsAsked.$model"
                          :value="option.id"
                          class="lab-method-check"
                        >
                          Getoetst
                        </md-checkbox>
                      </md-card-actions>
                    </md-card>
                  </div>
                </div>

                <md-button type="submit" class="md-dense md-raised md-primary">
                  Verder
                </md-button>
              </form>
            </md-step>

            <md-step
              id="classification"
              md-label="Classificatie"
              :md-description="'Waar valt ' + unit + '?'"
              :md-error="
                $v.classification.$dirty && $v.classification.$invalid
                  ? 'Informatie mist'
                  : ''
              "
              :md-done="!$v.classification.$invalid"
            >
              <p>
                In dit onderdeel vragen we je {{ unit }} te classificeren. Waar
                valt {{ unit }} in ons curriculum?
              </p>

              <form
                novalidate
                v-on:submit="next($event, 'classification', 'people')"
              >
                <div class="lab-fake-field">
                  <h2 class="lab-fake-label lab-fake-label-required">
                    Competenties
                  </h2>
                  <p
                    class="lab-fake-error"
                    v-if="
                      $v.classification.competencies.$dirty &&
                        !$v.classification.competencies.required
                    "
                  >
                    Dit veld is verplicht
                  </p>
                  <p class="help">
                    De CMD competenties beschrijven het <em>eindniveau</em> van
                    een CMD student. Kies dus competenties waaraan gewerkt wordt
                    tijdens {{ unit }}.
                  </p>
                  <div v-for="option in options.competency" :key="option._id">
                    <md-checkbox
                      v-model="$v.classification.competencies.$model"
                      :value="option._id"
                      class="lab-check-vertical"
                    >
                      {{ option.value }}
                    </md-checkbox>
                    <p
                      class="lab-check-description"
                      v-on:click="
                        toggle(classification.competencies, option._id)
                      "
                    >
                      {{ option.description[lang].value }}
                    </p>
                  </div>
                </div>

                <div v-if="info.type == 'course'" class="lab-fake-field">
                  <h2 class="lab-fake-label lab-fake-label-required">
                    Cirkels
                  </h2>
                  <img class="lab-circles" src="./assets/circles.png" />
                  <p class="help">
                    In welk gedeelte van de CMD cirkels valt {{ unit }}?
                  </p>

                  <md-radio
                    v-model="$v.classification.circles.$model"
                    v-for="option in options.circles"
                    :key="option._id"
                    :value="option._id"
                    class="lab-check-vertical"
                  >
                    <strong>{{ option._id }}</strong
                    >: {{ option.values[lang].value }}
                  </md-radio>
                  <p
                    v-if="
                      $v.classification.circles.$dirty &&
                        !$v.classification.circles.required
                    "
                    class="lab-fake-error"
                  >
                    Dit veld is verplicht
                  </p>
                </div>

                <div v-if="info.type == 'project'">
                  <h2 class="lab-fake-label lab-fake-label-required">
                    Gebieden
                  </h2>
                  <img class="lab-spaces" src="./assets/spaces.png" />
                  <p class="help">In welk gebied valt {{ unit }}?</p>
                  <details>
                    <summary>Meer informatie over de gebieden</summary>
                    <h3>Probleem</h3>
                    <p>
                      Dit is de space van meta of strategisch begrip en
                      afbakening. De ontwerper zoekt een kader op strategisch
                      niveau om het project richting te geven. Hoewel dat de
                      focus op begrip en afbakening ligt, heeft de ontwerper
                      zijn hele arsenaal aan competenties nodig om een design
                      challenge te definiëren die helder en inspirerend is.
                    </p>
                    <h3>Concept</h3>
                    <p>
                      In deze space vormt de strategische challenge het
                      startpunt voor het genereren en valideren van ideeën. Dit
                      betekent een aantal tastbare opties creëren en evalueren
                      of ze effectief en gepast zijn. Het doel is het selecteren
                      van een productvisie en -concept dat door een team
                      verfijnd en uitgewerkt kan worden tot een lanceerbaar
                      product.
                    </p>
                    <h3>Ontwerp / bouwen</h3>
                    <p>
                      De space van detailontwerp, realisatie en afwegingen. Dit
                      is ook de space waar veel ontwerpers hun carrière starten
                      (in combinatie met de market space). Het concept of de
                      challenge is al dan niet van de ontwerpers in deze ruimte
                      zelf. Ze werken het concept in ieder geval uit - in
                      verschillende iteraties en meestal in multidisciplinaire
                      teams - tot iets dat gelanceerd kan worden.
                    </p>
                    <h3>Markt</h3>
                    <p>
                      In de market space worden vaak bedrijfskritische producten
                      uitgebreid en herontworpen, om de user experience en
                      prestaties/metrics te optimaliseren, nieuwe mogelijkheden
                      te benutten en om druk van concurrenten het hoofd te
                      bieden. Bij het doorlopen van de iteraties is een
                      complicerende factor dat rekening gehouden moet worden met
                      een live systeem.
                    </p>
                  </details>

                  <md-radio
                    v-model="$v.classification.spaces.$model"
                    v-for="option in options.spaces"
                    :key="option._id"
                    :value="option._id"
                    class="lab-check-vertical"
                  >
                    <strong>{{ option.number }}</strong
                    >: {{ option.values[lang].value }}
                  </md-radio>
                  <p
                    v-if="
                      $v.classification.spaces.$dirty &&
                        !$v.classification.spaces.required
                    "
                    class="lab-fake-error"
                  >
                    Dit veld is verplicht
                  </p>
                </div>

                <div v-if="info.type == 'project'" class="lab-levels">
                  <h2 class="lab-fake-label">Niveau</h2>

                  <p class="help">
                    Wat is het niveau van de opdracht van {{ unit }}?
                  </p>

                  <table class="lab-level-table">
                    <thead>
                      <tr>
                        <th></th>
                        <th
                          v-for="option in options.independenceLevels"
                          :key="option._id"
                        >
                          {{ option.values[lang].value }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>
                          {{ options.complexityLevels[3].values[lang].value }}
                        </th>
                        <td class="profiling">Profileren</td>
                        <td class="graduation">Afstuderen</td>
                        <td class="excel">Excelleren</td>
                        <td class="excel">Excelleren</td>
                      </tr>
                      <tr>
                        <th>
                          {{ options.complexityLevels[2].values[lang].value }}
                        </th>
                        <td class="profiling">Profileren</td>
                        <td class="profiling">Profileren</td>
                        <td class="graduation">Afstuderen</td>
                        <td class="excel">Excelleren</td>
                      </tr>
                      <tr>
                        <th>
                          {{ options.complexityLevels[1].values[lang].value }}
                        </th>
                        <td class="foundation">Funderen</td>
                        <td class="profiling">Profileren</td>
                        <td class="profiling">Profileren</td>
                        <td class="graduation">Afstuderen</td>
                      </tr>
                      <tr>
                        <th>
                          {{ options.complexityLevels[0].values[lang].value }}
                        </th>
                        <td class="foundation">Funderen</td>
                        <td class="foundation">Funderen</td>
                        <td class="profiling">Profileren</td>
                        <td class="profiling">Profileren</td>
                      </tr>
                    </tbody>
                  </table>

                  <div class="lab-fake-field">
                    <h3 class="lab-fake-label lab-fake-label-required">
                      Complexiteit
                    </h3>
                    <p class="help">Wat is de complexiteit van {{ unit }}?</p>

                    <md-radio
                      v-model="$v.classification.levelComplexity.$model"
                      v-for="option in options.complexityLevels"
                      :key="option._id"
                      :value="option._id"
                    >
                      {{ option.values[lang].value }}
                    </md-radio>
                    <p
                      v-if="
                        $v.classification.levelComplexity.$dirty &&
                          !$v.classification.levelComplexity.required
                      "
                      class="lab-fake-error"
                    >
                      Dit veld is verplicht
                    </p>
                  </div>

                  <div class="lab-fake-field">
                    <h3 class="lab-fake-label lab-fake-label-required">
                      Initiërend vermogen
                    </h3>
                    <p class="help">
                      Wat is het initiërend vermogen gevraagd van studenten van
                      {{ unit }}?
                    </p>

                    <md-radio
                      v-model="$v.classification.levelIndependence.$model"
                      v-for="option in options.independenceLevels"
                      :key="option._id"
                      :value="option._id"
                    >
                      {{ option.values[lang].value }}
                    </md-radio>
                    <p
                      v-if="
                        $v.classification.levelIndependence.$dirty &&
                          !$v.classification.levelIndependence.required
                      "
                      class="lab-fake-error"
                    >
                      Dit veld is verplicht
                    </p>
                  </div>
                </div>

                <md-button type="submit" class="md-dense md-raised md-primary"
                  >Verder</md-button
                >
              </form>
            </md-step>

            <md-step
              id="people"
              md-label="Mensen"
              :md-description="
                'De betrokken docenten en coordinatoren van ' + info.type
              "
              :md-error="
                $v.people.$dirty && $v.people.$invalid ? 'Informatie mist' : ''
              "
              :md-done="!$v.people.$invalid"
            >
              <p>
                In dit onderdeel vragen we je om aan te geven wie
                {{ unit }} coördineren en doceren.
              </p>

              <form novalidate v-on:submit="next($event, 'people')">
                <md-field
                  :class="{
                    'md-invalid':
                      $v.people.coordinators.$dirty &&
                      $v.people.coordinators.$invalid
                  }"
                >
                  <label>Coördinatoren</label>
                  <md-select v-model="$v.people.coordinators.$model" multiple>
                    <md-option
                      v-for="option in options.person"
                      :value="option._id"
                      :key="option._id"
                      >{{ option.name }}</md-option
                    >
                  </md-select>
                  <span
                    class="md-error"
                    v-if="!$v.people.coordinators.required"
                  >
                    Dit veld is verplicht
                  </span>
                </md-field>
                <p class="help">Kies welke mensen {{ unit }} coördineren.</p>

                <md-field
                  :class="{
                    'md-invalid':
                      $v.people.teachers.$dirty && $v.people.teachers.$invalid
                  }"
                >
                  <label>Docenten</label>
                  <md-select v-model="$v.people.teachers.$model" multiple>
                    <md-option
                      v-for="option in options.person"
                      :value="option._id"
                      :key="option._id"
                      >{{ option.name }}</md-option
                    >
                  </md-select>
                </md-field>
                <p class="help">Kies welke mensen {{ unit }} geven.</p>

                <md-button type="submit" class="md-dense md-raised md-primary">
                  Afronden
                </md-button>
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
const carddb = require('./assets/cards.json') // Cardi B?
const moduleTypes = require('./assets/module-types.json')
const programPhases = require('./assets/program-phases.json')
const learningYears = require('./assets/learning-years.json')
const quarters = require('./assets/quarters.json')
const circles = require('./assets/circles.json')
const spaces = require('./assets/spaces.json')
const methods = require('./assets/methods.json')
const assessments = require('./assets/assessments.json')
const products = require('./assets/products.json')
const independenceLevels = require('./assets/independence.json')
const complexityLevels = require('./assets/complexity.json')

const cards = carddb
  .filter(x => x.type === 'card')
  .map(({id, name, strategy, image, image_width, image_height}) => ({
    id,
    name,
    strategy,
    image,
    width: image_width,
    height: image_height
  }))

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
      step: 'intro',
      lang: 0,
      info: {
        name: '',
        shortDescription: '',
        description: '',
        type: '',
        phase: '',
        quarter: [],
        learningYear: '',
        cluster: [],
        credits: null
      },
      matter: {
        objectivesSummary: '',
        methods: [],
        methodsSummary: '',
        productsLearned: [],
        productsAsked: [],
        researchMethodsLearned: [],
        researchMethodsAsked: [],
        assessments: [],
        assessmentsSummary: '',
        studyMaterialsRequired: '',
        studyMaterialsUsed: ''
      },
      classification: {
        competencies: [],
        circles: null,
        levelComplexity: null,
        levelIndependence: null,
        spaces: null
      },
      people: {
        coordinators: [],
        teachers: []
      },
      options: {
        person: null,
        competency: null,
        method: methods,
        phase: programPhases,
        learningYear: learningYears,
        quarter: quarters,
        circles: circles,
        spaces: spaces,
        independenceLevels: independenceLevels,
        complexityLevels: complexityLevels,
        type: moduleTypes,
        cluster: null,
        products: products,
        cards: cards,
        assessments: assessments
      }
    }
  },
  computed: {
    unit() {
      return this.info.type === 'project'
        ? 'het project'
        : this.info.type === 'course'
        ? 'het vak'
        : 'de module'
    }
  },
  validations: function() {
    const {phase, type} = this.info
    return {
      intro: {},
      info: {
        name: {required},
        shortDescription: {required, maxLength: maxLength(240)},
        description: {required, maxLength: maxLength(1024)},
        type: {required},
        phase: {required},
        learningYear: {required},
        quarter: {required},
        cluster: phase === 'profiling' || phase === 'minor' ? {required} : {},
        credits: {required, minValue: minValue(1), maxValue: maxValue(30)}
      },
      matter: {
        objectivesSummary: {required, maxLength: maxLength(1024)},
        methods: {required},
        methodsSummary: {required, maxLength: maxLength(1024)},
        assessments: {required},
        assessmentsSummary: {required, maxLength: maxLength(1024)},
        studyMaterialsRequired: {maxLength: maxLength(1024)},
        studyMaterialsUsed: {maxLength: maxLength(1024)},
        productsLearned: {},
        productsAsked: {},
        researchMethodsLearned: {required},
        researchMethodsAsked: {required}
      },
      classification: {
        competencies: {required},
        circles: type === 'course' ? {required} : {},
        spaces: type === 'project' ? {required} : {},
        levelComplexity: type === 'project' ? {required} : {},
        levelIndependence: type === 'project' ? {required} : {}
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
    toggle(list, value) {
      var position = list.indexOf(value)
      if (position === -1) {
        list.push(value)
      } else {
        list.splice(position, 1)
      }
    },
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
      const {info, matter, classification, people} = this.$data

      const body = {
        name: [{language: 'nl', value: info.name}],
        shortDescription: [{language: 'nl', value: info.shortDescription}],
        description: [{language: 'nl', value: info.description}],
        learningYears: [info.learningYear],
        phase: info.phase,
        type: info.type,
        periods: info.quarter,
        cluster: info.cluster,
        credits: parseInt(info.credits, 10),
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
        competencies: classification.competencies,
        circles: classification.circles,
        spaces: classification.spaces,
        level:
          classification.levelComplexity +
          ',' +
          classification.levelIndependence,
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
  .lab-circles,
  .lab-spaces {
    width: 40%;
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

.lab-check-no-margin {
  display: block;
  margin: 0.5rem auto;
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

.lab-check-vertical {
  display: flex;
}

.lab-check-vertical >>> .md-checkbox-label,
.lab-check-vertical >>> .md-radio-label {
  display: block;
  height: auto;
}

.lab-fake-label-required::after {
  content: ' *';
}

.lab-fake-error {
  color: #ff1744;
  font-size: 12px;
}

.lab-methods {
  /* Alright, so the space we have is (48 * 16) - 60 - 24 */
  /* That’s the max width times the font-size, minus the stepper margins. */
  /* So we have 684px. */
  /* We want 3 cards next to each other, and some spacing. */
  /* Lets say two gutters of 12px. */
  /* Meaning we have 660px left, divided by 3, is 220px per card. */
  margin: 0 -8px;
}

.lab-method {
  width: 220px;
  margin: 6px !important;
  display: inline-block;
  vertical-align: top;
}

.lab-method >>> .md-card-header-text p {
  margin-top: 0;
}

.lab-method-checks {
  padding: 16px 8px;
}

.lab-method-check {
  margin: 0 8px;
}

.lab-method >>> .md-card-media img {
  max-width: 10rem;
  margin: 0 auto;
  display: block;
}

.lab-method >>> .md-card-header {
  padding: 8px 16px;
}

.lab-method >>> .md-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
}

.lab-method-check >>> .md-checkbox-label {
  padding-left: 8px;
}

.lab-levels {
  margin-top: 3rem;
}

.lab-level-table {
  empty-cells: show;
  max-width: 100%;
  margin: 1em 0;
}

.lab-level-table thead {
  display: table-footer-group;
}

.lab-level-table :matches(th, td) {
  padding: 1rem;
  text-align: center;
}

.lab-level-table th {
  font-weight: normal;
}

.lab-level-table th:first-child {
  text-align: right;
}

.lab-level-table td.foundation {
  background-color: rgb(251, 203, 66);
}
.lab-level-table td.profiling {
  background-color: rgb(168, 212, 193);
}
.lab-level-table td.graduation {
  background-color: rgb(43, 157, 144);
}
.lab-level-table td.excel {
  background-color: rgb(229, 100, 98);
}
.lab-level-table td:matches(.graduation, .excel) {
  color: white;
}

samp {
  font-family: inherit;
  font-style: italic;
}

samp::before {
  content: open-quote;
  font-style: normal;
}

samp::after {
  content: close-quote;
  font-style: normal;
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
</style>
