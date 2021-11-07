<template>
  <Container class="text-center my-auto">
    <img class="img-fluid mb-1" src="/img/404.png" width="150">
    <p class="fs-1 text-green mb-0">404</p>
    <p class="fs-5 text-green mb-1">{{ $t('message.notFound.title') }}</p>
    <p class="text-muted">{{ $t('message.notFound.description') }}</p>
  </Container>
</template>

<script>
  import Container from './components/Container.vue';

  export default {
    components: {
      Container
    }
  };
</script>