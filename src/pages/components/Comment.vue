<template>
  <div id="comments">
    <div class="card post mx-auto mb-2">
      <div class="card-body row p-0 ms-0 me-0 ps-0 pb-0">
        <div class="col-auto p-1 bg-green border-radius-post"></div>
        <div class="col p-2 mx-3">
          <div class="row">
            <div class="col">
              <p class="fw-light mb-1"><small><img class="rounded-circle" src="/img/avatar.png" width="22"> • <router-link class="text-decoration-none link-success" :to="`/user/${author}`">{{ author }}</router-link></small></p>
            </div>
            <div class="col-auto text-end" v-if="owner">
              <a class="link-danger" data-bs-toggle="modal" :data-bs-target="`#deleteComment-${id}`">
                <i class="fas fa-times fs-5 align-bottom"></i>
              </a>
            </div>
          </div>
          <div class="postContent">
            <Editor :modelValue="content" :editable="false" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Delete comment modal -->
  <div class="modal fade text-dark text-center" :id="`deleteComment-${id}`" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <div class="col p-0"></div>
          <div class="col-auto p-0 text-center"><p class="fs-5 mb-0 text-green">{{ $t('message.posts.deletePostConfirm') }}</p></div>
          <div class="col p-0 text-end"><button type="button" class="btn-close mb-auto" data-bs-dismiss="modal"></button></div>
        </div>
        <div class="modal-body">
          <div class="col-12 text-center">
            <div class="alert alert-danger" v-if="errorDelete">
              <p class="mb-0" v-if="errorDelete == 'NotFound'">{{ $t('message.errors.deletePost.notFound') }}</p>
              <p class="mb-0" v-else-if="errorDelete == 'AuthorizationRequired'">{{ $t('message.errors.deletePost.authorizationRequired') }}</p>
              <p class="mb-0" v-else-if="errorDelete == 'UnknownError'">{{ $t('message.errors.unknownError') }}</p>
            </div>
            <button type="submit" class="btn btn-dark-green text-light me-2" @click="deleteComment()">{{ $t('message.posts.confirm') }}</button>
            <button type="submit" class="btn btn-light me-2" data-bs-dismiss="modal">{{ $t('message.posts.cancel') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Editor from './TipTap/Editor.vue';
  import axios from 'axios';

  export default {
    components: {
      Editor
    },
    props: {
      id: Number,
      author: String,
      content: String,
      owner: Boolean,
      lastPageComment: Boolean
    },
    data() {
      return {
        errorDelete: '',
        deleteModal: null
      }
    },
    mounted() {
      this.deleteModal = new bootstrap.Modal(document.getElementById(`deleteComment-${this.id}`));
    },
    beforeUnmount() {
      if(this.deleteModal) {
        this.deleteModal.hide();
      }
    },
    methods: {
      deleteComment() {
        axios.post('/api/comment/delete', {
          id: this.id
        }).then(response => {
          if(this.lastPageComment) {
            this.deleteModal.hide();
            let route = `/post/${this.$route.params.id}?page=${this.$route.query.page-1}`;
            this.$router.push(route);
          } else {
            this.$router.go(0);
          }
        }).catch(e => {
          if(e.response.data.code == 'NotFound' || e.response.data.code == 'AuthorizationRequired') {
            this.errorDelete = e.response.data.code;
          } else {
            this.errorDelete = 'UnknownError';
          }
        });
      }
    }
  }
</script>