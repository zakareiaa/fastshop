<template>
  <Header />

  <div class="app-container py-7 product-page-container">
    <VCard
      variant="flat"
      class="product-card-container"
      style="background-color: rgb(var(--v-theme-background))"
    >
      <VCardText class="pa-0 product-content">
        <!-- Skeleton Loader State -->
        <VRow v-if="getProductByIdLoading">
          <VCol cols="12" md="7">
            <div class="skeleton b-radius-0 skeleton-image"></div>
            <VRow>
              <VCol v-for="i in 4" :key="`sk-thumb-${i}`" cols="3">
                <div class="skeleton b-radius-0 skeleton-thumbnail"></div>
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="12" md="5">
            <div class="skeleton b-radius-0 skeleton-heading"></div>
            <div class="skeleton b-radius-0 skeleton-text-short"></div>
            <!-- Rating + reviews count -->
            <div class="skeleton b-radius-0 skeleton-text-medium"></div>
            <!-- Price -->
            <div class="skeleton b-radius-0 skeleton-paragraph-line"></div>
            <!-- Short description -->
            <div
              class="skeleton b-radius-0 skeleton-paragraph-line"
              style="inline-size: 80%"
            ></div>
            <div
              class="skeleton b-radius-0 skeleton-paragraph-line"
              style="inline-size: 90%; margin-block-end: 1.5rem"
            ></div>
            <div class="d-flex flex-wrap ga-2 mb-4">
              <!-- Categories -->
              <div class="skeleton b-radius-0 skeleton-chip"></div>
              <div class="skeleton b-radius-0 skeleton-chip"></div>
              <div class="skeleton b-radius-0 skeleton-chip"></div>
            </div>
            <div class="skeleton b-radius-0 skeleton-divider"></div>
            <div class="d-flex align-center mb-6 mt-6">
              <div class="skeleton b-radius-0 skeleton-quantity-selector"></div>
            </div>
            <div class="skeleton b-radius-0 skeleton-button"></div>
            <div class="skeleton b-radius-0 skeleton-button"></div>
            <div
              class="skeleton b-radius-0 skeleton-text-short"
              style="margin-block-start: 1.5rem"
            ></div>
            <!-- Shipping -->
            <div class="skeleton b-radius-0 skeleton-text-medium"></div>
            <!-- EMI -->
          </VCol>
        </VRow>

        <!-- Actual Product Content -->
        <VRow
          v-else-if="!getProductByIdLoading && product.id"
          class="position-relative"
        >
          <!-- Product Image -->
          <VCol cols="12" md="7" class="product-image-sticky-col">
            <div class="swiper-container-wrapper">
              <swiper-container
                class="mySwiper mb-4 swiper-container-product-detail"
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
                    style="inline-size: 100%; object-fit: cover"
                    @click="openImagePreview(image.image_url)"
                  />

                  <div class="zoom-wishlist-icons">
                    <VBtn
                      icon="tabler-zoom-in"
                      @click="openImagePreview(image.image_url)"
                    ></VBtn>
                    <VBtn
                      :icon="
                        isInWishlist ? 'tabler-heart-filled' : 'tabler-heart'
                      "
                      @click.stop="toggleWishlist()"
                    >
                    </VBtn>
                  </div>
                </swiper-slide>
              </swiper-container>

              <swiper-container
                class="mySwiper2"
                loop="true"
                free-mode="true"
                events-prefix="swiper-"
                slides-per-view="4"
                :breakpoints="{
                  0: { slidesPerView: 2.5 },
                  600: { slidesPerView: 3.2 },
                  900: { slidesPerView: 4.3 },
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
          <VCol cols="12" md="5" class="d-flex flex-column">
            <div>
              <div class="d-flex align-center mb-2">
                <h1 class="text-h2 text-md-h2 text-h3 font-weight-normal">
                  {{ product.name }}
                </h1>
                <!-- <div class="ms-4">
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
                </div> -->
              </div>

              <!-- <div class="d-flex align-center mb-4">
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
              </div> -->
              <div class="d-flex align-end mb-4">
                <h2 class="text-h4 text-primary font-weight-normal me-3">
                  {{ product.price }} DA
                </h2>
                <span
                  v-if="product.old_price"
                  class="text-h5 text-decoration-line-through text-disabled"
                >
                  {{ product.old_price }} DA
                </span>
              </div>

              <!-- <p class="text-body-1 mb-6">{{ product.short_description }}</p> -->
            </div>

            <div>
              <!-- Product Options -->
              <div
                v-if="
                  product.product_options && product.product_options.length > 0
                "
              >
                <div
                  v-for="option in product.product_options"
                  :key="option.name"
                  class="mb-4"
                >
                  <p class="text-body-1 font-weight-medium mb-1">
                    {{ option.name }}
                  </p>
                  <VChipGroup
                    :model-value="selectedOptions[option.name]"
                    @update:model-value="
                      updateSelectedOption(option.name, $event)
                    "
                    mandatory
                    active-class="selected-chip"
                  >
                    <VChip
                      v-for="item in option.items"
                      :key="item.name"
                      :value="item"
                      label
                      class="select-item-ship"
                      :class="{
                        'text-decoration-line-through':
                          item.stock_quantity === 0,
                      }"
                      :disabled="item.stock_quantity === 0"
                    >
                      {{ item.name }}
                      <VBadge
                        v-if="item.price_added > 0"
                        color="success"
                        :content="`+${item.price_added} DA`"
                        inline
                        class="ms-2"
                      />
                      <!-- <span v-if="item.stock_quantity === 0" class="ms-2 text-error">
                      ({{$t('product_detail.out_of_stock')}})
                      </span> -->
                    </VChip>
                  </VChipGroup>
                </div>
              </div>

              <VDivider class="mb-6" />

              <!-- Quantity -->
              <div class="d-flex align-center mb-6">
                <span class="text-body-1 font-weight-medium me-4"
                  >{{ $t("product_detail.quantity") }}:</span
                >
                <div
                  class="quantity-selector d-flex align-center"
                  :style="{
                    border: `1px solid ${
                      $vuetify.theme.current.dark
                        ? 'rgba(255,255,255,0.12)'
                        : 'rgba(0,0,0,0.12)'
                    }`,
                  }"
                >
                  <VBtn
                    icon="tabler-minus"
                    variant="text"
                    size="small"
                    @click="decrementQuantity"
                    :disabled="quantity <= 1"
                  />
                  <span class="mx-4 text-body-1">{{ quantity }}</span>
                  <VBtn
                    icon="tabler-plus"
                    variant="text"
                    size="small"
                    @click="incrementQuantity"
                  />
                </div>
              </div>

              <!-- Stock Warning Message -->
              <div v-if="stockWarningMessage" class="mb-4">
                <VAlert
                  type="warning"
                  variant="tonal"
                  class="text-body-2"
                  density="compact"
                >
                  {{ stockWarningMessage }}
                </VAlert>
              </div>

              <div
                class="d-flex justify-end align-center my-4"
                v-if="quantity > 1 || product.product_options.length > 0"
              >
                <span class="text-body-1 font-weight-medium me-2"
                  >{{ $t("cart.total") }}:</span
                >
                <h3 class="text-h6 text-primary font-weight-bold">
                  {{ totalPrice }} DA
                </h3>
              </div>

              <!-- Action Buttons -->
              <div class="d-flex align-center flex-column">
                <VBtn
                  color="primary"
                  variant="tonal"
                  prepend-icon="tabler-shopping-bag"
                  @click="proceedToCheckout"
                  class="w-100 mb-3 b-radius-0"
                >
                  {{ $t("build_pc.proceed_to_checkout") }}
                </VBtn>
                <VBtn
                  color="primary"
                  class="w-100 b-radius-0"
                  prepend-icon="tabler-shopping-cart"
                  @click="addToCart"
                >
                  {{ $t("product_detail.add_to_cart") }}
                </VBtn>
              </div>

              <div class="mt-6 d-flex align-center">
                <VIcon icon="tabler-truck-delivery" class="me-2" />
                <span class="text-body-2">{{
                  $t("product_detail.shipping_info")
                }}</span>
              </div>

              <div class="mt-2 d-flex align-center">
                <VIcon icon="tabler-credit-card" class="me-2" />
                <span class="text-body-2 text-xs">{{
                  $t("product_detail.emi_info")
                }}</span>
              </div>

              <VDivider class="mt-3"></VDivider>

              <div v-html="product.description" class="mt-6"></div>

              <!-- Size Chart Table -->
              <div
                v-if="parsedMeasurements && parsedMeasurements.length > 0"
                class="mt-8"
              >
                <h3 class="text-h6 font-weight-bold mb-4">
                  {{ $t("product_detail.size_chart") }}
                </h3>

                <VTable class="size-chart-table">
                  <thead>
                    <tr>
                      <th class="text-center font-weight-bold">
                        {{ $t("product_detail.size") }}
                      </th>
                      <th class="text-center font-weight-bold">
                        {{ $t("product_detail.width") }}
                      </th>
                      <th class="text-center font-weight-bold">
                        {{ $t("product_detail.length") }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="measurement in parsedMeasurements"
                      :key="measurement.size"
                    >
                      <td class="text-center font-weight-medium">
                        {{ measurement.size }}
                      </td>
                      <td class="text-center">{{ measurement.width }}</td>
                      <td class="text-center">{{ measurement.length }}</td>
                    </tr>
                  </tbody>
                </VTable>
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
            <VBtn
              color="primary"
              @click="$router.push('/shop')"
              class="b-radius-0"
            >
              {{ $t("header.shop") }}
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>

  <!-- Related Products -->
  <div>
    <CategoryProductsSection
      :title="$t('product_detail.related_products')"
      :products="relatedProducts"
      :productsLoading="getRelatedProductsLoading"
    />
  </div>

  <VCard
    variant="flat"
    class="app-container product-card-container mt-3 pb-12"
    style="background-color: rgb(var(--v-theme-background)) !important"
  >
    <ProductReviews
      v-if="product && product.id"
      :productId="product.id"
      :productName="product.name"
    />
  </VCard>

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

  <!-- Full Screen Image Preview Modal -->
  <VDialog v-model="imagePreviewDialog" max-width="90vw" max-height="90vh">
    <VCard class="image-preview-card">
      <VCardText class="pa-0 position-relative">
        <VBtn
          icon="tabler-x"
          variant="elevated"
          class="position-absolute close-btn"
          style="z-index: 10; inset-block-start: 16px; inset-inline-end: 16px"
          @click="imagePreviewDialog = false"
        />
        <img
          :src="previewImageUrl"
          alt="Product preview"
          class="preview-image w-100"
          style="max-block-size: 85vh; object-fit: contain"
        />
      </VCardText>
    </VCard>
  </VDialog>

  <Footer />
</template>

<script>
import { useCartStore } from "@/stores/useCartStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
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

      // Stock warning message
      stockWarningMessage: "",

      // Image preview
      imagePreviewDialog: false,
      previewImageUrl: "",

      api_url: import.meta.env.VITE_API_URL,

      cartStore: useCartStore(),
      wishlistStore: useWishlistStore(),
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

    isInWishlist() {
      return (
        this.product.id && this.wishlistStore.isInWishlist(this.product.id)
      );
    },

    // Get the current stock quantity based on selected options
    currentStockQuantity() {
      if (
        !this.product.product_options ||
        this.product.product_options.length === 0
      ) {
        return null; // No stock limit if no options
      }

      let minStock = Infinity;
      let hasValidStock = false;
      let hasUnlimitedStock = false;

      // Check stock for all selected options
      for (const optionName in this.selectedOptions) {
        const selectedItem = this.selectedOptions[optionName];
        if (selectedItem) {
          // Check if stock is unlimited (null or empty string)
          if (
            selectedItem.stock_quantity === null ||
            selectedItem.stock_quantity === ""
          ) {
            hasUnlimitedStock = true;
          } else {
            const stock = parseInt(selectedItem.stock_quantity) || 0;
            minStock = Math.min(minStock, stock);
            hasValidStock = true;
          }
        }
      }

      // If any option has unlimited stock, return null (unlimited)
      if (hasUnlimitedStock && !hasValidStock) {
        return null;
      }

      // If we have both limited and unlimited stock, return the limited stock
      return hasValidStock ? minStock : null;
    },

    // Parse measurements from JSON string
    parsedMeasurements() {
      if (!this.product.measurements) {
        return [];
      }

      try {
        // Check if it's already an object or a string that needs parsing
        if (typeof this.product.measurements === "string") {
          return JSON.parse(this.product.measurements);
        }
        return this.product.measurements;
      } catch (parseError) {
        console.warn("Failed to parse measurements:", parseError);
        return [];
      }
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

        // Check if response has valid data
        if (!response.data || !response.data.data) {
          throw new Error("Invalid response data");
        }

        this.product = response.data.data;

        // Safely parse product_options if it exists and is a string
        if (this.product.product_options) {
          try {
            // Check if it's already an object or a string that needs parsing
            if (typeof this.product.product_options === "string") {
              this.product.product_options = JSON.parse(
                this.product.product_options
              );
            }
          } catch (parseError) {
            console.warn("Failed to parse product_options:", parseError);
            // Set to empty array if parsing fails
            this.product.product_options = [];
          }
        } else {
          // Set to empty array if product_options doesn't exist
          this.product.product_options = [];
        }

        // Initialize selected options after product is loaded
        this.initializeSelectedOptions();
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

        // Check if response has valid data
        if (response.data && response.data.data) {
          this.relatedProducts = response.data.data;
        } else {
          this.relatedProducts = [];
        }
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
      const stockLimit = this.currentStockQuantity;

      if (stockLimit !== null && this.quantity >= stockLimit) {
        // Show warning message when trying to exceed stock
        this.stockWarningMessage =
          this.$t("product.stock_limit_reached", { count: stockLimit }) +
          ". " +
          this.$t("product.cannot_exceed_stock");

        // Auto-hide the message after 5 seconds
        setTimeout(() => {
          this.stockWarningMessage = "";
        }, 10000);

        return;
      }

      this.quantity++;
      this.stockWarningMessage = ""; // Clear any existing warning
    },

    decrementQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
        this.stockWarningMessage = ""; // Clear any existing warning
      }
    },

    addToCart() {
      console.log(
        "Adding to cart - Product:",
        this.product.id,
        "Options:",
        this.selectedOptions
      );

      const stockLimit = this.currentStockQuantity;

      // Check current cart quantity for this product with same options
      const existingCartQuantity = this.cartStore.getProductQuantity(
        this.product.id,
        this.selectedOptions
      );

      let quantityToAdd = this.quantity;
      let warningMessage = "";

      // If there's a stock limit, validate the total quantity
      if (stockLimit !== null) {
        const totalQuantity = existingCartQuantity + this.quantity;

        if (existingCartQuantity >= stockLimit) {
          // Already at max quantity in cart
          this.stockWarningMessage = this.$t("product.max_quantity_in_cart");
          setTimeout(() => {
            this.stockWarningMessage = "";
          }, 5000);
          return;
        }

        if (totalQuantity > stockLimit) {
          // Adjust quantity to what's available
          quantityToAdd = stockLimit - existingCartQuantity;
          warningMessage = this.$t("product.limited_quantity_added", {
            count: quantityToAdd,
          });
        }
      }

      // Create a deep copy of selectedOptions to avoid reference issues
      const selectedOptionsCopy = JSON.parse(
        JSON.stringify(this.selectedOptions)
      );

      const productToAdd = {
        ...this.product,
        selectedOptions: selectedOptionsCopy,
        quantity: quantityToAdd,
      };

      this.cartStore.addItem(productToAdd);

      // Show appropriate message
      if (warningMessage) {
        this.stockWarningMessage = warningMessage;
        setTimeout(() => {
          this.stockWarningMessage = "";
        }, 5000);
      } else {
        this.showSnackbar(
          `Added ${quantityToAdd} ${this.product.name} to cart`,
          "success"
        );
      }
    },

    proceedToCheckout() {
      const stockLimit = this.currentStockQuantity;

      // Check current cart quantity for this product with same options
      const existingCartQuantity = this.cartStore.getProductQuantity(
        this.product.id,
        this.selectedOptions
      );

      // If there's a stock limit and we're already at max, don't proceed
      if (stockLimit !== null && existingCartQuantity >= stockLimit) {
        this.stockWarningMessage = this.$t("product.max_quantity_in_cart");
        setTimeout(() => {
          this.stockWarningMessage = "";
        }, 5000);
        return;
      }

      this.addToCart();

      // Only navigate if no warning message (item was successfully added)
      if (!this.stockWarningMessage) {
        this.$router.push("/checkout");
      }
    },

    toggleWishlist() {
      if (this.product.id) {
        const wasAdded = this.wishlistStore.toggleItem(this.product);
        this.showSnackbar(
          wasAdded
            ? "Product added to wishlist!"
            : "Product removed from wishlist!",
          "success"
        );
      }
    },

    thumbClick(index) {
      this.thumbActiveIndex = index;
    },

    openImagePreview(imageUrl) {
      this.previewImageUrl = imageUrl;
      this.imagePreviewDialog = true;
    },

    updateSelectedOption(optionName, selectedValue) {
      console.log("Option changed:", optionName, "→", selectedValue.name);
      this.selectedOptions[optionName] = selectedValue;

      // Check if current quantity exceeds new stock limit
      const newStockLimit = this.currentStockQuantity;

      // Only validate if there's a stock limit (not unlimited)
      if (newStockLimit !== null && this.quantity > newStockLimit) {
        const previousQuantity = this.quantity;
        this.quantity = Math.max(1, newStockLimit); // Set to stock limit or 1, whichever is higher

        if (newStockLimit === 0) {
          this.quantity = 1; // Keep quantity at 1 even if no stock
          this.stockWarningMessage = this.$t("product.stock_unavailable");
        } else if (previousQuantity > newStockLimit) {
          this.stockWarningMessage = this.$t("product.quantity_adjusted", {
            quantity: this.quantity,
          });
        }

        // Auto-hide the message after 5 seconds
        setTimeout(() => {
          this.stockWarningMessage = "";
        }, 5000);
      } else {
        this.stockWarningMessage = ""; // Clear any existing warning
      }
    },

    initializeSelectedOptions() {
      console.log("Initializing options for product:", this.product.id);
      // Create a completely new reactive object
      const newSelectedOptions = {};

      if (
        this.product.product_options &&
        this.product.product_options.length > 0
      ) {
        // Initialize with best available option for each product option type
        this.product.product_options.forEach((option) => {
          if (option.items && option.items.length > 0) {
            console.log(`Processing option: ${option.name}`, option.items);

            // Find first option with available stock (stock > 0 OR unlimited stock)
            const availableOption = option.items.find((item) => {
              // Check if stock is unlimited (null or empty string)
              const isUnlimited =
                item.stock_quantity === null || item.stock_quantity === "";

              // Check if stock quantity > 0
              const stockQty = parseInt(item.stock_quantity);
              const hasLimitedStock = !isNaN(stockQty) && stockQty > 0;

              const hasStock = isUnlimited || hasLimitedStock;
              console.log(
                `  ${item.name}: stock_quantity=${item.stock_quantity}, isUnlimited=${isUnlimited}, hasLimitedStock=${hasLimitedStock}, hasStock=${hasStock}`
              );
              return hasStock;
            });

            // Select first available option or fallback to first option
            const selected = availableOption || option.items[0];
            console.log(`  Selected for ${option.name}:`, selected);
            newSelectedOptions[option.name] = selected;
          }
        });
      }

      // Replace the entire selectedOptions object to ensure reactivity
      this.selectedOptions = newSelectedOptions;
      console.log("Final options initialized:", this.selectedOptions);
    },
  },

  watch: {
    // Watch for product changes to reset selectedOptions
    "product.id": {
      handler(newId, oldId) {
        if (newId && newId !== oldId) {
          console.log("Product ID changed, reinitializing options");
          this.initializeSelectedOptions();
        }
      },
      immediate: false,
    },

    "$route.params.id": {
      async handler(newId, oldId) {
        if (newId && newId !== oldId) {
          window.scrollTo(0, 0); // Scroll to top on new product load
          await this.getProductById();
          await this.getRelatedProducts();
        }
      },
    },
    product: {
      handler(newVal, oldVal) {
        if (newVal && newVal.id && (!oldVal || newVal.id !== oldVal.id)) {
          console.log("Product changed, reinitializing options");
          this.initializeSelectedOptions();
        }
      },
      immediate: false, // Don't run on component mount since we call it in getProductById
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

// Ensure parent containers don't interfere with sticky positioning
.product-page-container {
  overflow: visible !important;
}

.product-card-container {
  overflow: visible !important;
}

.product-content {
  overflow: visible !important;
}

// Apply sticky positioning with higher specificity
.product-image-sticky-col {
  position: sticky !important;
  z-index: 10 !important;
  align-self: start !important;
  inset-block-start: 10px !important;
}

// Mobile responsive - disable sticky on mobile
@media (max-width: 960px) {
  .product-image-sticky-col {
    position: static !important;
  }
}

.v-chip--selected {
  background: rgb(var(--v-theme-on-background)) !important;
  color: rgb(var(--v-theme-background)) !important;
}

.section-title {
  font-size: 28px;
  font-weight: 800;
  line-height: 36px;
}

.swiper-container {
  background-color: #000;
}

.mySwiper {
  overflow: hidden;
  cursor: pointer;
}

.mySwiper2 {
  margin-block-start: 10px;
}

.mySwiper2 .swiper-slide {
  overflow: hidden;
  border: 5px solid black;
  block-size: 100%;
  cursor: pointer;
  opacity: 0.4;
}

.mySwiper2 .swiper-slide-thumb-active {
  border-color: var(--v-theme-primary);
  opacity: 1;
}

.product-detail-image {
  inline-size: 100%;
  max-block-size: 600px;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@media (max-width: 450px) {
  .product-detail-image {
    max-block-size: 400px;
  }
}

.mySwiper:hover .product-detail-image {
  transform: scale(1.05);
}

.thumb-slide {
  block-size: 90px;
  cursor: pointer;
}

.thumbnail-image {
  inline-size: 100%;

  // max-block-size: 120px;
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
  border-radius: 0;
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
  border-radius: 0;
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
  border-radius: 0;
  block-size: 42px;
  inline-size: 120px;
}

.skeleton-button {
  border-radius: 0;
  block-size: 44px;
  inline-size: 100%;
  margin-block-end: 12px;
}

.image-preview-card {
  background: transparent !important;
  box-shadow: none !important;
}

.preview-image {
  border-radius: 0;
}

.close-btn {
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.close-btn:hover {
  opacity: 1;
}

.zoom-wishlist-icons {
  position: absolute;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 8px;
  inset-block-start: 10px;
  inset-inline-end: 10px;
}

.select-item-ship {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  min-inline-size: 60px;
}

.size-chart-table {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 0;

  th {
    background-color: rgba(var(--v-theme-surface), 0.8);
    border-block-end: 1px solid
      rgba(var(--v-border-color), var(--v-border-opacity));
    font-size: 0.875rem;
    padding-block: 12px;
    padding-inline: 16px;
  }

  td {
    border-block-end: 1px solid
      rgba(var(--v-border-color), var(--v-border-opacity));
    font-size: 0.875rem;
    padding-block: 12px;
    padding-inline: 16px;
  }

  tr:last-child td {
    border-block-end: none;
  }
}

// Responsive adjustments for the table
@media (max-width: 600px) {
  .size-chart-table {
    th,
    td {
      font-size: 0.8rem;
      padding-block: 8px;
      padding-inline: 12px;
    }
  }
}
</style>
