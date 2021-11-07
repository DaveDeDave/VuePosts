<template>
  <Error500 v-if="error500"/>
  <NotFound v-else-if="error404"/>
  <div v-else-if="!loading">
    <div class="px-3 pt-4 pb-5" v-if="!privateAccount">
      <div class="card mb-4">
        <div class="card-body text-center">
          <img src="/img/avatar.png" alt="avatar" class="rounded-circle img-fluid" width="150">
          <h5 class="my-3">{{ username }}</h5>
          <p class="text-muted mb-4" v-if="job">{{ job }}</p>
        </div>
      </div>
      <div class="card mb-4">
        <div class="card-body">
          <div v-if="fullname" class="row">
            <div class="col-sm-3">
              <p class="mb-0">{{ $t('message.dashboard.fullname') }}</p>
            </div>
            <div class="col-sm-9">
              <p class="text-muted mb-0">{{ fullname }}</p>
            </div>
          </div>
          <hr v-if="fullname">
          <div v-if="email" class="row">
            <div class="col-sm-3">
              <p class="mb-0">{{ $t('message.dashboard.email') }}</p>
            </div>
            <div class="col-sm-9">
              <p class="text-muted mb-0">{{ email }}</p>
            </div>
          </div>
          <hr v-if="email">
          <div v-if="address" class="row">
            <div class="col-sm-3">
              <p class="mb-0">{{ $t('message.dashboard.address') }}</p>
            </div>
            <div class="col-sm-9">
              <p class="text-muted mb-0">{{ address }}</p>
            </div>
          </div>
          <hr v-if="address">
          <div class="row">
            <div class="col-sm-3">
              <p class="mb-0">{{ $t('message.dashboard.registrationDate') }}</p>
            </div>
            <div class="col-sm-9">
              <p class="text-muted mb-0">{{ registrationDate }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="card mb-4 mb-md-0">
        <div class="card-body">
          <p class="mb-3">{{ $t('message.dashboard.statistics') }}</p>
          <p class="mb-1" style="font-size: .77rem;">{{ $t('message.dashboard.posts') }}</p>
          <div class="progress">
            <div class="progress-bar bg-green" role="progressbar" style="width: 100%">{{ numberOfPosts }}</div>
          </div>
          <p class="mt-4 mb-1" style="font-size: .77rem;">{{ $t('message.dashboard.comments') }}</p>
          <div class="progress rounded">
            <div class="progress-bar bg-green" role="progressbar" style="width: 100%">{{ numberOfComments }}</div>
          </div>
          <p class="mt-4 mb-1" style="font-size: .77rem;">{{ $t('message.dashboard.registrationDate') }}</p>
          <div class="progress rounded mb-3">
            <div class="progress-bar bg-green" role="progressbar" style="width: 100%" aria-valuenow="89" aria-valuemin="0" aria-valuemax="100">
              <p class="mb-0" v-if="yearsSinceRegistration == 0">{{ $t('message.dashboard.thisYear') }}</p>
              <p class="mb-0" v-else>{{ $t('message.dashboard.yearsAgo', yearsSinceRegistration) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  <div class="px-3 pt-4 pb-5" v-else>
    <div class="card mb-4">
      <div class="card-body text-center">
        <div class="text-center py-4">
          <img class="img-fluid mb-3" src="/img/private.png" width="150">
          <p class="fs-5 text-green mb-1">{{ $t('message.dashboard.privateProfileTitle') }}</p>
          <p class="text-muted">{{ $t('message.dashboard.privateProfileDescription') }}</p>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  import NotFound from './NotFound.vue';
  import Error500 from './Error500.vue';

  export default {
    components: {
      NotFound,
      Error500
    },
    data() {
      return {
        privateAccount: false,
        username: '',
        name: '',
        surname: '',
        email: '',
        job: '',
        address: '',
        registrationDate: '',
        yearsSinceRegistration: 0,
        numberOfPosts: 0,
        numberOfComments: 0,
        loading: true,
        error404: false,
        error500: false
      }
    },
    created() {
      this.getUserInfo().then(() => {
        this.loading = false;
      });
    },
    methods: {
      async getUserInfo() {
        await fetch(`/api/user/info/${this.$route.params.username}`)
          .then(async response => {
            let r = await response.json();

            if(response.status != 200) {
              throw new Error(r.code);
            }
                
            return r;
          }).then(response => {
            if(response.redirect) {
              return this.$router.replace('/dashboard');
            }

            this.privateAccount = response.privateAccount
            if(!this.privateAccount) {
              this.username = response.username;
              this.name = response.name;
              this.surname = response.surname;
              this.email = response.email;
              this.job = response.job;
              this.address = response.address;
              this.registrationDate = response.registrationDate;
              this.yearsSinceRegistration = this.getYears(response.registrationDate);
              this.numberOfPosts = response.nPosts;
              this.numberOfComments = response.nComments;
            }
          }).catch(e => {
            if(e.message == 'NotFound') { 
              this.error404 = true;
            } else {
              this.error500 = true;
            }
          });
      },
      getYears(registrationDate) {
        let registrationYear = new Date(registrationDate).getFullYear();
        let currentYear = (new Date()).getFullYear();
        
        return currentYear - registrationYear;
      }
    },
    computed: {
      fullname() {
        const fullname = `${this.name} ${this.surname}`;
        return fullname.trim();
      }
    },
  };
</script>