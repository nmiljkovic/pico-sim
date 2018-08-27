import Vue from "vue";
import App from "./components/App.vue";
import Buefy from "buefy";
import "buefy/lib/buefy.css";
import "./page.css";
import store from "./store";

Vue.use(Buefy);

new Vue({
  el: "#app",
  store: store,
  render: h => h(App)
});

store.commit("updateCode", {
  code: `	; For input N, calculates:
	; 1. sum 1 to N
	; 2. sum all squares from 1 to N
	n = 1
	s1 = 2
	s2 = 3
	k = 4

	org 8

	in n
	mov s1, 0
	mov s2, 0
petlja:
	add s1, s1, n
	mul k, n, n
	add s2, s2, k
	sub n, n, 1
	bgt n, 0, petlja
	stop s1, s2
`
});
