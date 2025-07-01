<template>
  <Header />

  <div class="app-container py-10">
    <div class="d-flex align-center justify-space-between mb-6">
      <div class="position-relative mb-1 me-2">
        <div class="section-title">
          {{ $t("product_detail.product_details") }}
        </div>
      </div>

      <!-- Breadcrumb
      <div class="d-flex align-center ms-6">
        <VIcon
          icon="tabler-home"
          size="small"
          class="me-2"
          @click="$router.push('/')"
        />
        <router-link to="/" class="text-decoration-none text-secondary"
          >Home</router-link
        >
        <VIcon icon="tabler-chevron-right" size="small" class="mx-2" />
        <router-link to="/shop" class="text-decoration-none text-secondary"
          >Shop</router-link
        >
        <VIcon icon="tabler-chevron-right" size="small" class="mx-2" />
        <span class="text-primary">Product Details</span>
      </div> -->
    </div>

    <VCard>
      <VCardText class="pa-3 pa-sm-6">
        <!-- Skeleton Loader State -->
        <VRow v-if="getProductByIdLoading">
          <VCol cols="12" md="6">
            <div class="skeleton skeleton-image"></div>
            <VRow>
              <VCol v-for="i in 4" :key="`sk-thumb-${i}`" cols="3">
                <div class="skeleton skeleton-thumbnail"></div>
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="12" md="6">
            <div class="skeleton skeleton-heading"></div>
            <div class="skeleton skeleton-text-short"></div>
            <!-- Rating + reviews count -->
            <div class="skeleton skeleton-text-medium"></div>
            <!-- Price -->
            <div class="skeleton skeleton-paragraph-line"></div>
            <!-- Short description -->
            <div
              class="skeleton skeleton-paragraph-line"
              style="inline-size: 80%"
            ></div>
            <div
              class="skeleton skeleton-paragraph-line"
              style="inline-size: 90%; margin-block-end: 1.5rem"
            ></div>
            <div class="d-flex flex-wrap ga-2 mb-4">
              <!-- Categories -->
              <div class="skeleton skeleton-chip"></div>
              <div class="skeleton skeleton-chip"></div>
              <div class="skeleton skeleton-chip"></div>
            </div>
            <div class="skeleton skeleton-divider"></div>
            <div class="d-flex align-center mb-6 mt-6">
              <div class="skeleton skeleton-quantity-selector"></div>
            </div>
            <div class="skeleton skeleton-button"></div>
            <div class="skeleton skeleton-button"></div>
            <div
              class="skeleton skeleton-text-short"
              style="margin-block-start: 1.5rem"
            ></div>
            <!-- Shipping -->
            <div class="skeleton skeleton-text-medium"></div>
            <!-- EMI -->
          </VCol>
        </VRow>

        <!-- Actual Product Content -->
        <VRow v-else-if="!getProductByIdLoading && product.id">
          <!-- Product Image -->
          <VCol cols="12" md="6" class="product-image-col">
            <div class="swiper-container-wrapper">
              <swiper-container
                class="mySwiper mb-4"
                thumbs-swiper=".mySwiper2"
                loop="true"
                space-between="10"
                centered-slides="true"
                events-prefix="swiper-"
                dir="ltr"
              >
                <swiper-slide v-for="image in product.images" :key="image.id">
                  <img
                    :src="image.image_url"
                    class="product-detail-image"
                    alt="Product image"
                    style="
                      border-radius: 8px;
                      block-size: 650px;
                      object-fit: contain;
                    "
                  />
                </swiper-slide>
              </swiper-container>

              <swiper-container
                class="mySwiper2"
                loop="true"
                free-mode="true"
                events-prefix="swiper-"
                slides-per-view="4"
                :breakpoints="{
                  0: { slidesPerView: 2 },
                  600: { slidesPerView: 3 },
                  900: { slidesPerView: 4 }
                }"
                watch-slides-progress="true"
                space-between="10"
                dir="ltr"
              >
                <swiper-slide v-for="image in product.images" :key="image.id">
                  <img
                    :src="image.image_url"
                    height="150"
                    class="thumbnail-image"
                    alt="Product thumbnail"
                  />
                </swiper-slide>
              </swiper-container>
            </div>
          </VCol>

          <!-- Product Details -->
          <VCol
            cols="12"
            md="6"
            class="d-flex flex-column justify-space-between"
          >
            <div>
              <div class="d-flex align-center mb-2">
                <h1 class="text-h4 font-weight-bold">{{ product.name }}</h1>
                <div class="ms-4">
                  <VChip
                    color="success"
                    class="text-white"
                    size="small"
                    v-if="product.in_stock"
                  >
                    <span>{{ $t("product_detail.in_stock") }}</span>
                  </VChip>
                  <VChip color="warning" class="text-white" size="small" v-else>
                    <span>{{ $t("product_detail.out_of_stock") }}</span>
                  </VChip>
                </div>
              </div>

              <div class="d-flex align-center mb-4">
                <VRating
                  :model-value="product.average_rating"
                  readonly
                  size="small"
                  density="compact"
                  color="amber-darken-2"
                />
                <span class="ms-2 text-body-2"
                  >({{ product.reviews_count }}
                  {{ $t("reviews.reviews") }})</span
                >
              </div>
              <div class="d-flex align-center mb-4">
                <h2 class="text-h5 text-primary font-weight-bold me-3">
                  {{ product.price }} DA
                </h2>
                <span
                  v-if="product.old_price"
                  class="text-decoration-line-through text-disabled"
                >
                  {{ product.old_price }} DA
                </span>
              </div>

              <p class="text-body-1 mb-6">{{ product.short_description }}</p>
            </div>

            <div>
              <!-- Category Chips -->
              <!-- <div
                v-if="product.categories && product.categories.length > 0"
                class="d-flex flex-wrap ga-2 mb-4"
              >
                <span class="text-body-1 font-weight-medium">Categories:</span>
                <VChip
                  v-for="category in product.categories"
                  :key="category.id"
                  size="small"
                  color="primary"
                  variant="tonal"
                  label
                >
                  {{ category.name }}
                </VChip>
              </div> -->

              <!-- Product Options -->
              <div
                v-if="
                  product.product_options && product.product_options.length > 0
                "
              >
                <div class="d-flex align-center mb-4">
                  <span class="text-body-1 font-weight-medium">{{
                    $t("product_detail.options")
                  }}</span>
                </div>

                <VSelect
                  v-for="option in product.product_options"
                  :key="option.name"
                  v-model="selectedOptions[option.name]"
                  :items="option.items"
                  :label="option.name"
                  item-title="name"
                  item-value="name"
                  return-object
                  clearable
                  variant="outlined"
                  class="mb-4"
                >
                  <template v-slot:selection="{ item }">
                    <div
                      class="d-flex align-center justify-space-between w-100"
                    >
                      <span class="text-capitalize me-4">
                        {{ item.raw.name }}
                      </span>
                      <VChip
                        v-if="item.raw.price_added > 0"
                        color="success"
                        class="ms-auto"
                        size="small"
                      >
                        +{{ item.raw.price_added }} DA
                      </VChip>
                    </div>
                  </template>
                  <template v-slot:item="{ item, props }">
                    <VListItem v-bind="props">
                      <template v-slot:title>
                        <div class="d-flex align-center">
                          <span class="text-capitalize">
                            {{ item.raw.name }}
                          </span>
                          <VChip
                            color="success"
                            v-if="item.raw.price_added > 0"
                            class="ms-auto"
                            size="small"
                          >
                            +{{ item.raw.price_added }} DA
                          </VChip>
                        </div>
                      </template>
                    </VListItem>
                  </template>
                </VSelect>

                <div class="d-flex justify-end align-center my-4">
                  <span class="text-body-1 font-weight-medium me-2"
                    >{{ $t("cart.total") }}:</span
                  >
                  <h3 class="text-h6 text-primary font-weight-bold">
                    {{ totalPrice }} DA
                  </h3>
                </div>
              </div>

              <VDivider class="mb-6" />

              <!-- Quantity -->
              <div class="d-flex align-center mb-6">
                <span class="text-body-1 font-weight-medium me-4"
                  >{{ $t("product_detail.quantity") }}:</span
                >
                <div class="quantity-selector d-flex align-center">
                  <VBtn
                    icon="tabler-minus"
                    variant="tonal"
                    size="small"
                    @click="decrementQuantity"
                    :disabled="quantity <= 1"
                  />
                  <span class="mx-4 text-body-1">{{ quantity }}</span>
                  <VBtn
                    icon="tabler-plus"
                    variant="tonal"
                    size="small"
                    @click="incrementQuantity"
                  />
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="d-flex align-center flex-column">
                <VBtn
                  color="primary"
                  variant="tonal"
                  prepend-icon="tabler-shopping-bag"
                  @click="proceedToCheckout"
                  class="w-100 mb-3"
                >
                  {{ $t("build_pc.proceed_to_checkout") }}
                </VBtn>
                <VBtn
                  color="primary"
                  class="w-100"
                  prepend-icon="tabler-shopping-cart"
                  @click="addToCart"
                >
                  {{ $t("product_detail.add_to_cart") }}
                </VBtn>
              </div>

              <!-- Free Shipping -->
              <div class="mt-6 d-flex align-center">
                <VIcon icon="tabler-truck-delivery" class="me-2" />
                <span class="text-body-2">{{
                  $t("product_detail.shipping_info")
                }}</span>
              </div>

              <!-- EMI options -->
              <div class="mt-2 d-flex align-center">
                <VIcon icon="tabler-credit-card" class="me-2" />
                <span class="text-body-2 text-xs">{{
                  $t("product_detail.emi_info")
                }}</span>
              </div>
            </div>
          </VCol>
        </VRow>

        <!-- Product Not Found State -->
        <VRow v-else-if="!getProductByIdLoading && !product.id" class="py-10">
          <VCol cols="12" class="text-center">
            <VIcon
              icon="tabler-error-404"
              size="64"
              class="mb-4"
              color="warning"
            ></VIcon>
            <h2 class="text-h5 mb-2">{{ $t("shop.no_products_found") }}</h2>
            <p class="text-body-1">
              {{ $t("shop.no_products_message") }}
            </p>
            <VBtn color="primary" @click="$router.push('/shop')">
              {{ $t("header.shop") }}
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Product Description Tabs -->
    <VCard class="mt-10">
      <VTabs v-model="activeTab" color="primary" grow class="v-tabs-pill">
        <VTab value="description">
          <VIcon icon="tabler-file-text" class="me-2" />
          {{ $t("product_detail.description") }}</VTab
        >
        <VTab value="reviews">
          <VIcon icon="tabler-star" class="me-2" />
          {{ $t("product_detail.specifications") }}</VTab
        >
      </VTabs>

      <VDivider />

      <VWindow v-model="activeTab" class="pa-2 pb-6 pa-sm-6">
        <VWindowItem value="description">
          <div v-html="product.description"></div>
        </VWindowItem>

        <VWindowItem value="reviews">
          <ProductReviews
            v-if="product"
            :productId="product.id"
            :productName="product.name"
          />
        </VWindowItem>
      </VWindow>
    </VCard>
  </div>

  <!-- Related Products -->
  <div class="mb-10">
    <CategoryProductsSection
      :title="$t('product_detail.related_products')"
      :products="relatedProducts"
      :productsLoading="getRelatedProductsLoading"
    />
  </div>

  <!-- Snackbar -->
  <VSnackbar
    v-model="isSnackbarVisible"
    transition="scroll-y-reverse-transition"
    location="top end"
    :timeout="3000"
    :color="snackbarColor"
  >
    <span style="color: rgb(var(--v-theme-on-primary))">{{
      snackbarText
    }}</span>

    <template #actions>
      <VBtn
        color="rgb(var(--v-theme-on-primary))"
        @click="isSnackbarVisible = false"
      >
        Close
      </VBtn>
    </template>
  </VSnackbar>

  <Footer />
</template>

<script>
import { useCartStore } from "@/stores/useCartStore";
import axios from "axios";

import { register } from "swiper/element/bundle";
register();

import CategoryProductsSection from "@/components/costumComponents/CategoryProductsSection.vue";
import Footer from "@/components/costumComponents/Footer.vue";
import Header from "@/components/costumComponents/Header.vue";
import ProductCard from "@/components/costumComponents/ProductCard.vue";
import ProductReviews from "@/components/costumComponents/ProductReviews.vue";

export default {
  components: {
    Header,
    Footer,
    ProductCard,
    CategoryProductsSection,
    ProductReviews,
  },

  data() {
    return {
      quantity: 1,
      activeTab: "description",
      selectedOptions: {},
      selectedOptionsChips: {},
      showChips: false, // Toggle between select and chips
      thumbActiveIndex: 0,

      product: {},
      getProductByIdLoading: false,

      relatedProducts: [],
      getRelatedProductsLoading: true,

      isSnackbarVisible: false,
      snackbarText: "",
      snackbarColor: "",

      api_url: import.meta.env.VITE_API_URL,

      cartStore: useCartStore(),
    };
  },

  computed: {
    currentLanguage() {
      return this.$i18n.locale;
    },

    totalPricePerUnit() {
      if (!this.product || typeof this.product.price === "undefined") {
        return 0;
      }

      let optionsPrice = 0;
      if (this.selectedOptions) {
        for (const optionName in this.selectedOptions) {
          const selectedItem = this.selectedOptions[optionName];
          if (selectedItem && selectedItem.price_added) {
            optionsPrice += selectedItem.price_added;
          }
        }
      }

      return Number(this.product.price) + optionsPrice;
    },
    totalPrice() {
      return this.totalPricePerUnit * this.quantity;
    },
  },

  async mounted() {
    await this.getProductById();
    await this.getRelatedProducts();
  },

  methods: {
    async getProductById() {
      const productId = this.$route.params.id;
      this.getProductByIdLoading = true;
      this.thumbActiveIndex = 0;
      try {
        const response = await axios.get(
          `${this.api_url}/products/${productId}`,
          {
            params: {
              include_categories: true,
              include_images: true,
            },
            headers: {
              Accept: "application/json",
            },
          }
        );
        console.log(response.data.data);

        this.product = response.data.data;
        this.product.product_options = JSON.parse(this.product.product_options);
      } catch (error) {
        console.error("Error fetching product:", error);
        this.showSnackbar(this.$t("common.failed_to_load_product"), "error");
      } finally {
        this.getProductByIdLoading = false;
      }
    },

    async getRelatedProducts() {
      try {
        this.getRelatedProductsLoading = true;
        const response = await axios.get(`${this.api_url}/products`, {
          params: {
            ...(this.product?.categories?.length > 0
              ? { category_id: this.product.categories[0].id }
              : {}),
          },
          headers: {
            Accept: "application/json",
          },
        });
        this.relatedProducts = response.data.data;
      } catch (error) {
        console.error("Error fetching related products:", error);
        this.showSnackbar(
          this.$t("common.failed_to_load_related_products"),
          "error"
        );
      } finally {
        this.getRelatedProductsLoading = false;
      }
    },

    showSnackbar(text, color) {
      this.snackbarText = text;
      this.snackbarColor = color;
      this.isSnackbarVisible = true;
    },

    incrementQuantity() {
      this.quantity++;
    },

    decrementQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },

    addToCart() {
      const productToAdd = {
        ...this.product,
        selectedOptions: this.selectedOptions,
      };
      for (let index = 0; index < this.quantity; index++) {
        this.cartStore.addItem(productToAdd);
      }
      this.showSnackbar(
        `Added ${this.quantity} ${this.product.name} to cart`,
        "success"
      );
    },

    proceedToCheckout() {
      this.addToCart();
      this.$router.push("/checkout");
    },

    toggleWishlist() {
      this.product.inWishlist = !this.product.inWishlist;
      console.log(
        `${this.product.inWishlist ? "Added to" : "Removed from"} wishlist: ${
          this.product.name
        }`
      );
      // Here you would implement the actual wishlist functionality
    },

    thumbClick(index) {
      this.thumbActiveIndex = index;
    },
  },

  watch: {
    "$route.params.id": {
      async handler(newId, oldId) {
        if (newId && newId !== oldId) {
          window.scrollTo(0, 0); // Scroll to top on new product load
          await this.getProductById();
          await this.getRelatedProducts();
        }
      },
    },
  },
};
</script>

<script setup>
import "@styles/header.css";

definePage({
  meta: {
    layout: "blank",
    public: true,
  },
});
</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";

.section-title {
  font-size: 24px;
  font-weight: 800;
  line-height: 36px;
}

.section-title::after {
  position: absolute;
  background-image: url("@assets/images/section-title-icon.png");
  background-position: left bottom;
  background-repeat: no-repeat;
  background-size: contain;
  block-size: 100%;
  content: "";
  font-weight: 800;
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: -12%;
}

.swiper-container {
  background-color: #000;
}

.mySwiper {
  overflow: hidden;
  border-radius: 8px;
}

.mySwiper2 {
  margin-block-start: 10px;
}

.mySwiper2 .swiper-slide {
  overflow: hidden;
  border: 5px solid black;
  border-radius: 4px;
  block-size: 100%;
  cursor: pointer;
  opacity: 0.4;
}

.mySwiper2 .swiper-slide-thumb-active {
  border-color: var(--v-theme-primary);
  opacity: 1;
}

.product-detail-image {
  max-block-size: 400px;
  max-inline-size: 100%;
  min-inline-size: 100%;
  object-fit: contain;
}

.thumb-slide {
  block-size: 90px;
  cursor: pointer;
}

.thumbnail-image {
  border-radius: 8px;
  max-block-size: 120px;
  max-inline-size: 100%;
  object-fit: cover !important;
}

.product-thumbnail {
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: 2px solid transparent;
  border-radius: 6px;
  block-size: 100%;
  cursor: pointer;
  transition: all 0.2s;
}

.active-thumbnail {
  border: 2px solid var(--v-primary-base);
  transform: scale(1.05);
}

.color-option {
  border-radius: 50%;
  block-size: 30px;
  cursor: pointer;
  inline-size: 30px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option-active {
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--v-primary-base);
}

.quantity-selector {
  border: 1px solid rgba(0, 0, 0, 12%);
  border-radius: 4px;
  padding-block: 4px;
  padding-inline: 8px;
}

td {
  inline-size: auto;
}

.skeleton-image {
  block-size: 100%;
  inline-size: 100%;
}

.skeleton-heading {
  block-size: 32px;
  inline-size: 70%;
}

.skeleton-text-short {
  block-size: 20px;
  inline-size: 40%;
  margin-block-start: 12px;
}

.skeleton-text-medium {
  block-size: 24px;
  inline-size: 30%;
  margin-block-start: 16px;
}

.skeleton-paragraph-line {
  block-size: 16px;
  inline-size: 100%;
  margin-block-start: 20px;
}

.skeleton-chip {
  border-radius: 16px;
  block-size: 32px;
  inline-size: 80px;
  margin-inline-end: 8px;
}

.skeleton-divider {
  block-size: 1px;
  inline-size: 100%;
  margin-block-start: 16px;
}

.skeleton-quantity-selector {
  border-radius: 4px;
  block-size: 42px;
  inline-size: 120px;
}

.skeleton-button {
  border-radius: 6px;
  block-size: 44px;
  inline-size: 100%;
  margin-block-end: 12px;
}
</style>
