<template>
  <footer class="mt-auto py-3 text-dark text-center border-top shadow">
    <div class="container text-dark">
      <div class="row">
        <div class="col-lg-4 mt-2">
          <ul class="nav justify-content-center">
            <li class="nav-item"><router-link to="/about" class="nav-link text-muted">About</router-link></li>
            <li class="nav-item"><router-link to="/about#technologies" class="nav-link text-muted">{{ $t('message.technologies') }}</router-link></li>
            <li class="nav-item"><router-link to="/about#developer" class="nav-link text-muted">{{ $t('message.home.developer') }}</router-link></li>
          </ul>
        </div>
        <div class="col-lg-4 mt-3">
          <p class="h5 fw-bold">VuePosts</p>
        </div>
        <div class="col-lg-4 mt-3">
          <p class="text-muted"><small>
            <img src="/img/italy.png" class="rounded shadow localeFlag" width="30" @click="changeLocale('it')">&nbsp;
            <img src="/img/usa.png" class="rounded shadow localeFlag" width="30" @click="changeLocale('en')">&nbsp;
            © 2021. All Rights Reserved.</small></p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
  export default {
    methods: {
      changeLocale(lang) {
        document.cookie = `lang=${lang}; path=/`;
        this.$i18n.locale = lang;
      }
    }
  }
</script>