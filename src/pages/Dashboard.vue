<template>
  <Error500 v-if="error500"/>
  <div class="px-3 pt-4 pb-4" v-else-if="!loading">
    <div class="card mb-4">
      <div class="card-body text-center">
        <img src="/img/avatar.png" alt="avatar" class="rounded-circle img-fluid" width="150">
        <h5 class="my-3">{{ username }}</h5>
        <p class="text-muted mb-4" v-if="job">{{ job }}</p>
        <div class="d-flex justify-content-center mb-2">
          <router-link type="button" class="btn btn-dark-green" to="/dashboard/write">{{ $t('message.dashboard.writePost') }}</router-link>
          <router-link type="button" class="btn btn-outline-dark-green ms-1" to="/dashboard/edit">{{ $t('message.dashboard.editAccount') }}</router-link>
          <button type="button" class="btn btn-outline-danger ms-1" data-bs-toggle="modal" :data-bs-target="`#deleteAccount`">Delete Account</button>
        </div>
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
        <p class="mt-4 mb-1" style="font-size: .77rem;">{{ $t('message.dashboard.years') }}</p>
        <div class="progress rounded mb-3">
          <div class="progress-bar bg-green" role="progressbar" style="width: 100%" aria-valuenow="89" aria-valuemin="0" aria-valuemax="100">
            <p class="mb-0" v-if="yearsSinceRegistration == 0">{{ $t('message.dashboard.thisYear') }}</p>
            <p class="mb-0" v-else>{{ $t('message.dashboard.yearsAgo', yearsSinceRegistration) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Delete account modal -->
  <div class="modal fade text-dark text-center" id="deleteAccount" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <div class="col p-0"></div>
          <div class="col-auto p-0 text-center"><p class="fs-5 mb-0 text-green">{{ $t('message.dashboard.deleteAccount') }}</p></div>
          <div class="col p-0 text-end"><button type="button" class="btn-close mb-auto" data-bs-dismiss="modal"></button></div>
        </div>
        <div class="modal-body">
          <p>{{ $t('message.dashboard.deleteAccountConfirm') }}</p>
          <div class="d-flex justify-content-center mb-3">
              <input v-model="code1" id="code-1" class="form-control form-control-green border px-3 py-2 ms-2 me-2 fw-bold" type="text" style="width: 2.65rem" maxlength="1" disabled>
              <input v-model="code2" id="code-2" class="form-control form-control-green border px-3 py-2 me-2 fw-bold" type="text" style="width: 2.65rem" maxlength="1" disabled>
              <input v-model="code3" id="code-3" class="form-control form-control-green border px-3 py-2 me-2 fw-bold" type="text" style="width: 2.65rem" maxlength="1" disabled>
              <input v-model="code4" id="code-4" class="form-control form-control-green border px-3 py-2 me-2 fw-bold" type="text" style="width: 2.65rem" maxlength="1" disabled>
          </div>
          <div class="d-flex justify-content-center mb-3">                
              <input v-model="confirm1" id="confirm-1" class="form-control form-control-green border px-3 py-2 ms-2 me-2 fw-bold" type="text" style="width: 2.65rem" maxlength="1" @keypress="onlyNumber(0, $event)" @keyup="focus(2, $event)" >
              <input v-model="confirm2" id="confirm-2" class="form-control form-control-green border px-3 py-2 me-2 fw-bold" type="text" style="width: 2.65rem" maxlength="1" @keypress="onlyNumber(1, $event)" @keyup="focus(3, $event)">
              <input v-model="confirm3" id="confirm-3" class="form-control form-control-green border px-3 py-2 me-2 fw-bold" type="text" style="width: 2.65rem" maxlength="1" @keypress="onlyNumber(2, $event)" @keyup="focus(4, $event)">
              <input v-model="confirm4" id="confirm-4" class="form-control form-control-green border px-3 py-2 me-2 fw-bold" type="text" style="width: 2.65rem" maxlength="1" @keypress="onlyNumber(3, $event)">
          </div>
          <div class="col-12 text-center ">
            <div class="alert alert-danger" v-if="errorDelete">
              <p class="mb-0">{{ $t('message.errors.unknownError') }}</p>
            </div>
            <button :disabled="deletePin != confirmDeletePin" type="submit" class="btn btn-dark-green text-light me-2" @click="deleteAccount()">{{ $t('message.posts.confirm') }}</button>
            <button class="btn btn-light me-2" data-bs-dismiss="modal">{{ $t('message.posts.cancel') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Error500 from './Error500.vue';
  import axios from 'axios';

  export default {
    components: {
      Error500
    },
    data() {
      return {
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
        code1: '',
        code2: '',
        code3: '',
        code4: '',
        confirm1: '',
        confirm2: '',
        confirm3: '',
        confirm4: '',
        deleteModal: null,
        loading: true,
        error500: false,
        errorDelete: false
      }
    },
    created() {
      this.getUserInfo().then(() => {
        this.loading = false;
      });
    },
    mounted() {
      this.deleteModal = new bootstrap.Modal(document.getElementById('deleteAccount'));
      let deleteAccount = document.getElementById('deleteAccount');
      deleteAccount.addEventListener('show.bs.modal', () => {
        this.generatePin();
      });
      deleteAccount.addEventListener('hidden.bs.modal', () => {
        this.resetPin();
      });
    },
    beforeUnmount() {
      if(this.deleteModal) {
        this.deleteModal.hide();
      }
    },
    methods: {
      async getUserInfo() {
        axios.get('/api/user/info')
          .then(response => {
            this.username = response.data.username;
            this.name = response.data.name;
            this.surname = response.data.surname;
            this.email = response.data.email;
            this.job = response.data.job;
            this.address = response.data.address;
            this.registrationDate = response.data.registrationDate;
            this.yearsSinceRegistration = this.getYears(response.data.registrationDate);
            this.numberOfPosts = response.data.nPosts;
            this.numberOfComments = response.data.nComments;
          })
          .catch(e => {
            if(e.response.data.code == 'AuthorizationRequired') {
              this.$router.push('/');
            } else {
              this.error500 = true;
            }
          });
      },
      deleteAccount() {
        axios.post('/api/user/delete')
          .then(response => this.$router.push('/'))
          .catch(e => this.errorDelete = true);
      },
      getYears(registrationDate) {
        let registrationYear = new Date(registrationDate).getFullYear();
        let currentYear = (new Date()).getFullYear();
        
        return currentYear - registrationYear;
      },
      onlyNumber(n, $event) {
        if($event.key < '0' || $event.key > '9') {
          $event.preventDefault();
        }
      },
      focus(n, $event) {
        if($event.key >= '0' && $event.key <= '9') {
          document.getElementById(`confirm-${n}`).focus();
        }
      },
      getRandom(min, max) {
        return Math.trunc(Math.random() * (max - min) + min).toString();
      },
      generatePin() {
        this.code1 = this.getRandom(0, 9);
        this.code2 = this.getRandom(0, 9);
        this.code3 = this.getRandom(0, 9);
        this.code4 = this.getRandom(0, 9);
      },
      resetPin() {
        this.confirm1 = this.confirm2 = this.confirm3 = this.confirm4 = '';
      }
    },
    computed: {
      fullname() {
        const fullname = `${this.name} ${this.surname}`;
        return fullname.trim();
      },
      deletePin() {
        return this.code1 + this.code2 + this.code3 + this.code4;
      },
      confirmDeletePin() {
        return this.confirm1 + this.confirm2 + this.confirm3 + this.confirm4;
      }
    }
  };
</script>