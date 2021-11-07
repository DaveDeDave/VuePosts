<template>
  <Container class="text-center">
    <p class="h4 h3-xs text-green mb-3">{{ $t('message.home.welcomeTitle') }}</p>
    <p class="w-sm-75 mx-auto mb-4">{{ $t('message.home.welcomeDescription') }}</p> 
    <div class="row">
      <div class="col-md-4">
        <div class="row">
          <div class="col-2">
            <i class="fab fa-js-square text-green"></i>
          </div>
          <div class="col text-start">
            <p class="h5 text-green">{{ $t('message.home.feature.javascript') }}</p>
            <p>{{ $t('message.home.feature.javascriptDescription') }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="row">
          <div class="col-2">
            <i class="fas fa-laptop text-green"></i>
          </div>
          <div class="col text-start">
            <p class="h5 text-green">{{ $t('message.home.feature.clientSide') }}</p>
            <p>{{ $t('message.home.feature.clientSideDescription') }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="row">
          <div class="col-2">
            <i class="fas fa-tachometer-alt text-green"></i>
          </div>
          <div class="col text-start">
            <p class="h5 text-green">{{ $t('message.home.feature.fast') }}</p>
            <p>{{ $t('message.home.feature.fastDescription') }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="row">
          <div class="col-2">
            <i class="fas fa-user-check text-green"></i>
          </div>
          <div class="col text-start">
            <p class="h5 text-green">{{ $t('message.home.feature.programmerFriendly') }}</p>
            <p>{{ $t('message.home.feature.programmerFriendlyDescription') }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="row">
          <div class="col-2">
            <i class="fas fa-code text-green"></i>
          </div>
          <div class="col text-start">
            <p class="h5 text-green">{{ $t('message.home.feature.debugging') }}</p>
            <p>{{ $t('message.home.feature.debuggingDescription') }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="row">
          <div class="col-2">
            <i class="fas fa-book text-green"></i>
          </div>
          <div class="col text-start">
            <p class="h5 text-green">{{ $t('message.home.feature.other') }}</p>
            <p>{{ $t('message.home.feature.otherDescription') }}</p>
          </div>
        </div>
      </div>
    </div>
  </Container>
  <Container id="getStarted" class="bg-green text-light text-center">
    <p class="h4 h3-xs mb-3">{{ $t('message.home.getStarted') }}</p>
    <div class="bg-light text-green w-lg-50 w-md-75 w-100 mx-auto py-3 rounded shadow mb-5">
      <p class="mb-3">{{ $t('message.home.getStartedDescription') }}</p>
      <ul class="list-unstyled">
        <li><i class="fas fa-angle-right"></i> {{ $t('message.home.getStartedLi1') }}</li>
        <li><i class="fas fa-angle-right"></i> {{ $t('message.home.getStartedLi2') }}</li>
        <li><i class="fas fa-angle-right"></i> {{ $t('message.home.getStartedLi3') }}</li>
        <li><i class="fas fa-angle-right"></i> {{ $t('message.home.getStartedLi4') }}</li>
      </ul>
    </div>
    <p class="h4 h3-xs mb-3">{{ $t('message.home.whatCanIDo') }}</p>
    <div class="bg-light text-green w-lg-50 w-md-75 w-100 mx-auto py-3 rounded shadow mb-5">
      <p class="mb-3">{{ $t('message.home.whatCanIDoDescription') }}</p>
      <ul class="list-unstyled">
        <li><i class="fas fa-angle-right"></i> {{ $t('message.home.whatCanIDoLi1') }}</li>
        <li><i class="fas fa-angle-right"></i> {{ $t('message.home.whatCanIDoLi2') }}</li>
        <li><i class="fas fa-angle-right"></i> {{ $t('message.home.whatCanIDoLi3') }}</li>
        <li><i class="fas fa-angle-right"></i> {{ $t('message.home.whatCanIDoLi4') }}</li>
      </ul>
    </div>
    <button class="btn btn-lg btn-light shadow" type="btn" data-bs-toggle="modal" data-bs-target="#join">{{ $t('message.home.joinNow') }}</button>
  </Container>
  <Container class="text-center">
    <p class="h4 h3-xs mb-3">{{ $t('message.home.developer') }}</p>
    <div class="row">
        <div class="col-auto">
            <img class="border border-5 border-dark rounded-circle" width="125" src="/img/myLogo.png" alt="">
        </div>
        <div class="col my-auto text-start">
          <router-link class="link-success text-decoration-none" to="/about#developer">DaveDeDave</router-link>
        </div>
    </div>
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