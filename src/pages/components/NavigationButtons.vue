<template>
  <div class="mx-auto mb-2">
    <router-link 
      class="btn me-1"
      :class="{'btn-dark-green': page == currentPage, 'btn-outline-dark-green': page != currentPage}"
      v-for="page in getNavigationButtons()"
      :to="search ? `${to}?search=${search}&page=${page}` : `${to}?page=${page}`">
      {{ page }}
    </router-link>
  </div>
</template>

<script>
  export default {
    props: {
      currentPage: Number,
      totalPages: Number,
      to: String,
      search: String
    },
    methods: {
      getNavigationButtons() {
        return Array(this.totalPages-this.currentPage+(this.currentPage > 2 ? 3 : (this.currentPage > 1 ? 2 : 1)) < 5 ? this.totalPages-this.currentPage+(this.currentPage > 2 ? 3 : (this.currentPage > 1 ? 2 : 1)) : 5)
          .fill(this.currentPage > 2 ? this.currentPage - 2 : (this.currentPage > 1 ? this.currentPage - 1 : this.currentPage))
          .map((v, i) => v+i);
      }
    }
  }
</script>