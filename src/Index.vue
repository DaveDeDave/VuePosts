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

  export default {
    components: {
      Navbar,
      Footer,
      Modals,
    },
    created() {
      if(document.cookie) {
        let cookies = document.cookie.split('; ');
        let lang = cookies.find(c => c.split('=')[0] == 'lang');
        this.$i18n.locale = lang && ['en', 'it'].indexOf(lang.split('=')[1]) != -1 ? lang.split('=')[1] : 'en';
      }
    }
  };
</script>