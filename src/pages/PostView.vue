<template>
  <Error500 v-if="error500"/>
  <NotFound v-else-if="error404"/>
  <div class="container px-3 pt-4 pb-5" v-else-if="!loading">
    <Post
      :id="id"
      :author="author"
      :title="title"
      :content="content"
      :nComments="nComments"
      :owner="owner"
    />
    <Comment
        v-for="c in comments"
        :id="c.id"
        :author="c.author"
        :content="c.content"
        :owner="c.owner"
        :lastPageComment="lastPageComment"
    />
    <NavigationButtons 
      v-if="comments"
      :currentPage="currentPage" 
      :totalPages="totalPages" 
      :to="`/post/${id}`"/>
    <div class="w-md-50 mx-auto mb-2" id="writeComment" v-if="logged">
      <Editor class="rounded bg-white" :modelValue="comment" v-model="comment"/>
      <div class="alert alert-danger mt-2 mb-0" v-if="commentFailure">
        <p class="mb-0" v-if="commentFailure == 'EmptyFields'">{{ $t('message.errors.emptyFields') }}</p>
        <p class="mb-0" v-if="commentFailure == 'NotFound'">{{ $t('message.errors.createComment.notFound') }}</p>
      </div>
      <button class="btn btn-dark-green mb-1 mt-2" @click="createComment()">Commenta</button>
    </div>
    <div class="w-md-50 mx-auto mt-3 text-center" v-else>
      <p class="text-muted mb-0">{{ $t('message.posts.loginToComment') }}</p>
    </div>
  </div>
</template>

<script>
  import Post from './components/Post.vue';
  import Comment from './components/Comment.vue';
  import Editor from './components/TipTap/Editor.vue';
  import NavigationButtons from './components/NavigationButtons.vue';
  import NotFound from './NotFound.vue';
  import Error500 from './Error500.vue';

  export default {
    components: {
      Post,
      Comment,
      Editor,
      NavigationButtons,
      NotFound,
      Error500
    },
    data() {
      return {
        id: Number(this.$route.params.id),
        author: '',
        title: '',
        content: '',
        nComments: 0,
        owner: false,
        comment: '',
        comments: [],
        commentFailure: '',
        currentPage: this.$route.query.page ? (isNaN(Number(this.$route.query.page)) ? -1 : Number(this.$route.query.page)) : 1,
        totalPages: 1,
        resultPerPage: 5,
        lastPageComment: false,
        logged: document.cookie ? document.cookie.split('; ').find(c => c.split('=')[0] == 'au') != undefined : false,
        loading: true,
        error404: false,
        error500: false
      }
    },
    beforeRouteUpdate(to) {
      this.currentPage = to.query.page ? (isNaN(Number(to.query.page)) ? -1 : Number(to.query.page)) : 1;
      this.getData();
    },
    created() {
      this.getData();
    },
    methods: {
      async getPost() {
        let success = false;
        await fetch(`/api/post/get?id=${this.id}`).then(async response => {
            let r = await response.json();

            if(response.status != 200) {
              throw new Error(r.code);
            }

            return r;
          }).then(response => {
            this.author = response.author;
            this.title = response.title;
            this.content = response.content;
            this.nComments = response.nComments;
            this.owner = response.owner;
            this.totalPages = Math.ceil(response.nComments / this.resultPerPage);
            success = true;
          }).catch(e => {
            if(e.message == 'NotFound') {
              this.error404 = true;
            } else {
              this.error500 = true;
            }
          });

          return success;
      },
      async getAllComments() {
        fetch(`/api/comment/getAll?postID=${this.id}&page=${this.currentPage}&nResults=${this.resultPerPage}`)
          .then(async response => {
            let r = await response.json();

            if(response.status != 200) {
              throw new Error(r.code);
            }

            return r;
          }).then(response => {
            this.comments = response.comments;
            this.lastPageComment = this.comments.length == 1 && this.currentPage != 1;
          }).catch(e => {
            this.error500 = true;
          });
      },
      createComment() {
        fetch(`/api/comment/new`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify({
            postID: this.id,
            comment: this.comment
          })
        }).then(async response => {
            let r = await response.json();

            if(response.status != 200) {
              throw new Error(r.code);
            }

            return r;
          }).then(response => {
            this.$router.go(0);
          }).catch(e => {
            if(e.message == 'AuthorizationRequired') {
              this.$router.push('/');
            } else if(e.message == 'EmptyFields' || e.message == 'NotFound') {
              this.commentFailure = e.message;
            } else {
              this.error500 = true;
            }
          });
      },
      getData() {
        if(this.currentPage <= 0) {
          this.error404 = true;
        } else {
          this.getPost().then((success) => {
            if(success) {
              if(this.currentPage > this.totalPages && (this.totalPages != 0 || this.currentPage != 1)) {
                this.error404 = true;
              } else {
                this.getAllComments().then(() => {
                  this.loading = false;
                });
              }
            }
          });
        }
      }
    }
  }
</script>