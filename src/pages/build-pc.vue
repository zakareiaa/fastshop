<template>
  <Header />

  <div class="pc-builder app-container">
    <!-- Hero Section -->
    <VAlert color="primary" variant="tonal" class="text-center py-8 my-8">
      <VCol cols="12">
        <h1 class="mb-4" style="color: rgb(var(--v-theme-on-background))">
          {{ $t("build_pc.title") }}
        </h1>
        <h2 class="font-weight-regular" style="color: rgb(var(--v-theme-on-background))">{{ $t("build_pc.subtitle") }}</h2>
      </VCol>
    </VAlert>

    <VRow class="mb-6">
      <!-- Components Section -->
      <VCol cols="12" md="8">
        <div
          class="position-relative d-flex justify-space-between mb-1 me-2 pb-4"
        >
          <div class="section-title position-relative">
            {{ $t("build_pc.components") }}
            <div class="section-title-after"></div>
          </div>
        </div>
        <VRow>
          <VCol
            v-for="component in components"
            :key="component.id"
            cols="6"
            sm="4"
            md="3"
          >
            <VCard
              class="component-card text-center pa-4 position-relative d-flex flex-column"
              :class="{
                selected: component.selected,
                'warning-border': hasCompatibilityIssues(component),
              }"
              elevation="2"
              hover
              @click="!getCategoriesLoading && openProductDialog(component)"
              :disabled="getCategoriesLoading"
            >
              <!-- Delete button for selected components -->
              <VBtn
                v-if="component.selected"
                icon
                size="small"
                variant="tonal"
                color="error"
                class="component-delete-btn"
                @click.stop="removeComponent(component)"
              >
                <VIcon size="20">tabler-x</VIcon>
              </VBtn>

              <div class="flex-grow-1">
                <div v-if="!getCategoriesLoading">
                  <VIcon
                    class="mb-2"
                    :icon="component.icon"
                    size="30"
                    :color="component.color"
                  />
                  <div
                    class="text-body-1 font-weight-medium"
                    style="color: rgb(var(--v-theme-on-background))"
                  >
                    {{ getComponentName(component.name) }}
                  </div>
                  <div class="text-caption text-grey">
                    {{
                      component.selected
                        ? component.selectedItem.name
                        : $t("build_pc.choose")
                    }}
                  </div>
                </div>
              </div>

              <div
                v-if="hasCompatibilityIssues(component)"
                class="compatibility-warning mt-2"
              >
                {{ $t("build_pc.compatibility_warning") }}
              </div>

              <div
                v-if="getCategoriesLoading"
                class="d-flex justify-center pa-4"
              >
                <VProgressCircular indeterminate color="primary" />
              </div>
            </VCard>
          </VCol>
        </VRow>
      </VCol>

      <!-- Overview Section -->
      <VCol cols="12" lg="4">
        <div
          class="position-relative d-flex justify-space-between mb-1 me-2 pb-4"
        >
          <div class="section-title position-relative">
            {{ $t("build_pc.order_summary") }}
            <div class="section-title-after"></div>
          </div>
        </div>

        <VCard>
          <div class="rounded">
            <template v-if="selectedComponents.length > 0">
              <template
                v-for="(component, index) in selectedComponents"
                :key="component.id"
              >
                <div
                  class="d-flex align-start gap-4 pa-6 px-3 px-sm-6 position-relative flex-sm-row"
                  :class="index ? 'border-t' : ''"
                >
                  <div style="block-size: 85px; min-inline-size: 100px">
                    <img
                      :src="component.selectedItem.main_image_url"
                      style="
                        border-radius: 6px;
                        block-size: 100%;
                        max-inline-size: 100%;
                        object-fit: cover;
                      "
                    />
                  </div>

                  <div
                    class="d-flex w-100 justify-space-between gap-4 align-start"
                  >
                    <div class="flex-grow-1">
                      <div class="d-flex align-center mb-2">
                        <div>
                          <VImg
                            v-if="component.image"
                            width="20"
                            height="20"
                            :src="component.image"
                          />
                          <VIcon
                            v-else
                            size="20"
                            color="primary"
                            :icon="component.icon"
                          />
                        </div>
                        <h6 class="text-h6 ms-1">
                          {{ getComponentName(component.name) }}
                        </h6>
                      </div>
                      <div class="text-body-1 mb-2">
                        {{ component.selectedItem.name }}
                      </div>
                    </div>

                    <div class="d-flex align-center gap-2">
                      <div class="text-primary" style="min-inline-size: 70px">
                        {{ component.price }} DA
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </template>
            <div
              v-else
              class="pa-6 text-center text-body-1"
              style="color: rgb(var(--v-theme-on-background))"
            >
              {{ $t("build_pc.no_components_selected") }}
            </div>
          </div>

          <VDivider />

          <VCardText class="d-flex justify-space-between pa-6 px-3 px-sm-6">
            <h6 class="text-h6">{{ $t("build_pc.total") }}</h6>
            <h6 class="text-h6 font-weight-bold">{{ totalPrice }} DA</h6>
          </VCardText>

          <VDivider />

          <VCardText class="px-3 px-sm-6">
            <div class="d-flex align-center flex-column">
              <VBtn
                color="primary"
                prepend-icon="tabler-shopping-bag"
                @click="proceedToCheckout"
                class="w-100 mb-3"
                :disabled="selectedComponents.length === 0"
              >
                {{ $t("build_pc.proceed_to_checkout") }}
              </VBtn>
              <VBtn
                color="primary"
                variant="tonal"
                class="w-100"
                prepend-icon="tabler-trash"
                @click="resetBuilder"
                :disabled="selectedComponents.length === 0"
              >
                {{ $t("build_pc.clear_build") }}
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <!-- <VCol cols="12" md="4">
        <VCard class="overview-card pa-4" elevation="2">
          <h3 class="text-h5 mb-4">Overview:</h3>
          <VList>
            <VListItem
              v-for="component in selectedComponents"
              :key="component.id"
            >
              <VListItemTitle>{{ component.name }}</VListItemTitle>
              <VListItemSubtitle>{{
                component.selectedItem
              }}</VListItemSubtitle>
              <template v-slot:append>
                <div class="text-red">{{ component.price }}</div>
              </template>
            </VListItem>
          </VList>

          <VDivider class="my-4" />

          <div class="d-flex justify-space-between align-center mb-4">
            <div class="text-h6">Total:</div>
            <div class="text-h6 text-red">{{ totalPrice }}</div>
          </div>

          <VBtn block color="red" size="large" class="mb-2">Order it now!</VBtn>
          <VBtn block variant="outlined" @click="resetBuilder">Reset</VBtn>
        </VCard>
      </VCol> -->
    </VRow>
  </div>

  <Footer />

  <!-- Snackbar for notifications -->
  <VSnackbar
    v-model="isSnackbarVisible"
    :color="snackbarColor"
    timeout="5000"
    location="top"
    multi-line
  >
    <span style="color: rgb(var(--v-theme-on-primary))">{{
      snackbarText
    }}</span>
    <template v-slot:actions>
      <VBtn
        color="rgb(var(--v-theme-on-primary))"
        variant="text"
        @click="isSnackbarVisible = false"
        >{{ $t("build_pc.close") }}</VBtn
      >
    </template>
  </VSnackbar>

  <!-- Product Selection Dialog -->
  <VDialog v-model="productDialog" width="98%" height="90%" scrollable>
    <VCard>
      <VToolbar color="rgb(var(--v-theme-primary))" class="pe-4 ps-8">
        <VToolbarTitle
          class="px-0 ma-0"
          style="color: rgb(var(--v-theme-on-primary))"
        >
          {{ $t("build_pc.select_component") }}
          {{
            selectedComponentType
              ? getComponentName(selectedComponentType.name)
              : $t("build_pc.components")
          }}</VToolbarTitle
        >
        <VSpacer></VSpacer>
        <VBtn
          color="rgb(var(--v-theme-on-primary))"
          icon
          @click="productDialog = false"
        >
          <VIcon>tabler-x</VIcon>
        </VBtn>
      </VToolbar>

      <VCardText class="px-3 px-sm-6">
        <div class="d-flex align-center mb-6">
          <VTextField
            v-model="searchQuery"
            :placeholder="$t('build_pc.search_products')"
            prepend-inner-icon="tabler-search"
            single-line
            class="me-4"
          ></VTextField>

          <VSpacer></VSpacer>

          <VSelect
            v-model="sortBy"
            :items="[
              $t('shop.price_low_to_high'),
              $t('shop.price_high_to_low'),
              $t('shop.newest_first'),
            ]"
            :label="$t('shop.sort_by')"
            hide-details
            style="max-inline-size: 200px"
            @update:model-value="handleSortChange"
          ></VSelect>
        </div>

        <VProgressLinear
          v-if="loadingProducts"
          indeterminate
          color="primary"
        ></VProgressLinear>

        <div v-else>
          <VRow>
            <VCol
              v-for="product in products"
              :key="product.id"
              cols="6"
              sm="6"
              md="3"
              lg="2"
            >
              <VCard
                class="product-card h-100"
                @click="selectProduct(product)"
                variant="outlined"
              >
                <VImg
                  :src="product.main_image_url"
                  height="200"
                  class="bg-grey-lighten-2"
                >
                </VImg>

                <VCardTitle class="text-h6 px-3 pb-0 pt-4">{{
                  product.name
                }}</VCardTitle>

                <VCardText class="pb-2 px-3">
                  <div class="text-truncate text-body-2 mb-1">
                    {{ product.short_description }}
                  </div>
                  <div
                    class="d-flex align-center justify-end text-primary font-weight-bold"
                  >
                    {{ product.price }} DA
                  </div>
                </VCardText>

                <VCardActions>
                  <VBtn
                    color="primary"
                    variant="tonal"
                    block
                    @click.stop="selectProduct(product)"
                  >
                    {{ $t("build_pc.select") }}
                  </VBtn>
                </VCardActions>
              </VCard>
            </VCol>
          </VRow>

          <div v-if="products.length === 0" class="text-center pa-8">
            <VIcon
              icon="tabler-search-off"
              size="64"
              class="mb-4 text-medium-emphasis"
            ></VIcon>
            <h3 class="text-h5 text-medium-emphasis">
              {{ $t("build_pc.no_products_found") }}
            </h3>
            <p class="text-body-1 text-medium-emphasis">
              {{ $t("build_pc.no_products_message") }}
            </p>
          </div>

          <div class="mt-6">
            <VPagination
              v-model="page"
              :length="Math.ceil(totalProducts / perPage)"
              @update:model-value="fetchProducts"
            />
          </div>
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script>
import Footer from "@/components/costumComponents/Footer.vue";
import Header from "@/components/costumComponents/Header.vue";
import axios from "axios";
import { debounce } from "lodash";
import { markRaw } from "vue";

import { useCartStore } from "@/stores/useCartStore";

import case_ from "@/assets/svgs/case.vue";
import cpu from "@/assets/svgs/cpu.vue";
import cpuCooler from "@/assets/svgs/cpuCooler.vue";
import gpu from "@/assets/svgs/gpu.vue";
import hdd from "@/assets/svgs/hdd.vue";
import mb from "@/assets/svgs/mb.vue";
import psu from "@/assets/svgs/psu.vue";
import ram from "@/assets/svgs/ram.vue";
import ssd from "@/assets/svgs/ssd.vue";

export default {
  setup() {
    return {
      debounce,
    };
  },

  components: {
    Header,
    Footer,
    cpu,
    cpuCooler,
    mb,
    gpu,
    ram,
    ssd,
    hdd,
    psu,
    case_,
  },

  data() {
    return {
      cartStore: useCartStore(),
      api_url: import.meta.env.VITE_API_URL,

      // PC Builder components
      components: [
        {
          id: 1,
          name: "CPU",
          icon: markRaw(cpu),
          selected: false,
          selectedItem: null,
          price: 0,
          image: null,
          productId: null,
        },
        {
          id: 2,
          name: "CPU Cooler",
          icon: markRaw(cpuCooler),
          selected: false,
          selectedItem: null,
          price: 0,
          image: null,
          productId: null,
        },
        {
          id: 3,
          name: "Motherboard",
          icon: markRaw(mb),
          selected: false,
          selectedItem: "",
          price: 0,
          image: null,
          productId: null,
        },
        {
          id: 4,
          name: "Memory",
          icon: markRaw(ram),
          selected: false,
          selectedItem: null,
          price: 0,
          image: null,
          productId: null,
        },
        {
          id: 5,
          name: "SSD",
          icon: markRaw(ssd),
          selected: false,
          selectedItem: null,
          price: 0,
          image: null,
          productId: null,
        },
        {
          id: 6,
          name: "HDD",
          icon: markRaw(hdd),
          selected: false,
          selectedItem: null,
          price: 0,
          image: null,
          productId: null,
        },
        {
          id: 7,
          name: "GPU",
          icon: markRaw(gpu),
          selected: false,
          selectedItem: null,
          price: 0,
          image: null,
          productId: null,
        },
        {
          id: 8,
          name: "Power supply",
          icon: markRaw(psu),
          selected: false,
          selectedItem: null,
          price: 0,
          image: null,
          productId: null,
        },
        {
          id: 9,
          name: "Case",
          icon: markRaw(case_),
          selected: false,
          selectedItem: null,
          price: 0,
          image: null,
          productId: null,
        },
        {
          id: 10,
          name: "Mouse",
          icon: "tabler-mouse",
          color: "primary",
          selected: false,
          selectedItem: null,
          price: 0,
          image: null,
          productId: null,
        },
        {
          id: 11,
          name: "Keyboard",
          icon: "tabler-keyboard",
          color: "primary",
          selected: false,
          selectedItem: null,
          price: 0,
          image: null,
          productId: null,
        },
        {
          id: 12,
          name: "Headset",
          icon: "tabler-headset",
          color: "primary",
          selected: false,
          selectedItem: null,
          price: 0,
          image: null,
          productId: null,
        },
      ],

      // Product selection dialog
      productDialog: false,
      selectedComponentType: null,
      products: [],
      loadingProducts: false,
      searchQuery: null,
      selectedCategory: 0,
      sortBy: null,
      page: 1,
      perPage: 12,
      totalProducts: 0,
      categories: [],
      getCategoriesLoading: false,

      // Snackbar
      snackbarText: "",
      snackbarColor: "success",
      isSnackbarVisible: false,
    };
  },

  computed: {
    currentLanguage() {
      return this.$i18n.locale;
    },

    selectedComponents() {
      return this.components.filter((component) => component.selected);
    },
    totalPrice() {
      return this.selectedComponents.reduce(
        (total, component) => total + Number(component.price),
        0
      );
    },
  },

  created() {
    this.debouncedSearch = debounce(() => {
      this.page = 1;
      this.fetchProducts();
    }, 500);
  },

  mounted() {
    this.getCategories();
  },

  methods: {
    // Get translated component name
    getComponentName(componentName) {
      const componentMap = {
        CPU: this.$t("build_pc.cpu"),
        "CPU Cooler": this.$t("build_pc.cpu_cooler"),
        Motherboard: this.$t("build_pc.motherboard"),
        Memory: this.$t("build_pc.memory"),
        SSD: this.$t("build_pc.ssd"),
        HDD: this.$t("build_pc.hdd"),
        GPU: this.$t("build_pc.gpu"),
        "Power supply": this.$t("build_pc.power_supply"),
        Case: this.$t("build_pc.case"),
        Mouse: this.$t("build_pc.mouse"),
        Keyboard: this.$t("build_pc.keyboard"),
        Headset: this.$t("build_pc.headset"),
      };
      return componentMap[componentName] || componentName;
    },

    // Check if a component's selected item has any compatibility issues with other selected items in the build.
    hasCompatibilityIssues(componentOnCard) {
      if (!componentOnCard.selectedItem) {
        return false; // No item selected for this card's component type, so no issue from this card.
      }

      const itemOnCard = componentOnCard.selectedItem;
      const itemOnCardId = itemOnCard.id;
      // Ensure compatible_products is an array before mapping, default to null if not present or not an array.
      const itemOnCardCompatibleIds = Array.isArray(
        itemOnCard.compatible_products
      )
        ? itemOnCard.compatible_products.map(Number)
        : null;

      for (const otherComponentInBuild of this.selectedComponents) {
        // Skip if it's the same component type or if the other component has no selected item
        if (
          otherComponentInBuild.id === componentOnCard.id ||
          !otherComponentInBuild.selectedItem
        ) {
          continue;
        }

        const otherItemInBuild = otherComponentInBuild.selectedItem;
        const otherItemInBuildId = otherItemInBuild.id;
        const otherItemInBuildCompatibleIds = Array.isArray(
          otherItemInBuild.compatible_products
        )
          ? otherItemInBuild.compatible_products.map(Number)
          : null;

        // Check 1: Is itemOnCard incompatible with otherItemInBuild?
        // This occurs if itemOnCard has a compatibility list, and otherItemInBuildId is not in it.
        if (itemOnCardCompatibleIds) {
          if (!itemOnCardCompatibleIds.includes(otherItemInBuildId)) {
            return true; // itemOnCard declares otherItemInBuild as incompatible
          }
        }
        // If itemOnCardCompatibleIds is null (no list), we can't say it's incompatible from its side.
        // We still need to check the other direction.

        // Check 2: Is otherItemInBuild incompatible with itemOnCard?
        // This occurs if otherItemInBuild has a compatibility list, and itemOnCardId is not in it.
        if (otherItemInBuildCompatibleIds) {
          if (!otherItemInBuildCompatibleIds.includes(itemOnCardId)) {
            return true; // otherItemInBuild declares itemOnCard as incompatible
          }
        }
        // If otherItemInBuildCompatibleIds is null, it can't declare itemOnCard as incompatible from its side.
      }
      return false; // No incompatibilities found involving itemOnCard
    },

    // Open product selection dialog
    // Handle Sort
    handleSortChange(sortBy) {
      this.page = 1;
      this.fetchProducts();
    },

    // Open product selection dialog
    openProductDialog(component) {
      this.selectedComponentType = component;

      const category = this.categories.find(
        (cat) => cat.name === component.name
      );
      if (category) {
        this.selectedCategory = category.id;
        this.productDialog = true;
        this.fetchProducts();
      } else {
        this.showSnackbar(this.$t("build_pc.category_not_found"), "error");
      }
    },

    // Fetch products for dialog
    async fetchProducts() {
      try {
        this.loadingProducts = true;

        // Prepare sort parameters
        let sortParams = {};
        if (this.sortBy === this.$t("shop.price_low_to_high")) {
          sortParams = { sort_by: "price", sort_direction: "asc" };
        } else if (this.sortBy === this.$t("shop.price_high_to_low")) {
          sortParams = { sort_by: "price", sort_direction: "desc" };
        } else if (this.sortBy === this.$t("shop.newest_first")) {
          sortParams = { sort_by: "created_at", sort_direction: "desc" };
        }

        // Prepare search parameters
        const searchParams = this.searchQuery
          ? { "name[like]": this.searchQuery }
          : {};

        // Prepare category filter
        const categoryParams = this.selectedCategory
          ? { category_id: this.selectedCategory }
          : {};

        const response = await axios.get(`${this.api_url}/products`, {
          params: {
            include_items: true,
            include_compatible_products: true,
            per_page: this.perPage,
            page: this.page,
            ...sortParams,
            ...searchParams,
            ...categoryParams,
          },
          headers: { Accept: "application/json" },
        });

        this.products = response.data.data;
        this.page = response.data.pagination.current_page;
        this.perPage = response.data.pagination.per_page;
        this.totalProducts = response.data.pagination.total;

        console.log(this.page);
        console.log(this.perPage);
        console.log(this.totalProducts);
      } catch (error) {
        this.showSnackbar(this.$t("build_pc.failed_to_load_products"), "error");
        console.error("Error fetching products:", error);
      } finally {
        this.loadingProducts = false;
      }
    },

    // Get categories for filter
    async getCategories() {
      try {
        this.getCategoriesLoading = true;
        const response = await axios.get(`${this.api_url}/categories`, {
          params: {
            per_page: -1, // Get all categories
          },
          headers: { Accept: "application/json" },
        });

        this.categories = [
          { id: 0, name: "All Categories" },
          ...response.data.data,
        ];
      } catch (error) {
        this.showSnackbar(
          this.$t("build_pc.failed_to_load_categories"),
          "error"
        );
        console.error("Error fetching categories:", error);
      } finally {
        this.getCategoriesLoading = false;
      }
    },

    // Handle selected product for the component
    selectProduct(product) {
      if (this.selectedComponentType) {
        this.selectedComponentType.selected = true;
        this.selectedComponentType.selectedItem = product;
        this.selectedComponentType.price = product.price;
        this.selectedComponentType.image = product.image;
        this.selectedComponentType.productId = product.id;

        this.productDialog = false;
        this.showSnackbar(
          `${product.name} ${this.$t("build_pc.component_added")}`,
          "success"
        );
      }
    },

    // Remove a component from the build
    removeComponent(component) {
      component.selected = false;
      component.selectedItem = null;
      component.price = 0;
      component.image = null;
      component.productId = null;

      this.showSnackbar(
        `${this.getComponentName(component.name)} ${this.$t(
          "build_pc.component_removed"
        )}`,
        "info"
      );
    },

    proceedToCheckout() {
      this.selectedComponents.forEach((component) => {
        this.cartStore.addItem(component.selectedItem);
      });

      this.$router.push("/checkout?coming_from_build_page=true");
    },

    // Reset the PC builder
    resetBuilder() {
      this.components.forEach((component) => {
        component.selected = false;
        component.selectedItem = null;
        component.price = 0;
        component.image = null;
        component.productId = null;
      });
      this.showSnackbar(this.$t("build_pc.build_reset"), "primary");
    },

    // Show snackbar message
    showSnackbar(text, color) {
      this.snackbarText = text;
      this.snackbarColor = color;
      this.isSnackbarVisible = true;
    },
  },

  watch: {
    searchQuery() {
      this.debouncedSearch();
    },

    productDialog(val) {
      if (val == false) {
        this.searchQuery = null;
      }
    },
  },
};
</script>

<script script setup>
definePage({
  meta: {
    layout: "blank",
    public: true,
  },
});
</script>

<style lang="scss" scoped>
.pc-builder {
  .hero-section {
    border-radius: 8px;
    background: linear-gradient(rgba(0, 0, 0, 70%), rgba(0, 0, 0, 70%)),
      url("images/pc-builder-bg.jpg") center/cover;
    color: white;
    margin-block-end: 2rem;
  }

  .component-card {
    block-size: 100%;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
    }

    .component-delete-btn {
      position: absolute;
      z-index: 10;
      inset-block-start: 10px;
      inset-inline-end: 10px;

      // opacity: 0.8;
      // transition: opacity 0.2s ease;

      // &:hover {
      //   opacity: 1;
      // }
    }

    .compatibility-warning {
      border-radius: 4px;
      background: rgba(var(--v-theme-warning), 0.1);
      color: rgb(var(--v-theme-warning));
      font-size: 0.7rem;
      font-weight: 500;
      inline-size: 100%;
      padding-block: 4px;
      padding-inline: 8px;
      text-align: center;
    }

    &.selected {
      border: 2px solid rgba(var(--v-theme-primary));

      &.warning-border {
        border-color: rgba(var(--v-theme-warning)) !important;
      }
    }
  }

  .overview-card {
    position: sticky;
    inset-block-start: 24px;
  }
}

.section-title {
  z-index: 100;
  display: inline;
  font-size: 24px;
  font-weight: 800;
  line-height: 36px;
}

.section-title::after {
  position: absolute !important;
  z-index: 1 !important;
  background: #ea580c !important;
  background-size: contain !important;
  block-size: 0% !important;
  content: "" !important;
  font-weight: 800 !important;
  inline-size: 100% !important;
  inset-block-end: 0 !important;
  inset-inline-start: 0% !important;
  opacity: 0.4 !important;
  box-shadow: 0 0 5px 5px #ea580c !important;
}

.cursor-not-allowed {
  cursor: not-allowed !important;
}
</style>
