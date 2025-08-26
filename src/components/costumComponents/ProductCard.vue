<template>
  <VCard
    class="product-card cursor-pointer"
    :variant="
      viewMode === 'grid'
        ? 'flat'
        : viewMode === 'list'
        ? $vuetify.theme.current.dark
          ? 'flat'
          : 'outlined'
        : undefined
    "
    :style="
      viewMode === 'list'
        ? 'background-color: rgb(var(--v-theme-surface));'
        : 'background-color: rgb(var(--v-theme-background));'
    "
  >
    <div
      class="cursor-pointer product-image-info"
      :class="viewMode === 'list' ? 'd-flex flex-row' : ''"
    >
      <div
        class="product-image-container"
        :class="{
          'bg-white': !$vuetify.theme.current.dark,
          'no-inline-padding': viewMode === 'grid',
          list: viewMode === 'list',
        }"
        @click="product.id && $router.push(`/product/${product.id}`)"
      >
        <img
          :src="product.main_image_url"
          class="product-image"
          :class="viewMode"
          loading="lazy"
          decoding="async"
        />

        <!-- Action buttons - top right -->
        <div class="action-buttons" v-if="viewMode === 'grid'">
          <VBtn
            icon
            size="small"
            variant="flat"
            color="error"
            class="action-btn wishlist-btn"
            @click.stop="toggleWishlist()"
          >
            <VIcon
              :icon="isInWishlist ? 'tabler-heart-filled' : 'tabler-heart'"
              size="20"
            />
          </VBtn>
          <VBtn
            icon
            size="small"
            variant="flat"
            color="primary"
            class="action-btn cart-btn"
            @click.stop="addToCart()"
          >
            <VIcon
              :icon="
                isInCart
                  ? 'tabler-shopping-cart-filled'
                  : 'tabler-shopping-cart'
              "
              size="20"
            />
          </VBtn>
        </div>

        <div class="new-tag">
          <VChip
            color="warning"
            variant="flat"
            v-if="!product.in_stock && viewMode === 'grid'"
            class="font-weight-bold"
            size="small"
          >
            {{ $t("product.out_of_stock") }}
          </VChip>
          <VChip
            color="error"
            variant="flat"
            class="font-weight-bold"
            size="small"
            v-if="product.is_new && viewMode === 'grid'"
          >
            {{ $t("product.new") }}
          </VChip>
          <VChip
            color="#28a745"
            variant="flat"
            v-if="product.is_promo && viewMode === 'grid'"
            class="font-weight-bold"
            size="small"
          >
            {{ $t("product.promo") }}
          </VChip>
          <VChip
            color="#1c3a63"
            variant="flat"
            v-if="product.limited_offer && viewMode === 'grid'"
            class="font-weight-bold"
            size="small"
          >
            {{ $t("product.limited_offer") }}
          </VChip>
        </div>
      </div>

      <div :class="viewMode === 'list' ? 'd-flex' : ''">
        <div
          :class="
            viewMode === 'list'
              ? 'border-right flex-1 flex-grow-1 px-6 pb-5'
              : 'flex-grow-1 no-inline-padding-grid'
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
              :class="viewMode === 'list' ? 'px-0 text-h5' : 'px-0 pt-0 pb-0'"
              :style="viewMode === 'grid' ? 'font-size: 14px !important;' : ''"
            >
              {{ product.name || "Product" }}
              <!-- <span class="underline-animation"></span> -->
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
                : 'text-truncate-1 px-3 mb-3'
            "
            :style="viewMode === 'list' ? 'line-height: 1.6 !important;' : ''"
            v-if="viewMode === 'list'"
            >{{ stripHtml(product.description || "") }}</span
          >

          <div
            class="d-flex align-end gap-2"
            :class="{
              'justify-start px-0 pb-1': viewMode === 'grid',
              'justify-end px-4 pb-1': viewMode !== 'grid',
            }"
            v-if="viewMode === 'grid'"
          >
            <span
              v-if="product.old_price"
              class="text-secondary text-h6 text-decoration-line-through d-none d-md-inline"
              >{{ product.old_price }} DA</span
            >
            <span
              class="text-primary font-weight-bold"
              :class="viewMode === 'grid' ? 'text-h6' : 'text-h5'"
              :style="
                viewMode === 'grid'
                  ? 'font-size: 16px !important; font-weight: 500 !important;'
                  : ''
              "
              >{{ product.price }} DA</span
            >
          </div>
        </div>

        <VCardActions
          class="product-card-actions align-center"
          :class="
            viewMode === 'list'
              ? 'list flex-column justify-center'
              : 'justify-space-between gap-0 pa-0 pb-2 px-1'
          "
          :style="viewMode !== 'list' ? 'gap: 0' : ''"
          v-if="viewMode === 'list'"
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
            class="b-radius-0"
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
            class="b-radius-0"
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
    // Strip HTML tags from text
    stripHtml(html) {
      if (!html) return "";

      // Create a temporary div element to parse HTML
      const tmp = document.createElement("div");
      tmp.innerHTML = html;

      // Get text content and clean up extra whitespace
      return tmp.textContent || tmp.innerText || "";
    },

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
  border-radius: 0 !important;
  block-size: 100% !important;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    box-shadow 0.3s ease !important;
}

.product-card.v-card--variant-flat {
  .v-card__underlay {
    display: none;
  }
}

.product-image-container {
  position: relative;
  display: flex;
  overflow: hidden;
  flex: 1;
  align-items: center;
  justify-content: center;

  // max-block-size: 233px;
  // margin-block-end: 1rem;
  // padding: 0.75rem;

  // padding-block: 1rem 0;
  // padding-inline: 1rem;

  &.no-inline-padding {
    padding: 0;
    margin-block-end: 0.75rem;
  }
}

.product-image {
  block-size: 330px !important;
  inline-size: 100%;
  max-inline-size: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.product-image.list {
  block-size: 100% !important;
  inline-size: 100% !important;
}

.product-image-container.list {
  block-size: 180px !important;
  inline-size: 200px !important;
  min-inline-size: 200px !important;
}

@media (max-width: 480px) {
  .product-image {
    block-size: 220px !important;
  }
}

.product-card:hover .product-image {
  transform: scale(1.03);
}

.product-title {
  position: relative;
  overflow: hidden;
  font-size: 1.1rem !important;
  font-weight: 400 !important;
  line-height: 1.4;
  text-overflow: ellipsis;
  text-wrap: wrap !important;
  transition: color 0.3s ease;
  white-space: nowrap;
}

// .underline-animation {
//   position: absolute;
//   background-color: rgb(var(--v-theme-primary));
//   block-size: 1px;
//   inline-size: 0;
//   inset-block-end: 0;
//   inset-inline-start: 0;
//   transition: inline-size 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
// }

// .product-card:hover .underline-animation {
//   inline-size: 100%;
// }

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
  block-size: 100%;
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
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 4px;
  inset-block-end: 12px;
  inset-inline-start: 12px;
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

.no-inline-padding-grid {
  padding-inline-start: 0 !important;

  .d-flex.align-end {
    padding-inline-end: 0 !important;
  }
}

.action-buttons {
  position: absolute;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 5px;
  inset-block-start: 8px;
  inset-inline-end: 8px;
}
</style>
