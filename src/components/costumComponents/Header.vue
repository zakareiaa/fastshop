<template>
  <VAlert
    color="primary"
    rounded="0"
    class="text-center alert-banner"
    v-show="alertMessages.length > 0"
  >
    <div class="app-container position-relative alert-container">
      <transition name="fade" mode="out-in">
        <div :key="currentMessageIndex" class="alert-message">
          {{
            alertMessages[currentMessageIndex] &&
            (alertMessages[currentMessageIndex][`text_${currentLanguage}`] ||
              alertMessages[currentMessageIndex].text)
          }}
        </div>
      </transition>
    </div>
  </VAlert>

  <div
    :class="{ 'bg-white': !$vuetify.theme.current.dark }"
    style="background-color: rgb(var(--v-theme-background))"
    class="header"
  >
    <div class="headerContainer app-container">
      <!-- Mobile Menu Button -->
      <VBtn
        icon
        variant="text"
        size="large"
        class="d-md-none mobile-menu-btn me-11"
        @click="mobileDrawer = true"
      >
        <VIcon :color="$vuetify.theme.current.dark ? 'white' : '#000'">
          tabler-menu-2
        </VIcon>
      </VBtn>

      <div
        class="headerLogoContainer cursor-pointer"
        @click="$router.push('/')"
      >
        <img
          class="headerLogo"
          src="@/assets/images/logo-light.png"
          alt="Logo"
          :style="$vuetify.theme.current.dark ? 'filter: invert(1);' : ''"
        />
      </div>

      <div class="linksContainer d-none d-md-flex">
        <div>
          <VBtn
            variant="text"
            :color="
              this.$vuetify.theme.current.dark
                ? 'white'
                : 'rgb(var(--v-theme-on-background))'
            "
            class="b-radius-0"
            @click="$router.push('/shop')"
          >
            <!-- <VIcon icon="tabler-building-store" class="mr-2" /> -->
            {{ $t("header.shop") }}
          </VBtn>

          <VMenu transition="scale-transition" offset-y>
            <template #activator="{ props }">
              <VBtn
                v-bind="props"
                color="primary"
                variant="text"
                class="b-radius-0"
              >
                {{ $t("header.categories") }}
                <VIcon icon="tabler-chevron-down" class="ml-2" />
              </VBtn>
            </template>
            <VList
              class="simple-category-list b-radius-0"
              min-width="250"
              density="compact"
              bg-color="surface"
              rounded="lg"
              elevation="8"
            >
              <VListItem
                v-for="category in categories"
                :key="category.id"
                @click="handleCategoryClick(category)"
                class="simple-category-item"
                style="border-radius: 0 !important"
              >
                <VListItemTitle style="border-radius: 0 !important">{{
                  category[`name_${currentLanguage}`] || category.name
                }}</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>

          <VBtn
            variant="text"
            :color="
              this.$vuetify.theme.current.dark
                ? 'white'
                : 'rgb(var(--v-theme-on-background))'
            "
            class="b-radius-0"
            @click="$router.push('/about')"
          >
            <!-- <VIcon icon="tabler-info-circle" class="mr-2" /> -->
            <span>{{ $t("header.about") }}</span>
          </VBtn>
        </div>
      </div>

      <!-- <div class="headerSearchContainer d-none d-lg-flex">
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
      </div> -->

      <div class="headerIconsContainer d-none d-md-flex">
        <!-- Search Icon -->
        <VBtn icon variant="text" @click="toggleSearchDropdown">
          <VIcon
            :color="$vuetify.theme.current.dark ? 'white' : '#000'"
            style="font-weight: 700"
          >
            tabler-search
          </VIcon>
        </VBtn>

        <!-- Language Toggle Menu -->
        <VMenu>
          <template #activator="{ props }">
            <VBtn icon variant="text" v-bind="props">
              <VIcon
                :color="this.$vuetify.theme.current.dark ? 'white' : '#000'"
                >tabler-language</VIcon
              >
            </VBtn>
          </template>
          <VList class="b-radius-0">
            <VListItem
              v-for="language in languages"
              :key="language.code"
              @click="changeLanguage(language.code)"
              :class="{
                'v-list-item--active': currentLanguage === language.code,
              }"
              style="border-radius: 0 !important"
            >
              <template #prepend>
                <span class="text-h6 me-3 b-radius-0">{{ language.flag }}</span>
              </template>
              <VListItemTitle class="b-radius-0">{{
                language.name
              }}</VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>

        <!-- Theme Toggle Button -->
        <VBtn icon variant="text" @click="toggleTheme">
          <VIcon :color="$vuetify.theme.current.dark ? 'white' : '#000'">
            {{ $vuetify.theme.current.dark ? "tabler-sun" : "tabler-moon" }}
          </VIcon>
        </VBtn>

        <WishlistButton showCount />

        <CartCard />
      </div>

      <!-- Mobile Icons (just cart and wishlist) -->
      <div class="d-flex d-md-none mobile-icons">
        <!-- Language Toggle Menu -->
        <VMenu>
          <template #activator="{ props }">
            <VBtn icon variant="text" v-bind="props">
              <VIcon
                :color="this.$vuetify.theme.current.dark ? 'white' : '#000'"
                >tabler-language</VIcon
              >
            </VBtn>
          </template>
          <VList class="b-radius-0">
            <VListItem
              v-for="language in languages"
              :key="language.code"
              @click="changeLanguage(language.code)"
              :class="{
                'v-list-item--active': currentLanguage === language.code,
              }"
              style="border-radius: 0 !important"
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

  <!-- Search Dropdown with Overlay -->
  <div
    v-show="showSearchDropdown"
    class="search-overlay"
    :class="{ 'search-overlay-open': showSearchDropdown }"
    @click="closeSearchDropdown"
  >
    <div
      class="search-dropdown"
      :class="{
        'search-dropdown-open': showSearchDropdown,
        'bg-white': !$vuetify.theme.current.dark,
      }"
      style="background-color: rgb(var(--v-theme-background))"
      @click.stop
    >
      <div class="app-container">
        <div class="search-dropdown-content">
          <VTextField
            ref="searchInput"
            v-model="searchQuery"
            :placeholder="$t('header.search_placeholder')"
            class="search-input"
            density="default"
            variant="outlined"
            hide-details
            @keyup.enter="handleDropdownSearch"
            @keyup.escape="closeSearchDropdown"
          >
            <template #append-inner>
              <VBtn
                icon
                color="primary"
                @click="handleDropdownSearch"
                variant="text"
                size="small"
              >
                <VIcon>tabler-search</VIcon>
              </VBtn>
            </template>
          </VTextField>

          <VBtn
            icon
            variant="text"
            @click="closeSearchDropdown"
            class="close-search-btn"
          >
            <VIcon :color="$vuetify.theme.current.dark ? 'white' : '#666'">
              tabler-x
            </VIcon>
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
    <div class="sidebar-content">
      <div class="sidebar-scrollable">
        <!-- Sidebar Header with Logo -->
        <div
          class="sidebar-header px-6 py-4 pt-5 d-flex align-center justify-space-between"
        >
          <img
            v-if="!$vuetify.theme.current.dark"
            class="sidebar-logo"
            src="@/assets/images/logo-light.png"
            alt="Logo"
            @click="closeSidebarAndNavigate('/')"
            :style="$vuetify.theme.current.dark ? 'filter: invert(1);' : ''"
          />
          <img
            v-else
            class="sidebar-logo"
            src="@/assets/images/logo-dark.png"
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
            class="search-input-mobile"
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
          <div class="d-flex flex-wrap align-center justify-center gap-16px">
            <!-- Language Toggle -->
            <VMenu>
              <template #activator="{ props }">
                <VBtn
                  icon
                  variant="text"
                  v-bind="props"
                  size="large"
                  :color="$vuetify.theme.current.dark ? 'white' : '#000'"
                >
                  <VIcon size="24">tabler-language</VIcon>
                </VBtn>
              </template>
              <VList class="b-radius-0">
                <VListItem
                  v-for="language in languages"
                  :key="language.code"
                  @click="changeLanguage(language.code)"
                  :class="{
                    'v-list-item--active': currentLanguage === language.code,
                  }"
                  style="border-radius: 0 !important"
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
              :color="$vuetify.theme.current.dark ? 'white' : '#000'"
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
                    <VBtn
                      v-for="category in categories"
                      :key="category.id"
                      @click="handleCategoryClick(category)"
                      variant="text"
                      class="category-btn w-100 justify-start"
                      color="default"
                    >
                      <VListItemTitle class="text-start">{{
                        category[`name_${currentLanguage}`] || category.name
                      }}</VListItemTitle>
                    </VBtn>
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
              class="w-100 justify-start b-radius-0"
              color="default"
            >
              <VIcon class="mr-3" size="20" color="primary"
                >tabler-building-store</VIcon
              >
              <span class="font-weight-medium">{{ $t("header.shop") }}</span>
            </VBtn>

            <VBtn
              @click="closeSidebarAndNavigate('/about')"
              variant="outlined"
              size="large"
              class="w-100 justify-start b-radius-0"
              color="default"
            >
              <VIcon class="mr-3" size="20" color="primary"
                >tabler-info-circle</VIcon
              >
              <span class="font-weight-medium">{{ $t("header.about") }}</span>
            </VBtn>
          </div>
        </div>

        <!-- Contact Section -->
        <div class="px-6 py-8">
          <VCard
            flat
            color="primary"
            rounded="xl"
            class="contact-card"
            @click="callPhoneNumber(' 0562815787')"
          >
            <VCardText class="pa-4">
              <div class="d-flex align-center">
                <VIcon class="mr-3" size="24">tabler-phone</VIcon>
                <div class="contact-info">
                  <div
                    class="phone-number"
                    style="color: rgb(var(--v-theme-on-primary))"
                  >
                    0562815787
                  </div>
                  <div
                    class="contact-label"
                    style="color: rgb(var(--v-theme-on-primary))"
                  >
                    {{ $t("header.contact_us") }}
                  </div>
                </div>
              </div>
            </VCardText>
          </VCard>
        </div>
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

      // Search dropdown
      showSearchDropdown: false,

      // Alert banner messages
      alertMessages: [
        {
          id: 1,
          text: "Welcome !",
          text_ar: "! مرحبا بيك",
          text_fr: "Bienvenue !",
          is_active: true,
          position: 1,
          created_at: "2025-07-09T00:26:18.000000Z",
          updated_at: "2025-07-09T00:26:18.000000Z",
        },
        {
          id: 2,
          text: "Cash on Delivery 📦 💵",
          text_ar: "📦 💵 الدفع عند الإستلام",
          text_fr: "Paiement à la livraison 📦 💵",
          is_active: true,
          position: 2,
          created_at: "2025-07-09T00:28:17.000000Z",
          updated_at: "2025-07-09T00:28:17.000000Z",
        },
        {
          id: 3,
          text: "Shipping available to all 58 provinces 🚚 📦",
          text_ar: "🚚 📦 التوصيل متوفر لـ 58 ولاية",
          text_fr: "Livraison disponible dans les 58 wilayas 🚚 📦",
          is_active: true,
          position: 3,
          created_at: "2025-07-09T00:28:58.000000Z",
          updated_at: "2025-07-09T00:28:58.000000Z",
        },
      ],
      currentMessageIndex: 0,
      intervalId: null,

      // Categories
      categories: [],

      // Snackbar
      snackbarText: "",
      snackbarColor: "primary",
      isSnackbarVisible: false,

      // Search
      searchQuery: "",

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
      const newTheme = this.$vuetify.theme.current.dark ? "light" : "dark";
      this.$vuetify.theme.global.name = newTheme;
      // Save to localStorage
      localStorage.setItem("theme", newTheme);
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
        if (response.data.data.length > 0) {
          this.alertMessages = response.data.data;
        }
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
          import.meta.env.VITE_API_URL + "/categories",
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        this.categories = response.data.data;
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

    toggleSearchDropdown() {
      this.showSearchDropdown = !this.showSearchDropdown;
      if (this.showSearchDropdown) {
        this.$nextTick(() => {
          if (this.$refs.searchInput) {
            this.$refs.searchInput.focus();
          }
          setTimeout(() => {}, 350); // Wait for animation to complete (128px takes a bit longer)
        });
      }
    },

    closeSearchDropdown() {
      this.showSearchDropdown = false;
      this.searchQuery = "";
    },

    handleDropdownSearch() {
      this.goToSearch();
      this.closeSearchDropdown();
    },

    closeSidebarAndNavigate(path) {
      this.$router.push(path);
      this.mobileDrawer = false;
    },
  },

  mounted() {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
      this.$vuetify.theme.global.name = savedTheme;
    }

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
  font-weight: 600;
  padding-block: 8px;
}

@media screen and (max-width: 768px) {
  .header {
    position: sticky;
    z-index: 99;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 10%);
    inset-block-start: 38px;
  }

  .alert-banner {
    position: sticky;
    z-index: 99;
    overflow: hidden;
    font-weight: 600;
    inset-block-start: 0;
    padding-block: 8px;
  }
}

.alert-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-message {
  font-size: 14px !important;
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

/* Simple category menu styles */
.simple-category-list {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  box-shadow: 0 4px 16px rgb(0 0 0 / 10%);
}

.simple-category-item {
  cursor: pointer;
  transition: all 0.2s ease;
}

.simple-category-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.08) !important;
}

.simple-category-item .v-list-item-title {
  font-weight: 500;
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
}

@media (min-width: 425px) {
  .headerLogo {
    block-size: 60px !important;
  }
}

.headerSearchContainer {
  flex: 1;
}

.headerIconsContainer {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.3rem;
}

.mobile-icons {
  gap: 0.5rem;
}

/* Mobile sidebar styles */
.mobile-sidebar {
  z-index: 9999;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  block-size: 100vh;
}

.sidebar-scrollable {
  flex: 1;
  min-block-size: 0;
  overflow-y: auto;
  scrollbar-color: rgba(var(--v-theme-primary), 0.3) transparent;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    inline-size: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 0;
    background: rgba(var(--v-theme-primary), 0.3);
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(var(--v-theme-primary), 0.5);
  }
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
.gap-16px {
  gap: 16px;
}

/* Categories */
.categories-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 0 !important;
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
  border-radius: 0 !important;
  margin-block-end: 4px;
  padding-block: 12px !important;
  padding-inline: 16px !important;
  transition: all 0.2s ease;
}

.category-btn:hover {
  background: rgba(var(--v-theme-primary), 0.08) !important;
}

/* Navigation links */
.nav-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

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

.fs-17 {
  font-size: 17px;
}

/* Search dropdown styles */
.search-overlay {
  position: fixed;
  z-index: 2000;
  backdrop-filter: blur(2px);
  background: rgba(0, 0, 0, 0%);
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
}

.search-overlay-open {
  background: rgba(0, 0, 0, 52%);
  opacity: 1;
  pointer-events: auto;
}

.search-dropdown {
  position: absolute;
  z-index: 2001;
  backdrop-filter: blur(10px);
  border-block-end: 1px solid
    rgba(var(--v-border-color), var(--v-border-opacity));
  box-shadow: 0 4px 16px rgba(0, 0, 0, 10%);
  inset-block-start: -128px;
  inset-inline: 0;
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.search-dropdown-open {
  transform: translateY(128px);
}

.search-dropdown-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-block: 16px;
  padding-inline: 0;
}

.search-input {
  flex: 1;
}

.close-search-btn {
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.close-search-btn:hover {
  opacity: 1;
}

/* Header position relative for dropdown positioning */
</style>

<style>
/* Global styles for mobile sidebar scrolling */
.mobile-sidebar .v-navigation-drawer__content {
  block-size: 100vh !important;
  overflow-y: auto !important;
  scrollbar-color: rgba(234, 88, 12, 30%) transparent;
  scrollbar-width: thin;
}

.mobile-sidebar .v-navigation-drawer__content::-webkit-scrollbar {
  inline-size: 6px;
}

.mobile-sidebar .v-navigation-drawer__content::-webkit-scrollbar-track {
  background: transparent;
}

.mobile-sidebar .v-navigation-drawer__content::-webkit-scrollbar-thumb {
  border-radius: 0;
  background: rgba(234, 88, 12, 30%);
}

.mobile-sidebar .v-navigation-drawer__content::-webkit-scrollbar-thumb:hover {
  background: rgba(234, 88, 12, 50%);
}

.search-input-mobile .v-field {
  border-radius: 0 !important;
}
</style>
