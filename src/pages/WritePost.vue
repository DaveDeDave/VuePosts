<template>
  <Error500 v-if="error500"/>
  <div class="px-3 pt-4 pb-5" v-else-if="!error500">
    <div class="card mb-4 mb-md-0">
      <div class="d-flex justify-content-start ms-3 mt-3">
        <router-link type="button" class="btn btn-dark-green" to="/dashboard"><i class="fas fa-arrow-left"></i></router-link>
        <div class="d-flex col justify-content-center">
          <p class="h4 fw-bold my-auto">{{ $t('message.dashboard.writePost') }}</p>
        </div>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <input class="form-control form-control-green mb-2" id="title" :placeholder="$t('message.writePost.insertTitle')" v-model="title">
          <Editor :modelValue="content" v-model="content"/>
        </div>
        <div class="alert alert-danger" v-if="errorPost">
          {{ $t('message.errors.emptyFields') }}
        </div>
        <button class="btn btn-dark-green mb-1" @click="createPost()">{{ $t('message.writePost.publish') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
  import Editor from './components/TipTap/Editor.vue';
  import Error500 from './Error500.vue';
  import axios from 'axios';

  export default {
    components: {
      Editor,
      Error500
    },
    data() {
      return {
        title: '',
        content: '',
        errorPost: false,
        error500: false
      }
    },
    methods: {
      createPost() {
        axios.post('/api/post/new', {
          title: this.title,
          content: this.content
        }).then(response => this.$router.push('/dashboard'))
          .catch(e => {
            if(e.response.data.code == 'EmptyFields') {
              this.errorPost = true;
            } else if(e.response.data.code == 'AuthorizationRequired') {
              this.$router.push('/');
            } else {
              this.error500 = true;
            }
          });
      }
    }
  };
</script>