<template>
  <div v-if="isReady" class="text-base pa-3 pa-sm-6">
    <div class="text-center">
      <h4 class="text-h4 mb-4">{{ $t("confirmation.thank_you") }}</h4>
      <p>
        {{ $t("confirmation.your_order") }}
        <span class="text-body-1 font-weight-medium text-high-emphasis">
          #{{ orderSummary?.order_number || "N/A" }}
        </span>
        {{ $t("confirmation.order_placed") }}
      </p>
      <p class="mb-0">
        {{ $t("confirmation.contact_message") }}
        <span class="text-body-1 font-weight-medium text-high-emphasis">
          {{ orderSummary.customer_phone }}
        </span>
        {{ $t("confirmation.contact_details") }}
      </p>
      <p class="mb-4">{{ $t("confirmation.phone_nearby") }}</p>
      <div class="d-flex align-center gap-2 justify-center">
        <VIcon size="20" icon="tabler-clock" class="text-high-emphasis" />
        <span
          >{{ $t("confirmation.time_placed") }}
          {{
            orderSummary?.created_at
              ? moment(orderSummary.created_at).format("YYYY-MM-DD HH:mm")
              : "N/A"
          }}</span
        >
      </div>
    </div>

    <VRow class="border rounded ma-0 mt-6">
      <VCol
        cols="12"
        md="6"
        class="pa-6"
        :class="$vuetify.display.mdAndUp ? 'border-e' : 'border-b'"
      >
        <div class="d-flex align-center gap-2 text-high-emphasis mb-4">
          <VIcon icon="tabler-map-pin" size="20" />
          <span class="text-base font-weight-medium">{{
            $t("confirmation.shipping_information")
          }}</span>
        </div>

        <p class="mb-1 font-weight-medium">
          {{ orderSummary?.customer_name || "N/A" }}
        </p>
        <p class="mb-1">{{ orderSummary?.customer_phone || "N/A" }}</p>
        <p class="mb-1">{{ wilaya || "N/A" }}, {{ commune || "N/A" }}</p>
        <p class="mb-1">{{ orderSummary?.address.address || "N/A" }}</p>

        <p v-if="orderSummary?.notes" class="mt-4 mb-0">
          <span class="font-weight-medium">{{ $t("confirmation.note") }}</span>
          {{ orderSummary?.notes || "" }}
        </p>
      </VCol>

      <VCol cols="12" md="6" class="pa-6">
        <div class="d-flex align-center gap-2 text-high-emphasis mb-4">
          <VIcon icon="tabler-truck-delivery" size="20" />
          <span class="text-base font-weight-medium">{{
            $t("confirmation.delivery_method")
          }}</span>
        </div>

        <p class="font-weight-medium mb-1">
          {{
            orderSummary?.shipping_method === "pickup"
              ? $t("confirmation.pickup_office")
              : $t("confirmation.home_delivery")
          }}
        </p>
        <p class="text-medium-emphasis mb-2">
          {{ $t("confirmation.estimated_delivery") }}
        </p>
      </VCol>
    </VRow>

    <VRow>
      <VCol cols="12" md="7">
        <!-- 👉 cart items -->
        <div class="border rounded">
          <template v-for="(item, index) in orderItems" :key="item.id">
            <div
              class="d-flex align-start gap-4 pa-6 position-relative flex-column flex-sm-row"
              :class="index ? 'border-t' : ''"
            >
              <div>
                <img
                  :src="
                    item?.main_image_url ||
                    'https://via.placeholder.com/80?text=No+Image'
                  "
                  :alt="item?.name || 'Product Image'"
                  class="rounded"
                  style="object-fit: cover"
                  :style="{
                    width: $vuetify.display.width <= 700 ? '100%' : '120px',
                  }"
                />
              </div>

              <div
                class="d-flex w-100 justify-space-between gap-4"
                :class="
                  $vuetify.display.width <= 700 ? 'flex-column' : 'flex-row'
                "
              >
                <div>
                  <div class="d-flex align-center gap-2 mb-2">
                    <h6 class="text-h6">
                      {{ item?.name || $t("confirmation.unknown_product") }}
                    </h6>
                    <VChip
                      size="small"
                      :color="item?.in_stock ? 'success' : 'warning'"
                    >
                      {{
                        item?.in_stock
                          ? $t("product.in_stock")
                          : $t("product.out_of_stock")
                      }}
                    </VChip>
                  </div>
                  <!-- Product Options -->
                  <div
                    v-if="
                      item.selectedOptions &&
                      Object.keys(item.selectedOptions).length > 0
                    "
                    class="ms-3 mb-2"
                  >
                    <div
                      class="text-caption text-medium-emphasis font-weight-bold mb-1"
                    >
                      {{ $t("confirmation.selected_options") }}
                    </div>
                    <div
                      v-for="(option, optionKey) in item.selectedOptions"
                      :key="optionKey"
                      class="d-flex justify-space-between align-center mb-1"
                    >
                      <span class="text-caption">
                        <strong>{{ optionKey }}:</strong> {{ option.name }}
                      </span>
                      <span
                        class="text-caption text-success ms-3"
                        v-if="option.price_added > 0"
                      >
                        +{{ formatPrice(option.price_added) }}
                      </span>
                    </div>
                  </div>
                  <!-- <div
                    v-if="item.variation"
                    class="text-body-2 text-medium-emphasis mb-2"
                  >
                    {{ item.variation }}
                  </div> -->
                  <div class="d-flex align-center gap-2">
                    <span class="text-body-2 text-medium-emphasis">{{
                      $t("confirmation.quantity")
                    }}</span>
                    <span class="font-weight-medium">{{
                      item?.quantity || 0
                    }}</span>
                  </div>
                </div>

                <div class="d-flex flex-column align-end">
                  <div class="text-primary font-weight-medium">
                    {{ formatPrice(getItemTotalPrice(item)) }}
                  </div>
                  <!-- <div
                    v-if="item.discountPrice"
                    class="text-decoration-line-through text-disabled text-caption"
                  >
                    {{ (item.discountPrice * (item.quantity || 1)).toFixed(2) }}
                  </div> -->
                </div>
              </div>
            </div>
          </template>
        </div>
      </VCol>

      <VCol cols="12" md="5">
        <div class="border rounded">
          <div class="border-b pa-6">
            <h6 class="text-base font-weight-medium mb-4">
              {{ $t("confirmation.order_summary") }}
            </h6>

            <div class="d-flex flex-column gap-2">
              <div class="d-flex justify-space-between">
                <span class="text-medium-emphasis">{{
                  $t("confirmation.subtotal_items", {
                    count: orderItems?.length || 0,
                  })
                }}</span>
                <span class="font-weight-bold">{{
                  formatPrice(subtotalCost)
                }}</span>
              </div>

              <div
                v-if="totalOptionsPrice > 0"
                class="d-flex justify-space-between"
              >
                <span class="text-medium-emphasis">{{
                  $t("cart.product_options")
                }}</span>
                <span class="font-weight-bold">{{
                  formatPrice(totalOptionsPrice)
                }}</span>
              </div>

              <div class="d-flex justify-space-between">
                <span class="text-medium-emphasis">{{
                  $t("confirmation.shipping")
                }}</span>
                <span class="font-weight-bold">{{
                  formatPrice(shippingCost)
                }}</span>
              </div>

              <VDivider class="my-2" />

              <div class="d-flex justify-space-between font-weight-medium">
                <span>{{ $t("cart.total") }}</span>
                <span class="font-weight-bold">{{
                  formatPrice(grandTotal)
                }}</span>
              </div>
            </div>
          </div>

          <div class="pa-4 text-center">
            <VBtn
              color="primary"
              variant="tonal"
              block
              class="mb-3"
              @click="continueShopping"
            >
              <VIcon start icon="tabler-shopping-bag" />
              {{ $t("confirmation.continue_shopping") }}
            </VBtn>
            <div class="text-caption text-medium-emphasis">
              {{ $t("confirmation.need_help") }}
            </div>
          </div>
        </div>
      </VCol>
    </VRow>
  </div>
  <VCard v-else class="text-center pa-10">
    <VProgressCircular indeterminate color="primary" size="64" />
    <p class="mt-4 text-medium-emphasis">
      {{ $t("confirmation.loading_confirmation") }}
    </p>
  </VCard>
</template>

<script>
import moment from "moment";

import communes from "@/assets/data/commune.json";
import wilayas from "@/assets/data/wilayas.json";

export default {
  name: "OrderConfirmation",

  setup() {
    return {
      moment,
    };
  },

  props: {
    orderSummary: {
      type: Object,
      default: () => ({}),
    },
    orderItems: {
      type: Array,
      default: () => [],
    },
  },

  mounted() {
    // console.log('OrderSummary in Confirmation:', this.orderSummary);
    // console.log('OrderItems in Confirmation:', this.orderItems);
  },

  computed: {
    wilaya() {
      const wilaya = wilayas.find(
        (w) => w.id === this.orderSummary.address.wilaya_id
      );
      return wilaya.name;
    },
    commune() {
      const commune = communes.find(
        (c) => c.id === this.orderSummary.address.commune_id
      );
      return commune.name;
    },

    isReady() {
      // Check if orderSummary has at least one key (e.g., order_number) and orderItems is an array
      return (
        this.orderSummary &&
        Object.keys(this.orderSummary).length > 0 &&
        Array.isArray(this.orderItems)
      );
    },

    subtotalCost() {
      if (!this.orderItems || this.orderItems.length === 0) return 0;
      return this.orderItems.reduce((total, item) => {
        return total + (item?.price || 0) * (item?.quantity || 0);
      }, 0);
    },

    totalOptionsPrice() {
      if (!this.orderItems || this.orderItems.length === 0) return 0;
      return this.orderItems.reduce((total, item) => {
        let optionsPrice = 0;
        if (item.selectedOptions) {
          Object.values(item.selectedOptions).forEach((option) => {
            optionsPrice += (option.price_added || 0) * (item?.quantity || 0);
          });
        }
        return total + optionsPrice;
      }, 0);
    },

    orderTotal() {
      if (!this.orderItems || this.orderItems.length === 0) return 0;
      return this.orderItems.reduce((total, item) => {
        let itemPrice = item?.price || 0;

        // Add selectedOptions prices
        if (item.selectedOptions) {
          Object.values(item.selectedOptions).forEach((option) => {
            itemPrice += option.price_added || 0;
          });
        }

        return total + itemPrice * (item?.quantity || 0);
      }, 0);
    },

    shippingCost() {
      // Try to get shipping cost from the API response first, fallback to other methods
      return (
        this.orderSummary?.amounts?.shipping_amount ||
        this.orderSummary?.shipping_method?.price ||
        this.orderSummary?.shipping_fee ||
        0
      );
    },

    grandTotal() {
      const total =
        this.subtotalCost + this.totalOptionsPrice + Number(this.shippingCost);
      console.log(
        "Debug - Subtotal:",
        this.subtotalCost,
        "Options:",
        this.totalOptionsPrice,
        "Shipping:",
        this.shippingCost,
        "Total:",
        total
      );
      return total;
    },
    // orderDate and orderNumber computed properties seem unused in the current template, removed for cleanup.
    // If they are needed, they can be re-added.
  },

  methods: {
    formatPrice(price) {
      // Ensure price is a number and handle potential issues
      const numPrice = parseFloat(price) || 0;
      return numPrice.toLocaleString("en-US", {
        style: "currency",
        currency: "DZD",
      });
    },

    getItemTotalPrice(item) {
      let itemPrice = item?.price || 0;

      // Add selectedOptions prices
      if (item.selectedOptions) {
        Object.values(item.selectedOptions).forEach((option) => {
          itemPrice += option.price_added || 0;
        });
      }

      return itemPrice * (item?.quantity || 0);
    },

    continueShopping() {
      this.$router.push("/shop");
    },
  },
};
</script>
