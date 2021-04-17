import { createApp } from "vue"
import App from "./App.vue"
import store from "./store"
import "./index.css"
import "./variables.css"

createApp(App).use(store).mount("#app")
