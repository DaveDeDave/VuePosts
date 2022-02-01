<template>
  <Navbar/>
  <router-view></router-view>
  <Footer/>
  <Modals/>
</template>

<script>
  import Navbar from './pages/components/Navbar.vue';
  import Footer from './pages/components/Footer.vue';
  import Modals from './pages/components/Modals.vue';
  import axios from 'axios';

  export default {
    components: {
      Navbar,
      Footer,
      Modals,
    },
    created() {
      console.log("ricaricato");
      if(document.cookie) {
        let cookies = document.cookie.split('; ');
        let lang = cookies.find(c => c.split('=')[0] == 'lang');
        this.$i18n.locale = lang && ['en', 'it'].indexOf(lang.split('=')[1]) != -1 ? lang.split('=')[1] : 'en';
      }
      axios.get('/api/xsrf-token').then(response => {
        axios.defaults.headers.post['XSRF-TOKEN'] = response.data["xsrf-token"];
      });
    }
  };
</script>