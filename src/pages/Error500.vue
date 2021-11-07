<template>
  <Container class="text-center my-auto">
    <img class="img-fluid mb-1" src="/img/500.png" width="150">
    <p class="fs-1 text-green mb-0">500</p>
    <p class="fs-5 text-green mb-1">{{ $t('message.error500.title') }}</p>
    <p class="text-muted">{{ $t('message.error500.description') }}</p>
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