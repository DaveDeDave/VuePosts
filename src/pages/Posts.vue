<template>
  <Error500 v-if="error500"/>
  <NotFound v-else-if="error404"/>
  <div class="container px-3 pt-4 pb-4" v-else-if="!loading">
      <Post
        v-for="post in posts"
        :id="post.id"
        :author="post.author"
        :title="post.title"
        :content="post.content"
        :nComments="post.nComments"
        :owner="post.owner"
        :lastPagePost="lastPagePost"
      />
      <NavigationButtons
        v-if="posts"
        :currentPage="currentPage"
        :totalPages="totalPages"
        :to="'/posts'"
        :search="search"/>
  </div>
</template>

<script>
  import Post from './components/Post.vue';
  import NavigationButtons from './components/NavigationButtons.vue';
  import NotFound from './NotFound.vue';
  import Error500 from './Error500.vue';
  import axios from 'axios';
  
  export default {
    components: {
      Post,
      NavigationButtons,
      NotFound,
      Error500
    },
    data() {
      return {
        posts: [],
        currentPage: this.$route.query.page ? (isNaN(Number(this.$route.query.page)) ? -1 : Number(this.$route.query.page)) : 1,
        totalPages: 1,
        resultPerPage: 5,
        search: this.$route.query.search ? this.$route.query.search : '',
        lastPagePost: false,
        loading: true,
        error404: false,
        error500: false
      }
    },
    beforeRouteUpdate(to) {
      this.currentPage = to.query.page ? (isNaN(Number(to.query.page)) ? -1 : Number(to.query.page)) : 1;
      this.search = to.query.search ? to.query.search : '';
      this.getData();
    },
    created() {
      this.getData();
    },
    methods: {
      async getNumberOfPosts() {
        // await
        axios.get(`/api/post/getNumber?search=${this.search}`)
          .then(response => {
            this.totalPages = Math.ceil(response.data.nPosts / this.resultPerPage);
          })
          .catch(e => this.error500 = true);
      },
      async getAllPosts() {
        axios.get(`/api/post/getAll?search=${this.search}&page=${this.currentPage}&nResults=${this.resultPerPage}`)
          .then(response => {
            this.posts = response.data.posts;
            this.lastPagePost = this.posts.length == 1 && this.currentPage != 1;
          })
          .catch(e => this.error500 = true);
      },
      getData() {
        if(this.currentPage <= 0) {
          this.error404 = true;
        } else {
          this.getNumberOfPosts().then(() => {
            if(this.currentPage > this.totalPages && (this.totalPages != 0 || this.currentPage != 1)) {
              this.error404 = true;
            } else {
              this.getAllPosts().then(() => {
                this.loading = false;
              });
            }
          });
        }
      }
    }
  };
</script>