<template>
  <Header />

  <div class="app-container py-6">
    <VRow>
      <!-- Desktop Filters sidebar -->
      <VCol cols="12" md="3" class="filters-sidebar d-none d-md-block">
        <div class="d-flex justify-space-between mb-6">
          <div class="position-relative mb-1 me-2">
            <div class="section-title">{{ $t("shop.title") }}</div>
          </div>
        </div>
        <VCard class="pa-4">
          <h3 class="text-h5 font-weight-bold mb-4">
            {{ $t("shop.filters") }}
          </h3>

          <!-- Price Range Filter -->
          <div class="mb-6">
            <h4 class="text-subtitle-1 font-weight-bold mb-4">
              {{ $t("shop.price_range") }}
            </h4>

            <!-- Min/Max Price Inputs -->
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="price-input-container">
                <VTextField
                  :label="$t('shop.min_price')"
                  v-model.number="priceRange[0]"
                  min="0"
                  max="1000000"
                  hide-details
                  variant="outlined"
                  class="price-input"
                  density="compact"
                  @update:model-value="handlePriceInputChange"
                />
                <!-- prefix="DA" -->
              </div>

              <div class="mx-2 text-medium-emphasis">—</div>

              <div class="price-input-container">
                <VTextField
                  :label="$t('shop.max_price')"
                  v-model.number="priceRange[1]"
                  min="0"
                  max="1000000"
                  hide-details
                  variant="outlined"
                  class="price-input"
                  density="compact"
                  @update:model-value="handlePriceInputChange"
                />
              </div>
            </div>

            <!-- <VRangeSlider
              v-model="priceRange"
              :min="0"
              :max="500000"
              :step="1000"
              color="primary"
              @update:model-value="handlePriceRangeChange"
            /> -->
          </div>

          <!-- Categories Filter -->
          <div class="mb-6" v-if="categories.length > 0">
            <h4 class="text-subtitle-1 font-weight-bold mb-3">
              {{ $t("shop.categories") }}
            </h4>
            <VRadioGroup v-model="selectedCategory" hide-details>
              <VRadio
                v-for="category in categories"
                :key="category.id"
                :label="
                  category.id === 0
                    ? $t('shop.all')
                    : category[`name_${currentLanguage}`] || category.name
                "
                :value="category.id"
              />
            </VRadioGroup>
          </div>

          <!-- Attributes Filter -->
          <div
            v-if="categories[selectedCategoryIndex]?.attributes"
            class="mb-4"
            v-for="attribute in categories[selectedCategoryIndex]?.attributes"
            :key="attribute?.id"
          >
            <h4 class="text-subtitle-1 font-weight-bold mb-3">
              {{ attribute?.name }}
            </h4>
            <VCheckbox
              v-for="item in attribute?.items"
              :key="item?.id"
              :label="item?.value"
              :model-value="isAttributeSelected(item.id)"
              @update:model-value="toggleAttribute(item.id)"
              hide-details
              class="my-1"
            />
          </div>
        </VCard>
      </VCol>

      <!-- Products Grid -->
      <VCol cols="12" md="9">
        <!-- Mobile Page Title and Filter Button -->
        <div class="d-md-none mb-4">
          <div class="d-flex justify-space-between align-center">
            <div class="position-relative">
              <div class="section-title">{{ $t("shop.title") }}</div>
            </div>
            <VBtn
              variant="outlined"
              color="primary"
              @click="mobileFiltersDrawer = true"
              prepend-icon="tabler-filter"
            >
              {{ $t("shop.filters") }}
            </VBtn>
          </div>
        </div>

        <div class="d-flex justify-space-between align-end mb-6">
          <div class="text-subtitle-1">
            <span v-if="getProductsLoading">{{
              $t("shop.loading_products")
            }}</span>
            <span v-else
              >{{ totalProducts }} {{ $t("shop.results_found") }}</span
            >
          </div>
          <div class="d-flex align-center">
            <!-- <VSelect
              v-model="per_page"
              :items="[10, 15, 25, 50]"
              label="Show"
              class="sort-select bg-white"
              @update:model-value="getProducts()"
            /> -->

            <VSelect
              v-model="sortBy"
              :items="[
                $t('shop.price_low_to_high'),
                $t('shop.price_high_to_low'),
                $t('shop.newest_first'),
              ]"
              :label="$t('shop.sort_by')"
              hide-details
              class="sort-select"
              :class="{ 'bg-white': !$vuetify.theme.current.dark }"
              @update:model-value="handleSortChange"
            />

            <div class="ms-3 d-none d-md-block">
              <VBtn
                variant="tonal"
                icon="tabler-layout-grid"
                class="me-1"
                :color="viewMode === 'grid' ? 'primary' : undefined"
                @click="viewMode = 'grid'"
              />
              <VBtn
                variant="tonal"
                icon="tabler-layout-list"
                :color="viewMode === 'list' ? 'primary' : undefined"
                @click="viewMode = 'list'"
              />
            </div>
          </div>
        </div>

        <div class="search-field-container mb-4 d-flex align-center">
          <VTextField
            v-model="searchQuery"
            :placeholder="$t('shop.search_placeholder')"
            prepend-inner-icon="tabler-search"
            class="search-field"
            :class="{ 'bg-white': !$vuetify.theme.current.dark }"
            variant="outlined"
          />
        </div>

        <VRow>
          <VCol
            v-for="product in products"
            :key="product.id"
            cols="6"
            :sm="viewMode === 'grid' ? 4 : 12"
            :lg="viewMode === 'grid' ? 3 : 12"
            v-show="!getProductsLoading && products.length > 0"
          >
            <ProductCard :productProp="product" :viewMode="viewMode" />
          </VCol>

          <VCol cols="12" v-show="products.length === 0 && !getProductsLoading">
            <VCard
              class="d-flex flex-column align-center justify-center py-8 elevation-1"
            >
              <VIcon
                icon="tabler-basket-off"
                size="64"
                color="grey"
                class="mb-4"
              />
              <h3 class="text-h5 font-weight-medium text-center">
                {{ $t("shop.no_products_found") }}
              </h3>
              <p class="text-body-1 text-center text-medium-emphasis mt-2">
                {{ $t("shop.no_products_message") }}
              </p>
              <VBtn color="primary" @click="resetFilters">
                {{ $t("shop.reset_filters") }}
              </VBtn>
            </VCard>
          </VCol>

          <!-- skeleton -->
          <VCol
            v-for="i in 12"
            :key="i"
            cols="6"
            :sm="viewMode === 'grid' ? 4 : 12"
            :lg="viewMode === 'grid' ? 3 : 12"
            v-show="getProductsLoading"
          >
            <div
              class="skeleton"
              style="border-radius: 8px; block-size: 380px; inline-size: 100%"
            ></div>
          </VCol>

          <!-- Pagination -->
          <VCol
            cols="12"
            class="mt-4"
            v-show="!getProductsLoading && products.length > 0"
          >
            <VPagination
              v-model="page"
              :length="Math.ceil(totalProducts / per_page)"
              @update:model-value="getProducts()"
            />
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </div>

  <Footer />

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
        {{ $t("common.close") }}
      </VBtn>
    </template>
  </VSnackbar>

  <!-- Mobile Filters Drawer -->
  <VNavigationDrawer
    v-model="mobileFiltersDrawer"
    temporary
    location="start"
    :width="320"
    class="mobile-filters-drawer"
    elevation="0"
  >
    <!-- Drawer Header -->
    <div
      class="drawer-header px-6 py-4 d-flex align-center justify-space-between"
    >
      <h3 class="text-h5 font-weight-bold">{{ $t("shop.filters") }}</h3>
      <VBtn
        icon
        variant="text"
        @click="mobileFiltersDrawer = false"
        size="small"
      >
        <VIcon size="20">tabler-x</VIcon>
      </VBtn>
    </div>

    <VDivider />

    <div class="px-6 py-4 filters-content">
      <!-- Price Range Filter -->
      <div class="mb-6">
        <h4 class="text-subtitle-1 font-weight-bold mb-4">
          {{ $t("shop.price_range") }}
        </h4>

        <!-- Min/Max Price Inputs -->
        <div class="d-flex align-center justify-space-between mb-3">
          <div class="price-input-container">
            <VTextField
              :label="$t('shop.min_price')"
              v-model.number="priceRange[0]"
              min="0"
              max="1000000"
              hide-details
              variant="outlined"
              class="price-input"
              density="compact"
              @update:model-value="handlePriceInputChange"
            />
          </div>

          <div class="mx-2 text-medium-emphasis">—</div>

          <div class="price-input-container">
            <VTextField
              :label="$t('shop.max_price')"
              v-model.number="priceRange[1]"
              min="0"
              max="1000000"
              hide-details
              variant="outlined"
              class="price-input"
              density="compact"
              @update:model-value="handlePriceInputChange"
            />
          </div>
        </div>
      </div>

      <!-- Categories Filter -->
      <div class="mb-6" v-if="categories.length > 0">
        <h4 class="text-subtitle-1 font-weight-bold mb-3">
          {{ $t("shop.categories") }}
        </h4>
        <VRadioGroup v-model="selectedCategory" hide-details>
          <VRadio
            v-for="category in categories"
            :key="category.id"
            :label="
              category.id === 0
                ? $t('shop.all')
                : category[`name_${currentLanguage}`] || category.name
            "
            :value="category.id"
          />
        </VRadioGroup>
      </div>

      <!-- Attributes Filter -->
      <div
        v-if="categories[selectedCategoryIndex]?.attributes"
        class="mb-4"
        v-for="attribute in categories[selectedCategoryIndex]?.attributes"
        :key="attribute?.id"
      >
        <h4 class="text-subtitle-1 font-weight-bold mb-3">
          {{ attribute?.name }}
        </h4>
        <VCheckbox
          v-for="item in attribute?.items"
          :key="item?.id"
          :label="item?.value"
          :model-value="isAttributeSelected(item.id)"
          @update:model-value="toggleAttribute(item.id)"
          hide-details
          class="my-1"
        />
      </div>
    </div>

    <!-- Drawer Footer with Actions -->
    <div class="drawer-footer pa-4 mt-auto">
      <VDivider class="mb-4" />
      <div class="d-flex flex-wrap gap-2">
        <VBtn variant="outlined" color="secondary" block @click="resetFilters">
          {{ $t("shop.reset_filters") }}
        </VBtn>
        <VBtn
          variant="flat"
          color="primary"
          block
          @click="mobileFiltersDrawer = false"
        >
          {{ $t("shop.apply_filters") }}
        </VBtn>
      </div>
    </div>
  </VNavigationDrawer>
</template>

<script>
import axios from "axios";
import { debounce } from "lodash";

import Footer from "@/components/costumComponents/Footer.vue";
import Header from "@/components/costumComponents/Header.vue";
import ProductCard from "@/components/costumComponents/ProductCard.vue";

export default {
  setup() {
    return {
      debounce,
    };
  },

  components: {
    Header,
    Footer,
    ProductCard,
  },

  computed: {
    currentLanguage() {
      return this.$i18n.locale;
    },

    selectedCategoryIndex() {
      return this.categories.findIndex(
        (category) => category.id === this.selectedCategory
      );
    },
  },

  data() {
    return {
      searchQuery: "",
      viewMode: "grid",
      sortBy: null,
      priceRange: [0, 1000000],
      categories: [],
      selectedCategory: 0,
      brands: [],

      products: [],
      getProductsLoading: false,

      selectedAttributes: [],

      page: 1,
      per_page: 16,
      totalProducts: null,

      isSnackbarVisible: false,
      snackbarText: "",
      snackbarColor: "",

      // Mobile filters drawer
      mobileFiltersDrawer: false,

      api_url: import.meta.env.VITE_API_URL,
    };
  },

  created() {
    this.debouncedSearch = debounce(() => {
      this.page = 1;
      this.getProducts();
    }, 500);

    this.debouncedPriceRange = debounce(() => {
      console.log("Price range changed");
      this.page = 1;
      this.getProducts();
    }, 800);
  },

  mounted() {
    this.searchQuery = this.$route.query.search || "";
    const categoryId = this.$route.query.category_id || 0;
    this.selectedCategory = parseInt(categoryId);

    // this.$router.replace("/shop");

    this.getAllCategories();
    this.getProducts();
  },

  watch: {
    "$route.query.category_id"(newVal) {
      this.selectedCategory = parseInt(newVal) || 0;
      this.page = 1;
      this.getProducts();
    },

    "$route.query.search"(newVal) {
      this.searchQuery = newVal || "";
      this.page = 1;
      this.getProducts();
    },

    selectedCategory() {
      console.log(this.selectedCategory);

      console.log(this.categories[this.selectedCategoryIndex]?.attributes);

      this.page = 1;
      this.selectedAttributes = [];
      this.getProducts();
    },

    selectedAttributes() {
      this.page = 1;
      this.getProducts();
    },

    searchQuery() {
      this.debouncedSearch();
    },
  },

  methods: {
    async getAllCategories() {
      try {
        const response = await axios.get(this.api_url + "/categories", {
          params: {
            per_page: -1,
            include_attributes: true,
          },
          headers: {
            Accept: "application/json",
          },
        });
        console.log(response.data.data);
        this.categories = [
          {
            id: 0,
            name: "All",
          },
          ...response.data.data,
        ];
      } catch (error) {
        this.showSnackbar(
          "Something went wrong while fetching categories",
          "error"
        );
      }
    },

    async getProducts() {
      try {
        this.getProductsLoading = true;

        const searchParam = this.searchQuery?.trim()
          ? { "name[like]": this.searchQuery }
          : {};

        let sortParams = {};
        if (this.sortBy === "Price: Low to High") {
          sortParams = { sort_by: "price", sort_direction: "asc" };
        } else if (this.sortBy === "Price: High to Low") {
          sortParams = { sort_by: "price", sort_direction: "desc" };
        } else if (this.sortBy === "Newest First") {
          sortParams = { sort_by: "created_at", sort_direction: "desc" };
        }

        const priceRangeParams = {};
        if (this.priceRange && this.priceRange.length === 2) {
          if (this.priceRange[0] > 0) {
            priceRangeParams["price[gte]"] = this.priceRange[0];
          }
          if (this.priceRange[1] < 1000000) {
            priceRangeParams["price[lte]"] = this.priceRange[1];
          }
        }

        const response = await axios.get(this.api_url + "/products", {
          params: {
            include_items: true,
            per_page: this.per_page,
            page: this.page,
            ...(this.selectedAttributes.length > 0
              ? { attribute_items: this.selectedAttributes.join(",") }
              : {}),
            ...(this.selectedCategory !== 0
              ? { category_id: this.selectedCategory }
              : {}),
            ...priceRangeParams,
            ...searchParam,
            ...sortParams,
          },
          headers: {
            Accept: "application/json",
          },
        });

        this.products = response.data.data;
        this.page = response.data.pagination.current_page;
        this.per_page = response.data.pagination.per_page;
        this.totalProducts = response.data.pagination.total;
      } catch (error) {
        this.showSnackbar(
          "Something went wrong while fetching products",
          "error"
        );
      } finally {
        this.getProductsLoading = false;
      }
    },

    handleSortChange() {
      this.page = 1;
      this.getProducts();
    },

    resetFilters() {
      this.page = 1;
      this.per_page = 15;
      this.selectedCategory = 0;
      this.selectedAttributes = [];
      this.searchQuery = "";
      this.getProducts();
    },

    isAttributeSelected(itemId) {
      return this.selectedAttributes.includes(itemId);
    },

    toggleAttribute(itemId) {
      const index = this.selectedAttributes.indexOf(itemId);
      if (index === -1) {
        this.selectedAttributes.push(itemId);
      } else {
        this.selectedAttributes.splice(index, 1);
      }

      this.getProducts();
    },

    handlePriceRangeChange() {
      this.debouncedPriceRange();
    },

    handlePriceInputChange() {
      // Ensure min is not greater than max
      if (this.priceRange[0] > this.priceRange[1]) {
        // If min is greater than max, set max to min
        this.priceRange = [this.priceRange[0], this.priceRange[0]];
      }

      // Ensure values are within bounds
      if (this.priceRange[0] < 0) this.priceRange[0] = 0;
      if (this.priceRange[1] > 500000) this.priceRange[1] = 500000;

      this.debouncedPriceRange();
    },

    showSnackbar(text, color) {
      this.snackbarText = text;
      this.snackbarColor = color;
      this.isSnackbarVisible = true;
    },

    toggleWishlist(productId) {
      const product = this.products.find((p) => p.id === productId);
      if (product) {
        product.inWishlist = !product.inWishlist;
      }
    },

    addToCart(productId) {
      // Implementation for adding to cart
      console.log(`Added product ${productId} to cart`);
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
  background: url("@assets/images/section-title-icon.png") no-repeat left
    bottom/contain;
  background-size: contain;
  block-size: 100%;
  content: "";
  font-weight: 800;
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: -12%;
}

.product-card {
  display: flex;
  overflow: hidden;
  flex-direction: column;
  border-radius: 8px;
  block-size: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 10%);
  transform: translateY(-5px);
}

.product-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  // background-color: #f9f9f9;
  // block-size: 200px;
}

.product-image {
  max-block-size: 100%;
  max-inline-size: 100%;
  object-fit: contain;
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
  font-size: 0.875rem;
  line-height: 1.4;
}

.text-truncate-2 {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  text-overflow: ellipsis;
}

.filters-sidebar {
  // position: sticky;
  inset-block-start: 80px;
}

.sort-select {
  min-inline-size: 130px;
}

.price-input-container {
  flex: 1;
}

/* Custom styling for price input fields */
.price-input {
  font-size: 0.875rem;
  inline-size: 100%;
}

.search-field-container {
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 10%);
  inline-size: 100%;
}

.search-field {
  inline-size: 100%;
}

/* Mobile filters drawer styles */
.mobile-filters-drawer {
  z-index: 9999;
}

.drawer-header {
  backdrop-filter: blur(10px);
  background: rgba(var(--v-theme-surface), 0.8);
  border-block-end: 1px solid rgba(var(--v-border-color), 0.08);
}

.filters-content {
  flex: 1;
  overflow-y: auto;
}

.drawer-footer {
  background: rgba(var(--v-theme-surface), 0.9);
  border-block-start: 1px solid rgba(var(--v-border-color), 0.08);
}
</style>
