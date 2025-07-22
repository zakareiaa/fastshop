<template>
  <Header />

  <div class="app-container py-6">
    <div class="d-flex justify-space-between align-center mb-6 flex-wrap">
      <div class="position-relative mb-1 me-2">
        <div class="section-title">{{ $t("wishlist.title") }}</div>
      </div>
      <div
        class="d-flex flex-wrap wishlist-page-buttons"
        v-if="!isWishlistEmpty"
      >
        <VBtn
          color="primary"
          variant="tonal"
          class="me-2 add-all-to-cart-button b-radius-0"
          prepend-icon="tabler-shopping-cart"
          @click="addAllToCart"
        >
          {{ $t("wishlist.add_all_to_cart") }}
        </VBtn>
        <VBtn
          color="error"
          variant="tonal"
          prepend-icon="tabler-trash"
          class="clear-wishlist-button b-radius-0"
          @click="clearWishlist"
        >
          {{ $t("wishlist.clear_wishlist") }}
        </VBtn>
      </div>
    </div>

    <div v-if="isWishlistEmpty" class="text-center py-6">
      <VIcon
        icon="tabler-heart-off"
        size="64"
        color="grey-lighten-1"
        class="mb-4"
      />
      <h3 class="text-h5 font-weight-medium mb-2">
        {{ $t("wishlist.empty_title") }}
      </h3>
      <p class="text-body-1 mb-6">
        {{ $t("wishlist.empty_message") }}
      </p>
      <VBtn color="primary" to="/shop">{{
        $t("wishlist.continue_shopping")
      }}</VBtn>
    </div>

    <VRow v-else>
      <VCol
        cols="6"
        sm="4"
        md="4"
        lg="3"
        v-for="product in wishlistItems"
        :key="product.id"
      >
        <ProductCard :productProp="product" viewMode="grid" />
      </VCol>
    </VRow>
  </div>

  <Footer />
</template>

<script setup>
import Footer from "@/components/costumComponents/Footer.vue";
import Header from "@/components/costumComponents/Header.vue";
import ProductCard from "@/components/costumComponents/ProductCard.vue";
import { useCartStore } from "@/stores/useCartStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import "@styles/header.css";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

// Define page metadata
definePage({
  meta: {
    layout: "blank",
    public: true,
  },
});

const { locale } = useI18n();
const wishlistStore = useWishlistStore();
const cartStore = useCartStore();

// Get current language
const currentLanguage = computed(() => locale.value);

// Get wishlist items from the store
const wishlistItems = computed(() => wishlistStore.items);

// Check if wishlist is empty
const isWishlistEmpty = computed(() => wishlistStore.isEmpty);

// Add all items to cart
const addAllToCart = () => {
  wishlistStore.moveAllToCart(cartStore);
};

// Clear wishlist
const clearWishlist = () => {
  wishlistStore.clearWishlist();
};
</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";

.section-title {
  font-size: 28px;
  font-weight: 800;
  line-height: 36px;
}

@media (max-width: 600px) {
  .wishlist-page-buttons {
    inline-size: 100%;
    margin-block-start: 10px;
  }

  .add-all-to-cart-button,
  .clear-wishlist-button {
    inline-size: 100%;
    margin-block-end: 10px;
    margin-inline-end: 0 !important;
  }
}
</style>
