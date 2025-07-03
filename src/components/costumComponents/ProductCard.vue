<template>
  <VCard class="product-card cursor-pointer">
    <div class="cursor-pointer product-image-info" :class="viewMode === 'list' ? 'd-flex' : ''">
      <div
        class="product-image-container"
        :class="{ 'bg-white': !$vuetify.theme.current.dark }"
        :style="{
          'min-inline-size': viewMode === 'list' ? '200px' : 'auto',
        }"
        @click="product.id && $router.push(`/product/${product.id}`)"
      >
        <img :src="product.main_image_url" class="product-image" />
        <div class="new-tag">
          <VChip
            class="me-2"
            color="warning"
            variant="flat"
            v-if="!product.in_stock && viewMode === 'grid'"
          >
            {{ $t("product.out_of_stock") }}
          </VChip>
          <VChip
            color="error"
            variant="flat"
            v-if="product.is_new && viewMode === 'grid'"
          >
            {{ $t("product.new") }}
          </VChip>
        </div>
      </div>

      <div>
        <div
          :class="
            viewMode === 'list'
              ? 'border-right flex-1 flex-grow-1 px-6 pb-5'
              : 'flex-grow-1'
          "
          @click="product.id && $router.push(`/product/${product.id}`)"
        >
          <div
            :class="
              viewMode === 'list'
                ? 'd-flex align-center justify-space-between align-center pt-5 pb-1'
                : 'd-flex align-center justify-space-between align-center pb-1'
            "
          >
            <h1
              class="product-title text-h6 font-weight-bold text-truncate-1 w-100"
              :class="viewMode === 'list' ? 'px-0' : 'ps-4 pe-4 pt-0 pb-0'"
            >
              {{ product.name || "Product" }}
            </h1>
            <!-- <div class="d-flex align-end">
            <VRating
              :model-value="product.average_rating || 0"
              readonly
              size="small"
              density="compact"
              v-show="viewMode === 'list'"
            />
            <span
              class="text-secondary text-body-2 ms-1"
              v-show="viewMode === 'list'"
              >({{ product.reviews_count }})</span
            >
          </div> -->
          </div>

          <span
            class="product-description"
            :class="
              viewMode === 'list'
                ? 'px-0 text-truncate-5'
                : 'text-truncate-1 px-4 mb-3'
            "
            >{{ product.short_description || "" }}</span
          >

          <div
            class="d-flex align-end justify-end gap-2 px-4 pb-1"
            v-if="viewMode === 'grid'"
          >
            <span
              v-if="product.old_price"
              class="text-secondary text-h6 text-decoration-line-through d-none d-md-inline"
              >{{ product.old_price }} DA</span
            >
            <span class="text-primary text-h5 font-weight-bold"
              >{{ product.price }} DA</span
            >
          </div>

          <VDivider class="my-2" v-show="viewMode === 'grid'" />
        </div>

        <VCardActions
          class="product-card-actions align-center"
          :class="
            viewMode === 'list'
              ? 'list flex-column justify-center'
              : 'justify-space-between gap-0 pa-0 pb-2 px-1'
          "
          :style="viewMode !== 'list' ? 'gap: 0' : ''"
        >
          <div class="d-flex align-end mb-2" v-if="viewMode === 'list'">
            <span
              v-if="product.old_price"
              class="text-secondary text-body-2 text-decoration-line-through text-strike me-1"
              >{{ product.old_price }} DA</span
            >
            <span class="text-primary font-weight-bold">
              {{ product.price }} DA
            </span>
          </div>
          <VBtn
            :variant="viewMode === 'list' ? 'tonal' : 'text'"
            color="error"
            :class="viewMode === 'list' ? 'w-100' : 'pe-2 ps-2'"
            @click="toggleWishlist()"
          >
            <VIcon
              :icon="isInWishlist ? 'tabler-heart-filled' : 'tabler-heart'"
            />
            <span class="ms-1">{{
              isInWishlist
                ? $t("product.remove_from_wishlist")
                : $t("product.add_to_wishlist")
            }}</span>
          </VBtn>
          <VBtn
            :variant="viewMode === 'list' ? 'flat' : 'text'"
            color="primary"
            :class="viewMode === 'list' ? 'w-100' : 'ps-2 pe-2'"
            @click="addToCart()"
          >
            <VIcon
              :icon="
                isInCart
                  ? 'tabler-shopping-cart-filled'
                  : 'tabler-shopping-cart'
              "
            />
            <span class="ms-1">{{
              isInCart ? $t("product.added_to_cart") : $t("product.add_to_cart")
            }}</span>
          </VBtn>
        </VCardActions>
      </div>
    </div>
  </VCard>
</template>

<script>
import { useCartStore } from "@/stores/useCartStore";
import { useWishlistStore } from "@/stores/useWishlistStore";

export default {
  name: "ProductCard",
  props: {
    productProp: {
      type: Object,
      required: true,
    },
    viewMode: {
      type: String,
      default: "grid",
    },
  },

  mounted() {
    this.product = { ...this.productProp };
  },

  data() {
    return {
      product: {},
      cartStore: useCartStore(),
      wishlistStore: useWishlistStore(),
    };
  },
  computed: {
    // Check if the product is in the wishlist
    isInWishlist() {
      return this.product && this.product.id
        ? this.wishlistStore.isInWishlist(this.product.id)
        : false;
    },
    // Check if the product is in the cart
    isInCart() {
      return this.product && this.product.id
        ? this.cartStore.isInCart(this.product.id)
        : false;
    },
  },
  methods: {
    // Toggle wishlist status
    toggleWishlist() {
      if (this.product) {
        this.wishlistStore.toggleItem(this.product);
      }
    },
    // Add product to cart
    addToCart() {
      if (this.product) {
        this.cartStore.addItem(this.product);
        // Optional: Show a confirmation message or notification
      }
    },
  },
};
</script>

<style lang="scss">
.product-card {
  display: flex !important;
  overflow: hidden !important;
  flex-direction: column !important;
  border-radius: 8px !important;
  block-size: 100% !important;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    box-shadow 0.3s ease !important;
}

.product-card:hover {
  // box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12) !important;
  transform: translateY(-3px) !important;
}

.product-image-container {
  position: relative;
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  flex: 1;

  // max-block-size: 233px;
  // margin-block-end: 1rem;
  padding: 1rem;

  // padding-block: 1rem 0;
  // padding-inline: 1rem;
}

.product-image {
  border-radius: 8px;

  // max-block-size: 233px !important;
  max-inline-size: 100%;
  object-fit: contain;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  @media (max-width: 768px) {
    block-size: 170px !important;
  }
}

.product-card:hover .product-image {
  transform: scale(1.03);
}

.product-title {
  overflow: hidden;
  font-size: 1.1rem !important;
  font-weight: 600;
  line-height: 1.4;
  text-overflow: ellipsis;
  transition: color 0.3s ease;
  white-space: nowrap;
}

.product-card:hover .product-title {
  color: rgb(var(--v-theme-primary)) !important;
}

.product-description {
  overflow: hidden;

  // color: rgba(0, 0, 0, 60%);
  font-size: 0.875rem;
  inline-size: -webkit-fill-available;
  line-height: 1.6;
}

.product-image-info {
  display: flex;
  flex-direction: column;
  height: 100%;
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

.new-tag {
  position: absolute;
  z-index: 999;
  inset-block-start: 10px;
  inset-inline-end: 10px;
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
