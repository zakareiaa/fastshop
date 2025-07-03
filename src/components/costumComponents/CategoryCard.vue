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
          {{ category[`name_${currentLanguage}`] || category.name }}
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
  overflow: hidden;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  block-size: 100%;

  /* padding-block: .75rem; */
  padding-inline: 1rem;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.category-card:hover {
  transform: translateY(-2px);

  /* box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15); */
}

.img-bg {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-block: 1.25rem 0.45rem;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.category-card:hover .img-bg {
  transform: scale(1.07);
}

.img-bg img {
  max-block-size: 50px !important;
  max-inline-size: 100% !important;
  transition: transform 0.3s ease;
}

.category-card:hover .img-bg img {
  transform: scale(1.03);
}

.img-bg .v-icon {
  transition: transform 0.3s ease;
}

.category-card:hover .img-bg .v-icon {
  transform: scale(1.03);
}

.category-title {
  color: rgba(var(--v-theme-on-surface)) !important;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  transition: color 0.3s ease;
}

.category-card:hover .category-title {
  color: rgb(var(--v-theme-primary)) !important;
}

.category-count {
  /* color: #888; */
  font-size: 0.95rem;
  margin-block-end: 1.25rem;
  text-align: center;
}
</style>
