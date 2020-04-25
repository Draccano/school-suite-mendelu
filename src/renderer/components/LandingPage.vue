<template>
  <div class="bg-gray-200 min-h-full w-full mx-0 my-0">
    <div class="hello">
      <div
        class="pb-8 px-4 md:px-8 lg:px-12 xl:px-20 flex items-center justify-center flex-col"
      >
        <div class="my-6 text-4xl leading-tight font-semibold font-display">
          Čekuj zkoušku
        </div>

        <div
          class="bg-white flex flex-col h-auto sm:w-11/12 lg:w-8/12 md:w-10/12 lg:w-9/12 xl:w-8/12 py-4 rounded shadow-lg w-full"
        >
          <div class="flex justify-end px-10">
            <span
              :class="{ hidden: !loggedIn }"
              class="text-indigo-400 hover:text-indigo-600 hover:bg-grey-200 hover:px-2 hover:py-1 cursor-pointer"
              @click="logout"
              >Odhlásit</span
            >
          </div>
          <!-- <div class="w-full px-6 min-h-full xs:flex-col sm:flex md:flex lg:flex xl:flex" :class="{'border-b border-gray-200': data}"> -->
          <div
            class="w-full px-6 min-h-full xs:flex-col sm:flex md:flex lg:flex xl:flex border-b border-gray-200"
          >
            <label
              class="mt-4 block w-full px-2 sm:mt-0 sm:w-2/5 sm:w-5/12 lg:mt-4 lg:w-5/12 xl:w-5/12"
            >
              <span class="text-sm font-semibold text-gray-500"
                >Uživatelské jméno</span
              >
              <input
                class="block px-3 py-3 my-1 w-full bg-gray-200 text-gray-700 focus:outline-none focus:bg-white focus:text-gray-900 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-lg"
                placeholder="Uživatelské jméno (UIs)"
                v-model="nickname"
              />
            </label>
            <label
              class="mt-4 block w-full px-2 sm:mt-0 sm:w-2/5 lg:mt-4 lg:w-5/12 xl:w-5/12"
            >
              <span class="text-sm font-semibold text-gray-500">Heslo</span>
              <input
                class="block px-3 py-3 my-1 w-full bg-gray-200 text-gray-700 focus:outline-none focus:bg-white focus:text-gray-900 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-lg"
                placeholder="Heslo"
                type="password"
                v-model="password"
              />
            </label>

            <label
              class="mt-4 block w-full flex flex-col xs:px-0 px-2 sm:mt-0 sm:w-1/5 lg:mt-4 lg:w-2/12 xl:w-2/12 focus:outline-none"
            >
              <button
                @click="login"
                class="block relative w-full h-12 sm:w-auto sm:inline-block bg-indigo-500 hover:bg-indigo-400 font-semibold text-white px-6 mt-6 py-2 rounded-lg xl:block"
              >
                <div class="w-full h-full px-1 py-1">
                  <span :class="{ hidden: loading }">Login</span>
                  <div
                    :class="{ hidden: !loading }"
                    class="flex h-full items-center justify-center relative w-full "
                  >
                    <div class="flex h-full items-center">
                      <div class="lds-ring scale">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </label>
          </div>
          <div>
            <div
              class="w-full px-6 py-4 min-h-full flex-wrap xs:flex-col sm:flex md:flex lg:flex xl:flex"
            >
              <label
                class="mt-4 block w-full px-2 sm:mt-0 sm:w-3/12 md:w-3/12 lg:mt-4 lg:w-3/12 xl:w-3/12"
              >
                <span class="text-sm font-semibold text-gray-500">Předmět</span>
                <select
                  @change="changedSubject"
                  v-model="selectedSubject"
                  class="block px-3 py-3 my-1 w-full bg-gray-200 text-gray-700 focus:outline-none focus:bg-white focus:text-gray-900 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-lg"
                >
                  <option value="">--</option>
                  <option v-for="subject in termsSubjects" :value="subject">{{
                    subject
                  }}</option>
                </select>
              </label>
              <label
                class="mt-4 block w-full px-2 sm:mt-0 sm:w-3/12 md:w-3/12 lg:mt-4 lg:w-4/12 xl:w-4/12"
              >
                <span class="text-sm font-semibold text-gray-500">Termín</span>
                <select
                  @change="changedTerm"
                  v-model="selectedTerm"
                  class="block px-3 py-3 my-1 w-full bg-gray-200 text-gray-700 focus:outline-none focus:bg-white focus:text-gray-900 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-lg"
                >
                  <option value="">--</option>
                  <option
                    v-for="term in subjectTerms"
                    :value="term"
                    ref="sbjTerms"
                    >{{ term }}</option
                  >
                </select>
              </label>
              <label
                class="mt-4 block w-full px-2 sm:mt-0 sm:w-3/12 md:w-3/12 lg:mt-4 lg:w-3/12 xl:w-3/12"
              >
                <span class="text-sm font-semibold text-gray-500"
                  >Refresh [min]</span
                >
                <input
                  type="number"
                  @change="changedMinutes"
                  class="block px-3 py-3 my-1 w-full bg-gray-200 text-gray-700 focus:outline-none focus:bg-white focus:text-gray-900 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-lg"
                  placeholder="minuty"
                  v-model.number="minutes"
                  min="1"
                />
              </label>
              <label
                class="mt-4 block w-full xs:px-0 px-2 sm:mt-0 sm:w-3/12 md:w-3/12 lg:mt-4 lg:w-2/12 xl:w-2/12 focus:outline-none"
              >
                <button
                  :disabled="noTerms"
                  @click="runChecker"
                  :class="{
                    'bg-gray-400 cursor-not-allowed': noTerms,
                    'bg-green-500 hover:bg-green-400':
                      !checkerRunning && !noTerms,
                    'bg-red-500 hover:bg-red-400': checkerRunning && !noTerms
                  }"
                  class="block w-full px-6 h-12 sm:w-auto sm:inline-block  font-semibold text-white mt-6 py-2 rounded-lg xl:block focus:outline-none"
                >
                  <div class="flex flex-center">
                    <svg
                      viewBox="0 0 55 55"
                      :class="{ hidden: checkerRunning }"
                      class="h-4 w-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      stroke-linejoin="round"
                      stroke-miterlimit="1.414"
                    >
                      <path
                        d="M12.869 3.158C8.277.524 4.555 2.68 4.555 7.973v39.05c0 5.297 3.722 7.452 8.314 4.82L47 32.27c4.593-2.634 4.593-6.903 0-9.537L12.869 3.158z"
                        fill-rule="nonzero"
                      />
                    </svg>
                    <svg
                      viewBox="0 0 55 55"
                      :class="{ hidden: !checkerRunning }"
                      class="h-4 w-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      stroke-linejoin="round"
                      stroke-miterlimit="1.414"
                    >
                      <g fill-rule="nonzero">
                        <path
                          d="M17.521 2.013a5.544 5.544 0 00-5.544 5.543v39.888a5.542 5.542 0 005.544 5.543 5.543 5.543 0 005.544-5.543V7.556a5.542 5.542 0 00-5.544-5.544zM37.479 2.013a5.544 5.544 0 00-5.544 5.543v39.888a5.543 5.543 0 005.544 5.543 5.543 5.543 0 005.543-5.543V7.556a5.544 5.544 0 00-5.543-5.544z"
                        />
                      </g>
                    </svg>
                  </div>
                </button>
              </label>
              <label class="mt-4 block w-full px-2 sm:mt-0">
                <span class="ml-2 mb-0 text-gray-500"
                  ><span class="font-semibold">Přihlásit</span> na termín</span
                >
                <div class="flex flex-col">
                  <div class="px-3 my-1">
                    <b-radio
                      v-model="checkMode"
                      @input="changedCheckMode"
                      native-value="register"
                      name="type"
                      type="is-success"
                    >
                      Ano
                    </b-radio>
                    <span class="pl-2 text-gray-500"
                      >(Přihlásí na dostupný termín)</span
                    >
                  </div>
                  <div class="px-3 my-1">
                    <b-radio
                      v-model="checkMode"
                      @input="changedCheckMode"
                      native-value="info"
                      name="type"
                      type="is-info"
                    >
                      Ne
                    </b-radio>
                    <span class="pl-2 text-gray-500"
                      >(Pouze notifikuje dostupný termín)</span
                    >
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div class="w-full px-2 mt-0">
            <div class="px-6">
              <span class="text-sm font-semibold text-gray-500">Log list</span>
            </div>
            <div class="w-full px-6 pt-1 pb-4 min-h-full xs:flex-col">
              <div
                class="overflow-auto h-48 border border-gray-400 border-rounded px-2 py-2 rounded"
              >
                <div v-for="log in logger.slice().reverse()" v-html="log"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-8 flex">
          <span>Made with</span>
          <svg
            viewBox="0 0 55 55"
            xmlns="http://www.w3.org/2000/svg"
            class="mx-1 mt-1 h-4 w-4"
            fill-rule="evenodd"
            clip-rule="evenodd"
            stroke-linejoin="round"
            stroke-miterlimit="1.414"
          >
            <path
              d="M27.341 11.833C29.481 6.633 34.367 3 40.051 3c7.656 0 13.17 6.716 13.863 14.72 0 0 .374 1.988-.45 5.565-1.12 4.872-3.757 9.2-7.311 12.503L27.34 53 8.846 35.788c-3.554-3.302-6.19-7.631-7.312-12.503-.823-3.577-.45-5.564-.45-5.564C1.779 9.716 7.293 3 14.95 3c5.684 0 10.253 3.634 12.392 8.833z"
              fill="#d75a4a"
              fill-rule="nonzero"
            />
          </svg>
          <span> by student </span>
          <span class="text-blue-400 ml-1">PEF</span>
        </div>
        <span class="tracking-widest text-sm text-gray-600"
          >dracossos@gmail.com</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import { messageBus } from "../main.js";

export default {
  data() {
    return {
      loggeIn: false,
      timeoutProcess: "",
      noTerms: false,
      loggedIn: false,
      loading: false,
      termsSubjects: null,
      data: "",
      hasData: false,
      password: "",
      nickname: "",
      minutes: 5,
      selectedSubject: "",
      selectedTerm: "",
      subjectTerms: [],
      checkerRunning: false,
      logger: [],
      checkMode: "info",
      termKey: 0,
      checkForm: true
    };
  },
  created() {
    let self = this;
    messageBus.$on("errorLog", e => {
      if (self.checkerRunning) {
        self.log("Error", {
          type: "state",
          status: "error",
          e
        });
        self.checkerRunning = false;
      }
    });
    messageBus.$on("termUnAccesible", item => {
      const logItem = {
        type: "state",
        status: "fail",
        item: item
      };
      self.log("Nedostupný termín", logItem);
      if (self.checkerRunning) {
        this.timeoutProcess = setTimeout(() => {
          self.check();
        }, self.minutes * 60 * 1000);
      }
      console.log("data");
    });
    messageBus.$on("termAccesible", item => {
      if (self.checkerRunning) {
        self.log("Dostupný termín", {
          type: "state",
          status: "success",
          item
        });
        new Notification("Zkouška", {
          body: `termín ${item.date} předmětu ${item.subject} je dostupný`
        });
        if (this.checkMode === "register") {
          self.registerTerm();
        } else {
          self.checkerRunning = false;
        }
      }
    });
    messageBus.$on("termRegistered", args => {
      if (self.checkerRunning) {
        self.log("Registrace termínu", {
          type: "state",
          status: "register",
          item: args.term
        });
        new Notification("Zkouška", {
          body: `termín ${args.term.date} předmětu ${args.term.subject} byl registrován`
        });
        self.checkerRunning = false;
        this.refreshSelectedSubjects(args.terms);
      }
    });
    messageBus.$on("noTerms", () => {
      self.log("Nejsou žádné dostupné termíny", {
        type: "sys"
      });
      new Notification("Neexistence termínů", {
        body: `Nejsou žádné dostupné termíny`
      });
      this.loading = false;
      this.loggedIn = true;
      this.noTerms = true;
      this.$buefy.toast.open({
        duration: 2000,
        message: `Nejsou žádné dostupné termíny`,
        position: "is-top",
        type: "is-info"
      });
    });
    messageBus.$on("userInfoToShow", data => {
      this.loading = false;
      if (data.length < 1) {
        this.noTerms = false;
        this.loggedIn = false;
        this.data = null;
        this.$buefy.toast.open({
          duration: 2000,
          message: "Špatné iniciály",
          position: "is-bottom",
          type: "is-danger"
        });
      } else {
        this.noTerms = false;
        this.loggedIn = true;

        this.$buefy.toast.open({
          duration: 2000,
          message: "Úspěšné přihlášení",
          type: "is-success"
        });
        this.log("Přihlášení do UIs", {
          type: "sys"
        });
        this.processData(data);
      }
    });
  },

  methods: {
    logout() {
      this.password = "";
      this.nickname = "";
      this.data = "";
      this.loggedIn = false;
      this.noTerms = false;
      ipcRenderer.send("logout");
    },
    login() {
      this.hasData = false;
      this.data = null;
      this.termsSubjects = null;
      this.subjectTerms = null;
      if (!this.nickname || !this.password) {
        this.$buefy.toast.open({
          duration: 2000,
          message: `Nejsou zadány iniciály`,
          position: "is-bottom",
          type: "is-danger"
        });
      } else {
        this.loading = true;
        ipcRenderer.send("login", {
          nickname: this.nickname,
          password: this.password
        });
      }
    },
    changedSubject(e) {
      if (this.checkerRunning) {
        this.checkerRunning = false;
      }
      let self = this;
      this.subjectTerms = [];
      const selectedSubject =
        e.target.options[e.target.options.selectedIndex].value;
      this.data.forEach(item => {
        if (item.subject === selectedSubject) {
          self.subjectTerms.push(item.date);
        }
      });
    },
    changedTerm(e) {
      if (this.checkerRunning) {
        this.checkerRunning = false;
      }
    },
    changedMinutes(e) {
      if (this.checkerRunning) {
        this.checkerRunning = false;
      }
      if (e.target.value < 1 || e.target.value > 300) {
        this.minutes = 1;
      }
    },
    changedCheckMode() {
      if (this.checkerRunning) {
        this.checkerRunning = false;
      }
    },
    runChecker() {
      if (!this.loggedIn) {
        this.$buefy.toast.open({
          duration: 1500,
          message: `Nejdříve se přihlašte do UIs`,
          position: "is-bottom",
          type: "is-info"
        });
      } else {
        this.checkerRunning = !this.checkerRunning;
        if (!this.checkerRunning) {
          clearTimeout(this.timeoutProcess);
        }

        if (!this.minutes || !this.selectedSubject || !this.selectedTerm) {
          this.checkerRunning = false;
          this.$buefy.toast.open({
            duration: 1500,
            message: `Zadejte parametry`,
            position: "is-bottom",
            type: "is-danger"
          });
        } else if (this.checkerRunning) {
          this.check();
          this.$buefy.toast.open({
            duration: 1000,
            message: "Kontroluji termín",
            type: "is-info"
          });
        } else {
          this.$buefy.toast.open({
            duration: 1000,
            message: "Ukončena kontrola",
            type: "is-info"
          });
        }
      }
    },
    processData(data) {
      this.hasData = true;
      this.termsSubjects = [];
      this.loading = false;
      this.data = data;

      data.forEach(item => {
        if (this.termsSubjects.indexOf(item.subject) === -1) {
          this.termsSubjects.push(item.subject);
        }
      });
      console.log(this.termsSubjects);
    },
    refreshSelectedSubjects(terms) {
      for (let i = 1; i <= this.subjectTerms.length; i++) {
        this.subjectTerms.pop();
      }
      terms.forEach(item => {
        if (item.subject === this.selectedSubject) {
          this.subjectTerms.push(item.date);
        }
      });
    },
    log(record, log) {
      const now = new Date();
      const nowHours =
        now.getHours() < 10 ? `0${now.getHours()}` : now.getHours();
      const nowMinutes =
        now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
      if (log.type === "state" && log.status === "success") {
        this.logger.push(
          `<span class="text-gray-600">${now.getDate()}.${now.getMonth()}.${now.getFullYear()}</span><span class="text-gray-600 pl-2">${nowHours}:${nowMinutes}# </span><span class="px-2 text-green-400">${record}</span> <span class="text-gray-600">${
            log.item.subject
          } ${log.item.date}</span></span>`
        );
      }
      if (log.type === "state" && log.status === "register") {
        this.logger.push(
          `<span class="text-gray-600">${now.getDate()}.${now.getMonth()}.${now.getFullYear()}</span><span class="text-gray-600 pl-2">${nowHours}:${nowMinutes}# </span><span class="px-2 text-yellow-500">${record}</span> <span class="text-gray-600">${
            log.item.subject
          } ${log.item.date}</span></span>`
        );
      }
      if (log.type === "state" && log.status === "fail") {
        this.logger.push(
          `<span class="text-gray-600">${now.getDate()}.${now.getMonth()}.${now.getFullYear()}</span><span class="text-gray-600 pl-2">${nowHours}:${nowMinutes}# </span><span class="px-2 text-red-400">${record}</span><span class="text-gray-600">${
            log.item.subject
          } ${log.item.date}</span></span>`
        );
      }
      if (log.type === "state" && log.status === "error") {
        this.logger.push(
          `<span class="text-gray-600">${now.getDate()}.${now.getMonth()}.${now.getFullYear()}</span><span class="text-gray-600 pl-2">${nowHours}:${nowMinutes}# </span><span class="px-2 text-red-600">${record}</span><span class="text-gray-600">(kontaktuj emailem)</span></span>`
        );
      }
      if (log.type === "sys") {
        this.logger.push(
          `<span class="text-gray-600">${now.getDate()}.${now.getMonth()}.${now.getFullYear()}</span><span class="text-gray-600 pl-2">${nowHours}:${nowMinutes}# </span><span class="px-2 text-blue-400">${record}</span></span>`
        );
      }
    },
    check() {
      ipcRenderer.send("checkTerm", {
        nickname: this.nickname,
        password: this.password,
        minutes: this.minutes,
        selectedSubject: this.selectedSubject,
        selectedTerm: this.selectedTerm
      });
    },
    registerTerm() {
      ipcRenderer.send("registerTerm", {
        nickname: this.nickname,
        password: this.password,
        minutes: this.minutes,
        selectedSubject: this.selectedSubject,
        selectedTerm: this.selectedTerm
      });
    },
    isActive: function(menuItem) {
      return this.activeItem === menuItem;
    },
    setActive: function(menuItem) {
      this.activeItem = menuItem;
      this.currentView = menuItem;
    },
    activateLoading() {
      this.loading = true;
    }
  },
  forceRerenderTermKey() {
    this.termKey += 1;
  },
  computed: {}
};
</script>

<style>
#logo {
  height: auto;
  width: 250px;
  margin-right: 10px;
}

.title #title {
  color: #eeeeee;
  font-size: 26px;
  font-family: museo-sans-rounded, sans-serif !important;
}

#menuLabel {
  color: #616161;
  font-size: 14px;
}

.active {
  background: hsla(0, 0%, 100%, 0.08);
}
.v-navigation-drawer__border {
  display: none;
}

#app > div > aside > hr {
  display: none;
}

h1 {
  margin: 25px;
}

.lds-ring {
  display: inline-block;
  position: relative;
  width: 40px;
  height: 40px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 40px;
  height: 40px;
  border: 6px solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.scale {
  transform: scale(0.5);
}
</style>
