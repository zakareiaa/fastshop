<template>
  <VMenu transition="scale-transition">
    <template #activator="{ props }">
      <div class="position-relative">
        <VBtn icon="tabler-shopping-cart" variant="text" v-bind="props">
          <VIcon
            :color="$vuetify.theme.current.dark ? 'white' : 'secondary'"
            icon="tabler-shopping-cart"
            size="24"
          />
        </VBtn>
        <VBadge
          v-if="cartItems.length > 0"
          color="error"
          :content="cartItems.length"
          bordered
          class="position-absolute top-0 end-0"
        />
      </div>
    </template>

    <VCard class="cart-menu" min-width="350">
      <VCardTitle class="d-flex justify-space-between align-center pa-4">
        <span class="text-h6"
          >{{ $t("cart.my_cart") }} ({{ cartItems.length }})</span
        >
        <VBtn
          v-if="cartItems.length > 0"
          variant="text"
          density="compact"
          color="error"
          @click="clearCart"
        >
          {{ $t("cart.clear_all") }}
        </VBtn>
      </VCardTitle>

      <VDivider />

      <div v-if="cartItems.length === 0" class="pa-4 text-center">
        <VIcon
          icon="tabler-shopping-cart-off"
          size="64"
          color="grey-lighten-1"
          class="mb-2"
        />
        <div class="text-body-1 mb-2">{{ $t("cart.empty_cart") }}</div>
        <VBtn color="primary" variant="tonal" @click="$router.push('/shop')">
          {{ $t("cart.continue_shopping") }}
        </VBtn>
      </div>

      <VList v-else class="cart-items-list">
        <VListItem
          v-for="(item, index) in cartItems"
          :key="index"
          class="cart-item py-2"
        >
          <template #prepend>
            <img
              :src="item.main_image_url"
              width="60"
              height="60"
              class="rounded"
              style="object-fit: cover"
            />
          </template>

          <VListItemTitle class="font-weight-medium ms-2">
            {{ item.name }}
          </VListItemTitle>

          <VListItemSubtitle class="ms-2">
            {{ item.quantity }} × {{ formatPrice(item.price) }}
          </VListItemSubtitle>

          <template #append>
            <div class="d-flex flex-column align-end ms-2">
              <div class="font-weight-bold">
                {{ formatPrice(item.price * item.quantity) }}
              </div>
              <VBtn
                icon="tabler-trash"
                variant="text"
                density="compact"
                color="error"
                size="small"
                @click="removeItem(index)"
              />
            </div>
          </template>
        </VListItem>
      </VList>

      <VDivider v-if="cartItems.length > 0" />

      <VCardText v-if="cartItems.length > 0" class="pa-4">
        <div class="d-flex justify-space-between mb-2">
          <span class="text-body-1">{{ $t("cart.total") }}:</span>
          <span class="font-weight-bold">{{ formatPrice(total) }}</span>
        </div>
      </VCardText>

      <VCardActions v-if="cartItems.length > 0" class="pa-4 pt-0">
        <VBtn
          block
          color="primary"
          variant="tonal"
          @click="$router.push('/checkout')"
        >
          {{ $t("cart.proceed_to_checkout") }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VMenu>
</template>

<script setup>
import { useCartStore } from "@/stores/useCartStore";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { locale } = useI18n();
const cartStore = useCartStore();
const router = useRouter();

// Computed property for current language
const currentLanguage = computed(() => locale.value);

// Get cart items from store
const cartItems = computed(() => cartStore.items);

// Calculate Total
const total = computed(() => cartStore.totalAmount);

// Format price from cents to display format
const formatPrice = (price) => {
  return `${price.toLocaleString("en-US", {
    style: "currency",
    currency: "DZD",
  })}`;
};

// Remove item from cart
const removeItem = (index) => {
  const productId = cartItems.value[index].id;
  cartStore.removeItem(productId);
};

// Clear all items from cart
const clearCart = () => {
  cartStore.clearCart();
};
</script>

<style scoped>
.cart-menu {
  overflow: hidden;
  border-radius: 8px;
}

.cart-items-list {
  max-block-size: 300px;
  overflow-y: auto;
}

.cart-item {
  border-block-end: 1px solid rgba(0, 0, 0, 5%);
}

.cart-item:last-child {
  border-block-end: none;
}
</style>
