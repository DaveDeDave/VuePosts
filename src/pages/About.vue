<template>
  <div class="container pt-4 pb-4">
    <div class="card post mx-auto mb-2 shadow-sm">
      <div class="card-body row p-0 ms-0 me-0 ps-0 pb-0">
        <div class="col-auto p-1 bg-green border-radius-post"></div>
        <div class="col p-2 mx-3">
          <div class="py-2">
            <p class="h3 text-green text-center">{{ $t('message.about.questionsAnswers') }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="card post mx-auto mb-2 shadow-sm">
      <div class="card-body row p-0 ms-0 me-0 ps-0 pb-0">
        <div class="col-auto p-1 bg-green border-radius-post"></div>
        <div class="col p-2 mx-3">
          <div class="py-2">
            <p class="h4 text-green mb-2">{{ $t('message.about.why') }}</p>
            <p><i class="fas fa-angle-right"></i> {{ $t('message.about.whyAnswer') }}</p>
          </div>
        </div>
      </div>
    </div>
    <div id="technologies" class="card post mx-auto mb-2 shadow-sm">
      <div class="card-body row p-0 ms-0 me-0 ps-0 pb-0">
        <div class="col-auto p-1 bg-green border-radius-post"></div>
        <div class="col p-2 mx-3">
          <div class="py-2">
            <p class="h4 text-green mb-2">{{ $t('message.about.how') }}</p>
            <p class="mb-4">
              <i class="fas fa-angle-right"></i> {{ $t('message.about.howAnswerServer') }}
              <ul class="mb-0">
                <li>{{ $t('message.about.howServer1') }}</li>
                <li>{{ $t('message.about.howServer2') }}</li>
                <li>{{ $t('message.about.howServer3') }}</li>
                <li>{{ $t('message.about.howServer4') }}</li>
              </ul>
              <i class="fas fa-angle-right"></i> {{ $t('message.about.howAnswerClient') }}
              <ul class="mb-0">
                <li>{{ $t('message.about.howClient1') }}</li>
                <li>{{ $t('message.about.howClient2') }}</li>
                <li>{{ $t('message.about.howClient3') }}</li>
                <li>{{ $t('message.about.howClient4') }}</li>
              </ul>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div id="developer" class="card post mx-auto mb-2 shadow-sm">
      <div class="card-body row p-0 ms-0 me-0 ps-0 pb-0">
        <div class="col-auto p-1 bg-green border-radius-post"></div>
        <div class="row">
          <div class="col-12 col-md-auto my-auto py-2 text-center">
            <img class="border border-5 border-dark rounded-circle" width="125" src="/img/myLogo.png" alt="">
          </div>
          <div class="col p-2 mx-3 pb-4">
            <div class="py-2">
              <p class="h3 text-center mb-3">{{ $t('message.home.developer') }}</p>
              <div class="row">
                <div class="col my-auto text-start">
                  <p class="mb-0"><a class="link-success text-decoration-none" href="https://www.github.com/DaveDeDave" target="_blank">DaveDeDave</a>
                  {{ $t('message.about.developerDescription') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>