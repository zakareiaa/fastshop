<template>
  <VCard class="category-card cursor-pointer">
    <div @click="$router.push(`/shop?category_id=${category.id}`)">
      <div class="img-bg">
        <img :src="category.image" v-if="category.image" />
        <VIcon
          v-else
          icon="tabler-building-store"
          :color="$vuetify.theme.themes.light.colors.primary"
          size="50"
        />
      </div>
      <div class="category-title">
        <span class="font-weight-bold">
          {{
            category[`name_${currentLanguage}`] || category.name
          }}
        </span>
      </div>
      <div class="category-count">{{ category.products_count }} products</div>
    </div>
  </VCard>
</template>

<script>
export default {
  computed: {
    currentLanguage() {
      return this.$i18n.locale;
    },
  },
};
</script>

<script setup>
defineProps({
  category: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  /* padding-block: .75rem; */
  padding-inline: 1rem;
  height: 100%;
}

.img-bg {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-block-end: 0.45rem;
  margin-block-start: 1.25rem;
}

.img-bg img {
  max-block-size: 50px !important;
  max-inline-size: 100% !important;
}

.category-title {
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  color: rgba(var(--v-theme-on-surface)) !important;
}

.category-count {
  /* color: #888; */
  font-size: 0.95rem;
  text-align: center;
  margin-block-end: 1.25rem;
}
</style>
