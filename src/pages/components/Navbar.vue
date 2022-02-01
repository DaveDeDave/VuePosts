<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-green">
    <div class="container-fluid my-1 mx-lg-4">
      <router-link class="navbar-brand fw-bold m-0" to="/">
        <p class="m-0 fs-4"><img src="/img/logo.png" width="40"> Posts </p>
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mx-lg-auto">
          <li v-if="!logged" class="nav-item me-3">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li v-else class="nav-item me-3">
            <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
          </li>
          <li class="nav-item me-3">
            <router-link class="nav-link"  to="/posts">Posts</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
        </ul>
        <ul v-if="!logged" class="navbar-nav">
          <li class="nav-item d-none d-lg-block">
            <button class="btn btn-dark-green fw-bold" type="btn"  data-bs-toggle="modal" data-bs-target="#join">{{ $t('message.home.join') }}</button>
          </li>
          <li class="nav-item d-md-block d-lg-none">
            <div class="dropdown-divider"></div>
            <a class="nav-link" data-bs-toggle="modal" data-bs-target="#join">{{ $t('message.home.join') }}</a>
          </li>
        </ul>
        <ul v-else class="navbar-nav">
          <li class="nav-item d-none d-lg-block">
            <a class="btn btn-dark-green fw-bold" type="btn" @click="logout()">{{ $t('message.logout') }}</a>
          </li>
          <li class="nav-item d-md-block d-lg-none">
            <div class="dropdown-divider"></div>
            <a class="nav-link" @click="logout()">{{ $t('message.logout') }}</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div v-if="$route.path == '/'" class="bg-green text-center py-5">
    <img class="mb-3" src="/img/logo.png" width="200">
    <p class="h3 text-light mb-3">Client-Side Rendering</p>
    <a class="btn btn-dark-green fw-bold" type="btn" href="#getStarted">{{ $t('message.home.getStarted') }}</a>
  </div>
  <div v-if="$route.path == '/posts'" class="bg-green text-light">
    <div class="input-group pb-2 px-3 container mx-auto mb-2">
      <input id="search" class="form-control form-control-light form-control-no-shadow input-search bg-light ps-4" v-model="q" @keyup.enter="search()" type="text" :placeholder="$t('message.search')" style="border-radius: 1.4rem 0 0 1.4rem">
      <div id="btnGroupAddon" class="input-group-text btn-search bg-light" @click="search()"><i class="fas fa-search"></i></div>
    </div>
  </div>
  <div class="pt-3 pb-4 bg-dark-green"></div>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        logged: document.cookie ? document.cookie.split('; ').find(c => c.split('=')[0] == 'au') != undefined : false,
        q: ''
      }
    },
    beforeUpdate() {
      this.logged = document.cookie ? document.cookie.split('; ').find(c => c.split('=')[0] == 'au') != undefined : false;
    },
    methods: {
      search() {
        this.$router.push(`/posts?search=${this.q}`);
        this.q = '';
      },
      logout() {
        document.cookie = 'au=;max-age=0';
        this.$router.go(`/`);
      }
    }
  }
</script>