<template>
  <Error500 v-if="error500"/>
  <div class="px-3 pt-4 pb-5" v-else-if="!loading">
    <div class="card mb-4 mb-md-0">
      <div class="d-flex justify-content-start ms-3 mt-3">
        <router-link type="button" class="btn btn-dark-green" to="/dashboard"><i class="fas fa-arrow-left"></i></router-link>
        <div class="d-flex col justify-content-center">
          <p class="h4 fw-bold my-auto">{{ $t('message.dashboard.editAccount') }}</p>
        </div>
      </div>
      <div class="card-body">
        <div class="row m-0">
          <div class="col-md p-0 me-3 mb-3 mb-md-1">
            <div class="mb-3">
              <label for="name" class="form-label">{{ $t('message.editAccount.name') }}</label>
              <input type="text" class="form-control form-control-green" id="name" placeholder="" v-model="name">
            </div>
            <div class="mb-3">
              <label for="surname" class="form-label">{{ $t('message.editAccount.surname') }}</label>
              <input type="text" class="form-control form-control-green" id="surname" placeholder="" v-model="surname">
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">{{ $t('message.editAccount.email') }}</label>
              <input type="text" class="form-control form-control-green" id="email" placeholder="" v-model="email">
            </div>
            <div class="mb-3">
              <label for="job" class="form-label">{{ $t('message.editAccount.job') }}</label>
              <input type="text" class="form-control form-control-green" id="job" placeholder="" v-model="job">
            </div>
            <div class="mb-3">
              <label for="address" class="form-label">{{ $t('message.editAccount.address') }}</label>
              <input type="text" class="form-control form-control-green" id="address" placeholder="" v-model="address">
            </div>
            <div class="mb-3 form-check form-switch">
              <input class="form-check-input checkbox-green" type="checkbox" id="privateAccount">
              <label class="form-check-label" for="privateAccount">{{ $t('message.editAccount.privateAccount') }}</label>
            </div>
            <div class="alert alert-success" v-if="updateInfoSuccess">
              {{ $t('message.editAccount.successInfo') }}
            </div>
            <button class="btn btn-dark-green" @click="updateUserInfo()">{{ $t('message.editAccount.saveChanges') }}</button>
          </div>
          <div class="col-md p-0">
            <div class="mb-3">
              <label for="oldPassword" class="form-label">{{ $t('message.editAccount.oldPassword') }}</label>
              <input type="password" class="form-control form-control-green" id="oldPassword" placeholder="" v-model="oldPassword">
            </div>
            <div class="mb-3">
              <label for="newPassword" class="form-label">{{ $t('message.editAccount.newPassword') }}</label>
              <input type="password" class="form-control form-control-green" id="newPassword" placeholder="" v-model="newPassword">
            </div>
            <div class="mb-3">
              <label for="newPasswordCheck" class="form-label">{{ $t('message.editAccount.newPasswordCheck') }}</label>
              <input type="password" class="form-control form-control-green" id="newPasswordConfirm" placeholder="" v-model="newPasswordCheck">
            </div>
            <div class="alert alert-success" v-if="updatePasswordSuccess">
              {{ $t('message.editAccount.successPassword') }}
            </div>
            <div class="alert alert-danger" v-if="updatePasswordFailure">
              <p class="mb-0" v-if="updatePasswordFailure == 'EmptyFields'">{{ $t('message.errors.emptyFields') }}</p>
              <p class="mb-0" v-else-if="updatePasswordFailure == 'DifferentPasswords'">{{ $t('message.errors.differentPasswords') }}</p>
              <p class="mb-0" v-else-if="updatePasswordFailure == 'WeakPassword'">{{ $t('message.errors.weakPassword') }}</p>
              <p class="mb-0" v-else-if="updatePasswordFailure == 'WrongCredentials'">{{ $t('message.errors.wrongCredentials') }}</p>
            </div>
            <button class="btn btn-dark-green mb-1" @click="updateUserPassword()">{{ $t('message.editAccount.changePassword') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Error500 from './Error500.vue';

  export default {
    components: {
      Error500
    },
    data() {
      return {
        name: '',
        surname: '',
        email: '',
        job: '',
        address: '',
        oldPassword: '',
        newPassword: '',
        newPasswordCheck: '',
        updateInfoSuccess: false,
        updatePasswordSuccess: false,
        updatePasswordFailure: '',
        loading: true,
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
        fetch('/api/user/info').then(async response => {
          let r = await response.json();

          if(response.status != 200) {
            throw new Error(r.code);
          }
              
          return r;
        }).then(response => {
          this.name = response.name;
          this.surname = response.surname;
          this.email = response.email;
          this.job = response.job;
          this.address = response.address;
          document.getElementById("privateAccount").checked = response.privateAccount;
        }).catch(e => {
          if(e.message == 'AuthorizationRequired') {
            this.$router.push('/');
          } else {
            this.error500 = true;
          }
        });
      },
      updateUserInfo() {
        fetch('/api/user/info/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify({
            name: this.name,
            surname: this.surname,
            email: this.email,
            job: this.job,
            address: this.address,
            privateAccount: document.getElementById("privateAccount").checked
          })
        }).then(async response => {
          let r = await response.json();

          if(response.status != 200) {
            throw new Error(r);
          }

          return r;
        }).then(response => {
          this.updatePasswordSuccess = this.updatePasswordFailure = '';
          this.updateInfoSuccess = true;
        }).catch(e => {
          if(e.message == 'AuthorizationRequired') {
            this.$router.push('/');
          } else {
            this.error500 = true;
          }
        });
      },
      updateUserPassword() {
        fetch('/api/user/password/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify({
            oldPassword: this.oldPassword,
            newPassword: this.newPassword,
            newPasswordCheck: this.newPasswordCheck
          })
        }).then(async response => {
            let r = await response.json();

            if(response.status != 200) {
              throw new Error(r.code);
            }

            return r;
          }).then(response => {
            this.updateInfoSuccess = this.updatePasswordFailure = '';
            this.updatePasswordSuccess = true;
          }).catch(e => {
            this.updateInfoSuccess = this.updatePasswordSuccess = '';
            if(e.message == 'EmptyFields' || e.message == 'DifferentPasswords' || e.message == 'WeakPassword' || e.message == 'WrongCredentials') {
              this.updatePasswordFailure = e.message;
            } else if(e.message == 'AuthorizationRequired') {
              this.$router.push('/');
            } else {
              this.error500 = true;
            }
          });
      }
    }
  };
</script>