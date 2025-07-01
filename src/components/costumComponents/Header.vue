<template>
  <VAlert
    color="primary"
    rounded="0"
    class="text-center alert-banner"
    v-show="alertMessages.length > 0"
  >
    <div class="app-container position-relative alert-container">
      <transition name="fade" mode="out-in">
        <div :key="currentMessageIndex" class="alert-message py-1">
          {{
            alertMessages[currentMessageIndex] &&
            (alertMessages[currentMessageIndex][`text_${currentLanguage}`] ||
              alertMessages[currentMessageIndex].text)
          }}
        </div>
      </transition>
    </div>
  </VAlert>

  <div :class="{ 'bg-white': !$vuetify.theme.current.dark }">
    <div class="headerContainer app-container">
      <!-- Mobile Menu Button -->
      <VBtn
        icon
        variant="text"
        class="d-lg-none mobile-menu-btn me-8"
        @click="mobileDrawer = true"
      >
        <VIcon :color="$vuetify.theme.current.dark ? 'white' : 'secondary'">
          tabler-menu-2
        </VIcon>
      </VBtn>

      <div
        class="headerLogoContainer cursor-pointer"
        @click="$router.push('/')"
      >
        <img
          v-if="$vuetify.theme.current.dark"
          class="headerLogo w-100"
          src="@/assets/images/logo-dark.png"
          alt="Logo"
        />
        <img
          v-else
          class="headerLogo w-100"
          src="@/assets/images/logo-light.png"
          alt="Logo"
        />
      </div>

      <div class="headerSearchContainer d-none d-lg-flex">
        <VTextField
          v-model="searchQuery"
          :placeholder="$t('header.search_placeholder')"
          class="headerSearchInput"
          density="default"
          @keyup.enter="goToSearch"
        >
          <template #append>
            <VBtn icon color="primary" @click="goToSearch" variant="text">
              <VIcon>tabler-search</VIcon>
            </VBtn>
          </template>
        </VTextField>
      </div>

      <div class="headerIconsContainer d-none d-lg-flex">
        <!-- Language Toggle Menu -->
        <VMenu>
          <template #activator="{ props }">
            <VBtn icon variant="text" v-bind="props">
              <VIcon
                :color="
                  this.$vuetify.theme.current.dark ? 'white' : 'secondary'
                "
                >tabler-language</VIcon
              >
            </VBtn>
          </template>
          <VList>
            <VListItem
              v-for="language in languages"
              :key="language.code"
              @click="changeLanguage(language.code)"
              :class="{
                'v-list-item--active': currentLanguage === language.code,
              }"
            >
              <template #prepend>
                <span class="text-h6 me-3">{{ language.flag }}</span>
              </template>
              <VListItemTitle>{{ language.name }}</VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>

        <!-- Theme Toggle Button -->
        <VBtn icon variant="text" @click="toggleTheme">
          <VIcon :color="$vuetify.theme.current.dark ? 'white' : 'secondary'">
            {{ $vuetify.theme.current.dark ? "tabler-sun" : "tabler-moon" }}
          </VIcon>
        </VBtn>

        <WishlistButton showCount />

        <CartCard />
      </div>

      <!-- Mobile Icons (just cart and wishlist) -->
      <div class="d-flex d-lg-none mobile-icons">
        <!-- Language Toggle Menu -->
        <VMenu>
          <template #activator="{ props }">
            <VBtn icon variant="text" v-bind="props">
              <VIcon
                :color="
                  this.$vuetify.theme.current.dark ? 'white' : 'secondary'
                "
                >tabler-language</VIcon
              >
            </VBtn>
          </template>
          <VList>
            <VListItem
              v-for="language in languages"
              :key="language.code"
              @click="changeLanguage(language.code)"
              :class="{
                'v-list-item--active': currentLanguage === language.code,
              }"
            >
              <template #prepend>
                <span class="text-h6 me-3">{{ language.flag }}</span>
              </template>
              <VListItemTitle>{{ language.name }}</VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>

        <CartCard />
      </div>
    </div>
  </div>

  <div class="linkContainer d-none d-lg-block">
    <div class="app-container linksContainer">
      <VMenu transition="scale-transition" offset-y>
        <template #activator="{ props }">
          <VBtn v-bind="props" size="large" color="primary" variant="flat">
            <VIcon icon="tabler-category" class="mr-2" />
            {{ $t("header.categories") }}
            <VIcon icon="tabler-chevron-down" class="ml-2" />
          </VBtn>
        </template>
        <div
          class="d-flex bg-surface category-menu-container"
          @mouseleave="hoveredParentCategory = null"
          style="border-radius: 8px"
        >
          <VList class="parent-category-list" min-width="250" density="compact">
            <VListItem
              v-for="parent in parentCategories"
              :key="parent.id"
              :value="parent"
              @mouseover="hoveredParentCategory = parent"
              class="parent-category-item"
              :class="{
                'v-list-item--active':
                  hoveredParentCategory &&
                  hoveredParentCategory.id === parent.id,
              }"
            >
              <VListItemTitle>{{
                parent[`name_${currentLanguage}`] || parent.name
              }}</VListItemTitle>
              <template #append>
                <VIcon size="small" icon="tabler-chevron-right" />
              </template>
            </VListItem>
          </VList>
          <VDivider vertical />
          <VList
            v-if="
              hoveredParentCategory && hoveredParentCategory.categories.length
            "
            class="subcategory-list"
            min-width="250"
            density="compact"
            @mouseleave="hoveredChildCategory = null"
          >
            <VListItem
              v-for="category in hoveredParentCategory.categories"
              :key="category.id"
              @click="handleCategoryClick(category)"
              @mouseover="hoveredChildCategory = category"
              class="subcategory-item"
              :class="{
                'v-list-item--active':
                  hoveredChildCategory &&
                  hoveredChildCategory.id === category.id,
              }"
            >
              <VListItemTitle>{{
                category[`name_${currentLanguage}`] || category.name
              }}</VListItemTitle>
            </VListItem>
          </VList>
          <div
            v-else
            class="d-flex align-center justify-center text-grey-lighten-1"
            style="min-inline-size: 250px"
          >
            <span>{{ $t("header.hover_category") }}</span>
          </div>
        </div>
      </VMenu>

      <div class="linksContainer">
        <div>
          <VBtn
            variant="text"
            size="large"
            :color="this.$vuetify.theme.current.dark ? 'white' : 'rgb(var(--v-theme-on-background))'"
            @click="$router.push('/shop')"
          >
            <VIcon icon="tabler-building-store" class="mr-2" />
            {{ $t("header.shop") }}
          </VBtn>

          <VBtn
            variant="text"
            size="large"
            :color="this.$vuetify.theme.current.dark ? 'white' : 'rgb(var(--v-theme-on-background))'"
            @click="$router.push('/build-pc')"
          >
            <VIcon icon="tabler-cpu" class="mr-2" />
            <span>{{ $t("header.build_pc") }}</span>
          </VBtn>

          <VBtn
            variant="text"
            size="large"
            :color="this.$vuetify.theme.current.dark ? 'white' : 'rgb(var(--v-theme-on-background))'"
            @click="$router.push('/about')"
          >
            <VIcon icon="tabler-info-circle" class="mr-2" />
            <span>{{ $t("header.about") }}</span>
          </VBtn>
        </div>

        <div>
          <VBtn
            variant="text"
            size="large"
            color="secondary"
            @click="callPhoneNumber('0558967409')"
          >
            <VIcon
              icon="tabler-phone"
              class="mr-3"
              size="x-large"
              color="primary"
            />
            <div class="contactUsContainer">
              <span class="contactUsNumber">0558967409</span>
              <span
                class="text-start text-sm"
                :style="{
                  color: this.$vuetify.theme.current.dark
                    ? 'white'
                    : 'rgb(var(--v-theme-on-background))',
                }"
                >{{ $t("header.contact_us") }}</span
              >
            </div>
          </VBtn>
        </div>
      </div>
    </div>
  </div>

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

  <!-- Mobile Sidebar Drawer -->
  <VNavigationDrawer
    v-model="mobileDrawer"
    temporary
    location="start"
    :width="360"
    class="mobile-sidebar"
    elevation="0"
  >
    <div class="d-flex flex-column justify-space-between h-100">
      <div>
        <!-- Sidebar Header with Logo -->
        <div
          class="sidebar-header px-6 py-4 pt-5 d-flex align-center justify-space-between"
        >
          <img
            v-if="$vuetify.theme.current.dark"
            class="sidebar-logo"
            src="@/assets/images/logo-dark.png"
            alt="Logo"
            @click="closeSidebarAndNavigate('/')"
          />
          <img
            v-else
            class="sidebar-logo"
            src="@/assets/images/logo-light.png"
            alt="Logo"
            @click="closeSidebarAndNavigate('/')"
          />

          <VBtn
            icon
            variant="text"
            @click="mobileDrawer = false"
            size="small"
            class="close-btn"
          >
            <VIcon size="20">tabler-x</VIcon>
          </VBtn>
        </div>

        <!-- Search Bar -->
        <div class="px-6 py-4 pt-4">
          <VTextField
            v-model="searchQuery"
            :placeholder="$t('header.search_placeholder')"
            density="default"
            bg-color="surface"
            hide-details
            rounded="lg"
            @keyup.enter="handleMobileSearch"
          >
            <template #append-inner>
              <VBtn
                icon
                size="small"
                color="primary"
                @click="handleMobileSearch"
                variant="text"
                class="search-btn"
              >
                <VIcon size="18">tabler-search</VIcon>
              </VBtn>
            </template>
          </VTextField>
        </div>

        <!-- Controls (Language, Theme, Wishlist, Cart) -->
        <div class="px-6 py-2">
          <div
            class="d-flex flex-wrap align-center justify-space-between control-grid"
          >
            <!-- Language Toggle -->
            <VMenu>
              <template #activator="{ props }">
                <VBtn
                  icon
                  variant="text"
                  v-bind="props"
                  size="large"
                  :color="$vuetify.theme.current.dark ? 'white' : 'secondary'"
                >
                  <VIcon size="24">tabler-language</VIcon>
                </VBtn>
              </template>
              <VList>
                <VListItem
                  v-for="language in languages"
                  :key="language.code"
                  @click="changeLanguage(language.code)"
                  :class="{
                    'v-list-item--active': currentLanguage === language.code,
                  }"
                >
                  <template #prepend>
                    <span class="text-h6 me-3">{{ language.flag }}</span>
                  </template>
                  <VListItemTitle>{{ language.name }}</VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>

            <!-- Theme Toggle -->
            <VBtn
              icon
              variant="text"
              @click="toggleTheme"
              size="large"
              :color="$vuetify.theme.current.dark ? 'white' : 'secondary'"
            >
              <VIcon size="24">
                {{ $vuetify.theme.current.dark ? "tabler-sun" : "tabler-moon" }}
              </VIcon>
            </VBtn>

            <!-- Wishlist -->
            <div class="wishlist-mobile">
              <WishlistButton showCount />
            </div>

            <!-- Cart -->
            <div class="cart-mobile">
              <CartCard />
            </div>
          </div>
        </div>

        <!-- Categories Section -->
        <div class="px-6 py-3">
          <VCard
            flat
            color="surface"
            rounded="lg"
            class="categories-card"
            variant="outlined"
          >
            <VExpansionPanels
              variant="accordion"
              class="categories-expansion"
              bg-color="transparent"
            >
              <VExpansionPanel elevation="0" class="categories-panel">
                <VExpansionPanelTitle class="categories-title">
                  <div class="d-flex align-center">
                    <VIcon class="mr-3" size="20" color="primary"
                      >tabler-category</VIcon
                    >
                    <span class="font-weight-medium fs-17">{{
                      $t("header.categories")
                    }}</span>
                  </div>
                </VExpansionPanelTitle>
                <VExpansionPanelText class="categories-content">
                  <div class="categories-list">
                    <div
                      v-for="parent in parentCategories"
                      :key="parent.id"
                      class="category-group"
                    >
                      <VBtn
                        v-if="
                          !parent.categories || parent.categories.length === 0
                        "
                        @click="handleCategoryClick(parent)"
                        variant="text"
                        class="category-btn w-100 justify-start"
                        color="default"
                      >
                        <VListItemTitle class="text-start">{{
                          parent[`name_${currentLanguage}`] || parent.name
                        }}</VListItemTitle>
                      </VBtn>

                      <VExpansionPanels
                        v-else
                        variant="accordion"
                        class="subcategory-expansion"
                        bg-color="transparent"
                      >
                        <VExpansionPanel
                          elevation="0"
                          class="subcategory-panel"
                        >
                          <VExpansionPanelTitle class="subcategory-title">
                            <span class="text-sm font-weight-medium">
                              {{
                                parent[`name_${currentLanguage}`] || parent.name
                              }}
                            </span>
                          </VExpansionPanelTitle>
                          <VExpansionPanelText class="subcategory-content">
                            <div class="subcategory-list">
                              <VBtn
                                v-for="category in parent.categories"
                                :key="category.id"
                                @click="handleCategoryClick(category)"
                                variant="text"
                                size="small"
                                class="subcategory-btn w-100 justify-start"
                                color="default"
                              >
                                <span class="text-sm">{{
                                  category[`name_${currentLanguage}`] ||
                                  category.name
                                }}</span>
                              </VBtn>
                            </div>
                          </VExpansionPanelText>
                        </VExpansionPanel>
                      </VExpansionPanels>
                    </div>
                  </div>
                </VExpansionPanelText>
              </VExpansionPanel>
            </VExpansionPanels>
          </VCard>
        </div>

        <!-- Navigation Links -->
        <div class="px-6 py-0">
          <div class="nav-links">
            <VBtn
              @click="closeSidebarAndNavigate('/shop')"
              variant="outlined"
              size="large"
              class="w-100 justify-start"
              color="default"
            >
              <VIcon class="mr-3" size="20" color="primary"
                >tabler-building-store</VIcon
              >
              <span class="font-weight-medium">{{ $t("header.shop") }}</span>
            </VBtn>

            <VBtn
              @click="closeSidebarAndNavigate('/build-pc')"
              variant="outlined"
              size="large"
              class="w-100 justify-start"
              color="default"
            >
              <VIcon class="mr-3" size="20" color="primary">tabler-cpu</VIcon>
              <span class="font-weight-medium">{{
                $t("header.build_pc")
              }}</span>
            </VBtn>

            <VBtn
              @click="closeSidebarAndNavigate('/about')"
              variant="outlined"
              size="large"
              class="w-100 justify-start"
              color="default"
            >
              <VIcon class="mr-3" size="20" color="primary"
                >tabler-info-circle</VIcon
              >
              <span class="font-weight-medium">{{ $t("header.about") }}</span>
            </VBtn>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="px-6 py-4 pb-8">
        <VCard
          flat
          color="primary"
          rounded="xl"
          class="contact-card"
          @click="callPhoneNumber('0558967409')"
        >
          <VCardText class="pa-4">
            <div class="d-flex align-center">
              <VIcon class="mr-3" size="24" color="white">tabler-phone</VIcon>
              <div class="contact-info">
                <div class="phone-number">0558967409</div>
                <div class="contact-label">{{ $t("header.contact_us") }}</div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </div>
    </div>
  </VNavigationDrawer>
</template>

<script>
import axios from "axios";

import CartCard from "./CartCard.vue";
import WishlistButton from "./WishlistButton.vue";

export default {
  components: {
    CartCard,
    WishlistButton,
  },

  data() {
    return {
      // Mobile sidebar
      mobileDrawer: false,

      // Alert banner messages
      alertMessages: [],
      currentMessageIndex: 0,
      intervalId: null,

      // Categories
      parentCategories: [],
      hoveredParentCategory: null,

      // Snackbar
      snackbarText: "",
      snackbarColor: "primary",
      isSnackbarVisible: false,

      // Search
      searchQuery: "",

      // Subcategories
      hoveredChildCategory: null,

      // Language options
      languages: [
        { code: "en", name: "English", flag: "🇺🇸" },
        { code: "ar", name: "العربية", flag: "🇩🇿" },
        { code: "fr", name: "Français", flag: "🇫🇷" },
      ],
    };
  },

  computed: {
    currentLanguage() {
      return this.$i18n.locale;
    },
  },

  methods: {
    toggleTheme() {
      this.$vuetify.theme.global.name = this.$vuetify.theme.current.dark
        ? "light"
        : "dark";
    },

    changeLanguage(locale) {
      // Import the setLocale function dynamically
      import("@/plugins/1.i18n").then(({ setLocale }) => {
        setLocale(locale);
      });
    },

    toggleLanguage() {
      // Language toggle functionality - empty as requested
      // This is where you would implement language switching logic
    },

    callPhoneNumber(number) {
      window.location.href = `tel:${number}`;
    },

    async getHeaderMessages() {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/header-sentences?active_only=true",
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        this.alertMessages = response.data.data;
        // .map((item) =>
        //   localStorage.getItem("locale") === "ar" ? item.text_ar : item.text
        // );
      } catch (error) {
        this.showSnackbar(
          "Something went wrong while fetching header messages",
          "error"
        );
      }
    },

    async getCategories() {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/parent-categories",
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        this.parentCategories = response.data.data;
      } catch (error) {
        this.showSnackbar(
          "Something went wrong while fetching categories",
          "error"
        );
      }
    },

    handleCategoryClick(value) {
      const targetQuery = { ...this.$route.query, category_id: value.id };
      this.$router.push({ path: "/shop", query: targetQuery });
      this.mobileDrawer = false; // Close sidebar when navigating
    },

    // Function to cycle through messages
    cycleMessages() {
      // Only cycle messages if there are any messages to cycle through
      if (this.alertMessages.length > 0) {
        this.currentMessageIndex =
          (this.currentMessageIndex + 1) % this.alertMessages.length;
      }
    },

    showSnackbar(text, color) {
      this.snackbarText = text;
      this.snackbarColor = color;
      this.isSnackbarVisible = true;
    },

    goToSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({
          path: "/shop",
          query: { search: this.searchQuery.trim() },
        });
      }
    },

    handleMobileSearch() {
      this.goToSearch();
      this.mobileDrawer = false; // Close sidebar after search
    },

    closeSidebarAndNavigate(path) {
      this.$router.push(path);
      this.mobileDrawer = false;
    },
  },

  mounted() {
    this.getHeaderMessages();
    this.getCategories();
    // Change message every 3 seconds
    this.intervalId = setInterval(this.cycleMessages, 3000);
  },

  beforeUnmount() {
    // Clear the interval when component is unmounted
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
};
</script>

<style scoped>
/* Alert banner animations */
.alert-banner {
  overflow: hidden;
  padding-block: 8px;
}

.alert-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-block-size: 24px;
}

.alert-message {
  inline-size: 100%;
  text-align: center;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.parent-category-item.v-list-item--active {
  background-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

.parent-category-item.v-list-item--active .v-list-item-title,
.parent-category-item.v-list-item--active .v-icon {
  color: rgb(var(--v-theme-on-primary));
}

.subcategory-item.v-list-item--active .v-list-item-title {
  color: rgb(var(--v-theme-primary));
}

/* Mobile responsive styles */
.headerContainer {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-block: 1rem;
}

.mobile-menu-btn {
  order: -1;
}

.headerLogoContainer {
  flex: 0 0 auto;
}

.headerLogo {
  block-size: 40px;
  inline-size: auto;
}

.headerSearchContainer {
  flex: 1;
}

.headerIconsContainer {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.5rem;
}

.mobile-icons {
  gap: 0.5rem;
}

/* Mobile sidebar styles */
.mobile-sidebar {
  z-index: 9999;
}

.sidebar-header {
  backdrop-filter: blur(10px);
  background: rgba(var(--v-theme-surface), 0.8);
  border-block-end: 1px solid rgba(var(--v-border-color), 0.08);
}

.sidebar-logo {
  block-size: 36px;
  inline-size: auto;
}

/* Search field */
.search-field {
  border: 1px solid rgba(var(--v-border-color), 0.08);
  box-shadow: 0 2px 8px rgb(0 0 0 / 4%);
}

.search-btn {
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.search-btn:hover {
  opacity: 1;
}

/* Control grid */
.control-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(4, 1fr);
}

/* Categories */
.categories-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  box-shadow: 0 2px 8px rgb(0 0 0 / 4%);
  padding-inline: 0.5rem !important;
}

.categories-expansion {
  box-shadow: none !important;
}

.categories-panel {
  background: transparent !important;
}

.categories-title {
  min-block-size: auto !important;
  padding-block: 16px !important;
  padding-inline: 20px !important;
}

.categories-content {
  padding-inline: 4px !important;
}

.category-btn {
  border-radius: 8px !important;
  margin-block-end: 4px;
  padding-block: 12px !important;
  padding-inline: 16px !important;
  transition: all 0.2s ease;
}

.category-btn:hover {
  background: rgba(var(--v-theme-primary), 0.08) !important;
}

.subcategory-expansion {
  box-shadow: none !important;
  margin-inline-start: 16px;
}

.subcategory-panel {
  background: transparent !important;
}

.subcategory-title {
  min-block-size: auto !important;
  padding-block: 8px !important;
  padding-inline: 12px !important;
}

.subcategory-content {
  padding-block: 0 8px !important;
  padding-inline: 12px !important;
}

.subcategory-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.subcategory-btn {
  border-radius: 6px !important;
  padding-block: 8px !important;
  padding-inline: 12px !important;
  transition: all 0.2s ease;
}

.subcategory-btn:hover {
  background: rgba(var(--v-theme-primary), 0.06) !important;
}

/* Navigation links */
.nav-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* .nav-btn {
  border: 1px solid rgba(var(--v-border-color), 0.08);
  border-radius: 12px !important;
  padding-block: 16px !important;
  padding-inline: 20px !important;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  border-color: rgba(var(--v-theme-primary), 0.2);
  background: rgba(var(--v-theme-primary), 0.06) !important;
  transform: translateX(4px);
} */

/* Contact card */
.contact-card {
  box-shadow: 0 4px 16px rgba(var(--v-theme-primary), 0.2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.contact-card:hover {
  box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.3);
  transform: translateY(-2px);
}

.contact-info {
  color: white;
}

.phone-number {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
}

.contact-label {
  font-size: 12px;
  line-height: 1.2;
  opacity: 0.9;
}

/* Responsive breakpoints */
@media (max-width: 1279px) {
  .headerContainer {
    justify-content: space-between;
  }

  .headerLogoContainer {
    display: flex;
    flex: 1;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .headerLogo {
    block-size: 35px;
  }

  .headerContainer {
    padding-block: 0.75rem;
  }
}

@media (max-width: 480px) {
  .headerLogo {
    block-size: 30px;
  }

  .headerContainer {
    gap: 0.5rem;
    padding-block: 0.5rem;
  }
}

.fs-17 {
  font-size: 17px;
}
</style>
