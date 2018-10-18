<template>
  <div id="app">
    <h1>De nieuwe ✨Vakkenvuller✨</h1>
    <form id="signup-form" @submit.prevent="postCourse">
      <section id="Faculteit">
        <p>Onder welke faculteit valt dit vak?</p>
        <select v-model="faculty">
          <option>{{ faculty }}</option>
          <option>B</option>
          <option>C</option>
        </select>
      </section>
      <section id="Indicatoren">
        <p>Welke competentie indicatoren zijn vertegenwoordigd/komen terug in dit vak?</p>
        <select >
          <option v-for="indicator in indicators" :value="indicator.value">
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
  data: function(){
    return {
      name: "",
      faculty: "",
      description:"",
      years:"",
      learningYears:"",
      periods:"",
      credits:"",
      start:"",
      end:"",
      methods:"",
      methodsSummary:"",
      coordinators:"",
      coordinatorsSummary:"",
      teachers:"",
      teachersSummary:"",
      competencies:"",
      indicators:"",
      indicatorSummary:"",
      objectivesSummary:"",
      program:"",
    }
  },
  created: function() {
    console.log("Page loaded")
    fetch(APIUrl+"faculty/")
      .then(response => response.json())
      .then(json => { this.faculty = json[0].name[0].value })
    fetch(APIUrl+"indicator/")
      .then(response => response.json())
      .then(json => { this.indicators = json })
  },
  methods: {
    postCourse: function(){
      console.log(this.$data)
      fetch("http://localhost:8000/course/",{
        method: "post",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(this.$data)
      })
        .then(response => response.json())
        .then(json => { console.log(json) })
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
