<template>
  <div class="position-relative">
    <VBtn
      :icon="isInWishlist ? 'tabler-heart-filled' : 'tabler-heart'"
      variant="text"
      @click="toggleWishlist"
      v-bind="$attrs"
    >
      <VIcon
        :icon="isInWishlist ? 'tabler-heart-filled' : 'tabler-heart'"
        size="24"
        class="wishlist-icon"
        :color="$vuetify.theme.current.dark ? 'white' : '#000'"
      />
    </VBtn>
    <VBadge
      v-if="showCount && wishlistCount > 0"
      :content="wishlistCount"
      color="error"
      bordered
      class="position-absolute top-0 end-0"
    />
  </div>
</template>

<script setup>
import { useWishlistStore } from "@/stores/useWishlistStore";
import { computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  product: {
    type: Object,
    default: null,
  },
  showCount: {
    type: Boolean,
    default: false,
  },
});

const wishlistStore = useWishlistStore();
const router = useRouter();

const wishlistCount = computed(() => wishlistStore.count);

const isInWishlist = computed(() => {
  if (props.product) {
    return wishlistStore.isInWishlist(props.product.id);
  }
  return false;
});

const toggleWishlist = () => {
  if (props.product) {
    wishlistStore.toggleItem(props.product);
  } else {
    // If no product is provided, navigate to wishlist page
    router.push("/wishlist");
  }
};
</script>
