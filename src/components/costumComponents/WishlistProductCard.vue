<template>
  <VCard class="product-card cursor-pointer">
    <div class="cursor-pointer" :class="viewMode === 'list' ? 'd-flex' : ''">
      <div
        class="product-image-container"
        :class="{ 'bg-white': !$vuetify.theme.current.dark }"
        :style="{
          'min-inline-size': viewMode === 'list' ? '200px' : 'auto',
        }"
        @click="goToProductDetail"
      >
        <img :src="productProp.main_image_url" class="product-image" />
        <div class="new-tag">
          <VChip
            class="me-2"
            color="warning"
            variant="flat"
            v-if="!productProp.in_stock && viewMode === 'grid'"
          >
            {{ $t("product.out_of_stock") }}
          </VChip>
          <VChip
            color="error"
            variant="flat"
            v-if="productProp.is_new && viewMode === 'grid'"
          >
            {{ $t("product.new") }}
          </VChip>
        </div>
      </div>

      <div
        :class="
          viewMode === 'list'
            ? 'border-right flex-1 flex-grow-1 px-6 pb-5'
            : 'flex-grow-1'
        "
        @click="goToProductDetail"
      >
        <VCardText class="py-4" v-if="viewMode === 'grid'">
          <!-- Remove this section to match ProductCard -->
        </VCardText>

        <div
          :class="
            viewMode === 'list'
              ? 'd-flex align-center justify-space-between align-center pt-5 pb-1'
              : 'd-flex align-center justify-space-between align-center pb-1'
          "
        >
          <h1
            class="product-title text-h6 font-weight-bold text-truncate-1 w-100"
            :class="viewMode === 'list' ? 'px-0' : 'ps-4 pe-1 pt-0 pb-0'"
          >
            {{ productProp.name || $t("product.no_description") }}
          </h1>
        </div>
        <!-- <div class="d-flex align-end">
            <VRating
              :model-value="productProp.average_rating || 0"
              readonly
              size="small"
              density="compact"
              v-show="viewMode === 'list'"
            />
            <span
              class="text-secondary text-body-2 ms-1"
              v-show="viewMode === 'list'"
              >({{ productProp.reviews_count || 0 }})</span
            >
          </div> -->

        <span
          class="product-description"
          :class="
            viewMode === 'list'
              ? 'px-0 text-truncate-5'
              : 'text-truncate-1 px-4 mb-3'
          "
          >{{
            productProp.short_description ||
            productProp.description ||
            $t("product.no_description")
          }}</span
        >

         <div
          class="d-flex align-end justify-end mb-1 gap-2 px-4"
          v-if="viewMode === 'grid'"
        >
          <span
            v-if="productProp.old_price"
            class="text-secondary text-h6 text-decoration-line-through"
            >{{ productProp.old_price }} DA</span
          >
          <span class="text-primary text-h5 font-weight-bold"
            >{{ productProp.price ? productProp.price : "0.00" }} DA</span
          >
        </div>

        <VDivider class="my-2" v-show="viewMode === 'grid'" />
      </div>

      <VCardActions
        class="product-card-actions align-center"
        :class="
          viewMode === 'list'
            ? 'list flex-column justify-center '
            : 'justify-space-between gap-0 pa-0 pb-2 px-1'
        "
      >
        <div class="d-flex align-end mb-2" v-if="viewMode === 'list'">
          <span
            v-if="productProp.old_price"
            class="text-secondary text-body-2 text-decoration-line-through text-strike me-1"
            >{{ productProp.old_price }} DA</span
          >
          <span class="text-primary font-weight-bold">
            {{ productProp.price ? productProp.price : "0.00" }}
            DA
          </span>
        </div>
        <VBtn
          :variant="viewMode === 'list' ? 'tonal' : 'text'"
          color="error"
          :class="viewMode === 'list' ? 'w-100' : 'pe-4 ps-4'"
          @click="removeFromWishlist"
        >
          <VIcon icon="tabler-x" />
          <span class="ms-1">{{ $t("cart.remove") }}</span>
        </VBtn>
        <VBtn
          :variant="viewMode === 'list' ? 'flat' : 'text'"
          color="primary"
          :class="viewMode === 'list' ? 'w-100' : 'ps-4 pe-4'"
          @click="addToCart"
        >
          <VIcon icon="tabler-shopping-cart" />
          <span class="ms-1">{{ $t("product.add_to_cart") }}</span>
        </VBtn>
      </VCardActions>
    </div>
  </VCard>
</template>

<script setup>
import { useCartStore } from "@/stores/useCartStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { locale } = useI18n();

const props = defineProps({
  productProp: {
    type: Object,
    required: true,
  },
  viewMode: {
    type: String,
    default: "grid",
  },
});

const router = useRouter();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();

// Computed property for current language
const currentLanguage = computed(() => locale.value);

// Add to cart function
const addToCart = () => {
  if (props.productProp) {
    cartStore.addItem(props.productProp);
    // Optionally remove from wishlist after adding to cart
    // wishlistStore.removeItem(props.productProp.id);
  }
};

// Remove from wishlist function
const removeFromWishlist = () => {
  if (props.productProp && props.productProp.id) {
    wishlistStore.removeItem(props.productProp.id);
  }
};

// Navigate to product detail
const goToProductDetail = () => {
  if (props.productProp && props.productProp.id) {
    router.push(`/product/${props.productProp.id}`);
  }
};
</script>

<style lang="scss">
.product-card {
  display: flex !important;
  overflow: hidden !important;
  flex-direction: column !important;
  border-radius: 8px !important;
  block-size: 100% !important;
  transition: transform 0.2s, box-shadow 0.2s !important;
}

.product-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 10%) !important;
  transform: translateY(-5px) !important;
}

.product-image-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  // block-size: 200px;
  padding-block: 1rem 0;
  padding-inline: 1rem;
}

.product-image {
  max-block-size: 100%;
  max-inline-size: 100%;
  object-fit: contain;
}

.new-tag {
  position: absolute;
  z-index: 999;
  inset-block-start: 10px;
  inset-inline-end: 10px;
}

.product-title {
  overflow: hidden;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-description {
  overflow: hidden;
  font-size: 0.875rem;
  line-height: 1.6;
}

.text-truncate-1 {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  text-overflow: ellipsis;
}

.text-truncate-5 {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  line-clamp: 5;
  text-overflow: ellipsis;
}

.filters-sidebar {
  position: sticky;
  inset-block-start: 80px;
}

.sort-select {
  max-inline-size: 200px;
}

.search-container {
  max-inline-size: 300px;
}

.search-field {
  inline-size: 100%;
}

.border-right {
  border-inline-end: 1px solid rgba(0, 0, 0, 10%);
}

.product-card-actions.list {
  min-inline-size: 200px;
}
</style>
