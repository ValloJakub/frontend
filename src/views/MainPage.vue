<script>

import ShowCommercials from "@/components/ShowCommercials.vue";
import ArticleLoadAndPagination from "@/components/ArticleLoadAndPagination.vue";

export default {
  name: "FriSportMainPage",
  components: {ArticleLoadAndPagination, ShowCommercials}
};
</script>

<template>
  <body>

  <ShowCommercials></ShowCommercials>

  <ArticleLoadAndPagination></ArticleLoadAndPagination>

  </body>
</template>

<style scoped lang="scss">
</style>
