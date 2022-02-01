<template>
  <!-- Login and registraion modals -->
  <div class="modal fade text-dark text-center" id="join" tabindex="-1">
    <div class="modal-dialog">
      <swiper
        :slides-per-view="1"
        :effect="'flip'"
        v-bind:allowTouchMove="false"
        id="mySwiper"
      >
        <swiper-slide>
          <div class="modal-content">
            <div class="modal-header border-0 pb-0">
              <button type="button" class="btn-close mb-auto" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body pt-0">
              <img class="mb-3 ms-auto pt-2" src="/img/logo.png" width="100">
              <p class="fs-5 text-green">Login</p>
              <div class="form-floating mb-3">
                <input type="text" class="form-control form-control-green bg-transparent" id="loginUsername" placeholder="username" v-model="loginUsername" @keyup.enter="login()">
                <label for="loginUsername">Username</label>
              </div>
              <div class="form-floating mb-3">
                <input type="password" class="form-control form-control-green  bg-transparent" id="loginPassword" placeholder="Password" v-model="loginPassword" @keyup.enter="login()">
                <label for="loginPassword">Password</label>
              </div>
              <div class="alert alert-dark-green" v-if="loginResponseSuccess">
                {{ loginResponseSuccess }}
              </div>
              <div class="alert alert-danger" v-if="loginResponseError">
                <p class="mb-0" v-if="loginResponseError == 'EmptyFields'">{{ $t('message.errors.emptyFields') }}</p>
                <p class="mb-0" v-else-if="loginResponseError == 'WrongCredentials'">{{ $t('message.errors.wrongCredentials') }}</p>
                <p class="mb-0" v-else-if="loginResponseError == 'UnknownError'">{{ $t('message.errors.unknownError') }}</p>
              </div>
              <div class="col-12 text-start">
                <button type="submit" class="btn btn-dark-green text-light me-2" @click="login()">Login</button>
                <button type="submit" class="btn btn-light" @click="resetRegistrationInputsAndAlerts(); swiper.slideNext(400, true)">{{ $t('message.home.switchRegistration') }}</button>
              </div>
            </div>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="modal-content bg-green text-light">
            <div class="modal-header border-0 pb-0">
              <button type="button" class="btn-close btn-close-white mb-auto" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body pt-0">
              <img class="mb-3 ms-auto pt-2" src="/img/logo.png" width="100">
              <p class="fs-5">{{ $t('message.registration') }}</p>
              <div class="form-floating mb-3">
                <input type="text" class="form-control form-control-light bg-transparent border-light text-light" id="registerUsername" placeholder="username" v-model="registrationUsername" @keyup.enter="register()">
                <label for="registerUsername">Username</label>
              </div>
              <div class="form-floating mb-3">
                <input type="password" class="form-control form-control-light bg-transparent border-light text-light" id="registerPassword" placeholder="Password" v-model="registrationPassword" @keyup.enter="register()">
                <label for="registerPassword">Password</label>
              </div>
              <div class="form-floating mb-3">
                <input type="password" class="form-control form-control-light bg-transparent border-light text-light" id="registerPasswordCheck" placeholder="Password" v-model="registrationPasswordCheck" @keyup.enter="register()">
                <label for="registerPasswordCheck">{{ $t('message.home.repeatPassword') }}</label>
              </div>
              <div class="alert alert-success" v-if="registrationResponseSuccess">
                {{ registrationResponseSuccess }}
              </div>
              <div class="alert alert-danger" v-if="registrationResponseError">
                <p class="mb-0" v-if="registrationResponseError == 'EmptyFields'">{{ $t('message.errors.emptyFields') }}</p>
                <p class="mb-0" v-else-if="registrationResponseError == 'DifferentPasswords'">{{ $t('message.errors.differentPasswords') }}</p>
                <p class="mb-0" v-else-if="registrationResponseError == 'WeakPassword'">{{ $t('message.errors.weakPassword') }}</p>
                <p class="mb-0" v-else-if="registrationResponseError == 'UserAlreadyExists'">{{ $t('message.errors.userAlreadyExists') }}</p>
                <p class="mb-0" v-else-if="registrationResponseError == 'UnknownError'">{{ $t('message.errors.unknownError') }}</p>              
              </div>
              <div class="col-12 text-start">
                <button type="submit" class="btn btn-light me-2" @click="register()">{{ $t('message.home.register') }}</button>
                <button type="submit" class="btn btn-dark-green text-light" @click="resetLoginInputsAndAlerts(); swiper.slidePrev(400, true)">{{ $t('message.home.switchLogin') }}</button>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import SwiperCore, { EffectFlip } from 'swiper';
  import axios from 'axios';

  import 'swiper/css';
  import 'swiper/css/effect-flip';

  SwiperCore.use([EffectFlip]);

  export default {
    components: {
      Swiper,
      SwiperSlide
    },
    data() {
      return {
        flip: false,
        loginUsername: '',
        loginPassword: '',
        registrationUsername: '',
        registrationPassword: '',
        registrationPasswordCheck: '',
        loginResponseSuccess: '',
        loginResponseError: '',
        registrationResponseSuccess: '',
        registrationResponseError: '',
        joinModal: null
      }
    },
    mounted() {
      this.joinModal = new bootstrap.Modal(document.getElementById('join'));
      this.swiper = document.getElementById('mySwiper').swiper;
      document.getElementById('join').addEventListener('hidden.bs.modal', () => {
        this.resetLoginInputsAndAlerts()
        this.resetRegistrationInputsAndAlerts()
      });
    },
    methods: {
      login() {
        axios.post('/api/user/login', {
          username: this.loginUsername,
          password: this.loginPassword 
        }).then(response => {
          this.loginResponseError = this.registrationResponseSuccess = this.registrationResponseError = '';
          this.loginResponseSuccess = response.data.message;
          this.joinModal.hide();
          this.$router.push('/dashboard');
        }).catch(e => {
          this.loginResponseSuccess = this.registrationResponseSuccess = this.registrationResponseError = '';
          if(e.response.data.code == 'EmptyFields' || e.response.data.code == 'WrongCredentials') {
            this.loginResponseError = e.response.data.code;
          } else {
            this.loginResponseError = 'UnknownError';
          }
        });
      },
      register() {
        axios.post('/api/user/register', {
          username: this.registrationUsername,
          password: this.registrationPassword,
          passwordCheck: this.registrationPasswordCheck
        }).then(response => {
          this.loginResponseSuccess = this.loginResponseError = this.registrationResponseError = '';
          this.registrationResponseSuccess = response.data.message;
          this.joinModal.hide();
          this.$router.push('/dashboard');
        }).catch(e => {
            this.loginResponseSuccess = this.loginResponseError = this.registrationResponseSuccess = '';
            if(e.response.data.code == 'EmptyFields' || e.response.data.code == 'DifferentPasswords' || e.response.data.code == 'WeakPassword' || e.response.data.code == 'UserAlreadyExists') {
              this.registrationResponseError = e.response.data.code;
            } else {
              this.registrationResponseError = 'UnknownError';
            }
        });
      },
      resetLoginInputsAndAlerts() {
        this.loginUsername = this.loginPassword = this.loginResponseSuccess = this.loginResponseError = '';
      },
      resetRegistrationInputsAndAlerts() {
        this.registrationUsername = this.registrationPassword = this.registrationPasswordCheck = this.registrationResponseSuccess = this.registrationResponseError = '';
      }
    }
  }
</script>