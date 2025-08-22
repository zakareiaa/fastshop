<template>
  <Header />

  <div class="app-container py-6">
    <VCard variant="flat" class="b-radius-0">
      <VCardText class="px-0 py-0 py-sm-4">
        <!-- 👉 stepper content -->
        <VWindow
          v-model="currentStep"
          class="disable-tab-transition"
          :touch="false"
        >
          <VWindowItem>
            <VRow class="pa-0 pa-sm-4">
              <VCol cols="12" :lg="cartItems.length > 0 ? 8 : 12">
                <!-- <h5 class="text-h5 my-4">
                  My Shopping Bag ({{ checkoutCartDataLocal.cartItems.length }}
                  Items)
                </h5> -->
                <div
                  class="position-relative d-flex justify-space-between mb-1 me-2 pb-4"
                >
                  <div class="section-title position-relative">
                    {{ $t("cart.my_shopping_bag") }}
                  </div>
                </div>

                <!-- 👉 Cart items -->
                <div v-if="cartItems.length" class="border b-radius-0">
                  <template v-for="(item, index) in cartItems" :key="item.id">
                    <div
                      class="d-flex align-center gap-4 py-3 px-3 position-relative flex-column flex-sm-row"
                      :class="index ? 'border-t' : ''"
                    >
                      <img
                        width="140"
                        class="checkout-product-image"
                        :src="item.main_image_url"
                      />

                      <div class="d-flex w-100">
                        <div class="d-flex flex-column gap-y-2">
                          <div class="d-flex align-center gap-3">
                            <h6 class="text-h6">
                              {{ item.name }}
                            </h6>
                            <!-- <div
                              class="d-flex align-center text-no-wrap gap-4 text-body-1"
                            >
                              <VChip
                                color="success"
                                label
                                size="small"
                                v-if="item.in_stock"
                              >
                                {{ $t("product.in_stock") }}
                              </VChip>
                              <VChip color="warning" label size="small" v-else>
                                {{ $t("product.out_of_stock") }}
                              </VChip>
                            </div> -->
                          </div>
                          <!-- Product Options -->
                          <div
                            v-if="
                              item.selectedOptions &&
                              Object.keys(item.selectedOptions).length > 0
                            "
                          >
                            <!-- <div
                              class="text-caption text-medium-emphasis font-weight-bold mb-1"
                            >
                              {{ $t("confirmation.selected_options") }}
                            </div> -->
                            <div
                              v-for="(
                                option, optionKey
                              ) in item.selectedOptions"
                              :key="optionKey"
                              class="d-flex justify-space-between align-center mb-1"
                            >
                              <span class="text-body-2">
                                <strong>{{ optionKey }}:</strong>
                                {{ option.name }}
                              </span>
                              <span
                                class="text-body-2 text-success ms-3"
                                v-if="option.price_added > 0"
                              >
                                +{{ formatPrice(option.price_added) }}
                              </span>
                            </div>
                          </div>

                          <!-- <div class="d-flex align-end mb-4">
                            <VRating
                              density="compact"
                              :model-value="item.average_rating || 0"
                              size="24"
                              readonly
                            />

                            <span class="ms-2 text-body-2"
                              >({{ item.reviews_count }} reviews)</span
                            >
                          </div> -->

                          <div class="d-flex align-center border w-fit-content">
                            <VBtn
                              icon="tabler-minus"
                              size="small"
                              variant="text"
                              @click="
                                decrementQuantity(item.id, item.selectedOptions)
                              "
                              :disabled="item.quantity <= 1"
                            />
                            <span class="mx-2">{{ item.quantity }}</span>
                            <VBtn
                              icon="tabler-plus"
                              size="small"
                              variant="text"
                              @click="
                                incrementQuantity(item.id, item.selectedOptions)
                              "
                            />
                            <!-- :disabled="isIncrementDisabled(item)" -->
                          </div>
                        </div>

                        <VSpacer />

                        <div
                          class="d-flex flex-column text-start align-end text-md-end mb-2"
                          :class="
                            $vuetify.display.mdAndDown
                              ? 'gap-2 align-end'
                              : 'gap-4'
                          "
                        >
                          <VBtn
                            icon="tabler-x"
                            size=""
                            variant="text"
                            @click="removeItem(item.id, item.selectedOptions)"
                          >
                          </VBtn>

                          <div class="text-primary font-weight-bold">
                            {{ formatPrice(item.price * item.quantity) }}
                          </div>

                          <div>
                            <VBtn
                              variant="tonal"
                              size="small"
                              @click="moveToWishlist(item.id)"
                              class="b-radius-0"
                            >
                              {{ $t("cart.move_to_wishlist") }}
                            </VBtn>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>

                <!-- Stock Warning Message -->
                <div v-if="stockWarningMessage" class="mt-4">
                  <VAlert
                    type="warning"
                    variant="tonal"
                    class="text-body-2"
                    density="compact"
                  >
                    {{ stockWarningMessage }}
                  </VAlert>
                </div>

                <!-- 👉 Empty Cart -->
                <div v-if="cartItems.length === 0" class="text-center py-6">
                  <VIcon
                    icon="tabler-shopping-cart-off"
                    size="64"
                    class="mb-3"
                  />
                  <h3 class="text-h5 font-weight-medium mb-2">
                    {{ $t("cart.empty_cart") }}
                  </h3>
                  <p class="text-body-1 mb-6">
                    {{ $t("cart.empty_cart_message") }}
                  </p>
                  <VBtn color="primary" class="b-radius-0" to="/shop">{{
                    $t("cart.continue_shopping")
                  }}</VBtn>
                </div>

                <!-- 👉 Add more from wishlist -->
                <div
                  v-if="wishlistItems.length > 0 && cartItems.length > 0"
                  class="d-flex align-center justify-space-between b-radius-0 py-2 px-5 text-base mt-4 cursor-pointer"
                  style="border: 1px solid rgb(var(--v-theme-primary))"
                  @click="$router.push('/wishlist')"
                >
                  <routerLink to="/wishlist" class="font-weight-medium">
                    {{ $t("cart.add_from_wishlist") }}
                  </routerLink>
                  <VIcon
                    icon="tabler-arrow-right"
                    size="16"
                    class="text-primary"
                  />
                </div>
              </VCol>

              <VCol cols="12" lg="4" v-if="cartItems.length > 0">
                <div
                  class="position-relative d-flex justify-space-between mb-1 me-2 pb-4"
                >
                  <div class="section-title position-relative">
                    {{ $t("checkout.order_summary") }}
                  </div>
                </div>

                <VCard flat variant="outlined" class="b-radius-0">
                  <!-- 👉 Price details -->
                  <VCardText class="pa-3 pa-sm-5">
                    <!-- <h6 class="text-h6 mb-4">Price Details</h6> -->

                    <div class="text-high-emphasis">
                      <div class="d-flex justify-space-between mb-2">
                        <span>{{ $t("cart.subtotal") }}</span>
                        <span class="text-medium-emphasis font-weight-bold">{{
                          formatPrice(subtotalCost)
                        }}</span>
                      </div>

                      <div
                        v-if="totalOptionsPrice > 0"
                        class="d-flex justify-space-between mb-2"
                      >
                        <span>{{ $t("cart.product_options") }}</span>
                        <span class="text-medium-emphasis font-weight-bold">{{
                          formatPrice(totalOptionsPrice)
                        }}</span>
                      </div>

                      <div class="d-flex justify-space-between mb-2">
                        <span>{{ $t("cart.order_total") }}</span>
                        <span class="text-medium-emphasis font-weight-bold">{{
                          formatPrice(totalCost)
                        }}</span>
                      </div>

                      <!-- Coupon discount -->
                      <!-- <div
                        v-if="appliedCoupon"
                        class="d-flex justify-space-between mb-2"
                      >
                        <span class="text-success"
                          >{{ $t("cart.discount") }} ({{
                            appliedCoupon.code
                          }})</span
                        >
                        <span class="text-success font-weight-bold">
                          -{{ formatPrice(couponDiscount) }}
                        </span>
                      </div> -->

                      <div class="d-flex justify-space-between mb-2">
                        <span>{{ $t("cart.delivery_charges") }}</span>

                        <div class="d-flex align-center">
                          <span class="text-medium-emphasis font-weight-bold">{{
                            shippingPrice
                              ? formatPrice(shippingPrice)
                              : $t("checkout.select_wilaya_first")
                          }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Coupon Code Input -->
                    <!-- <div v-if="!appliedCoupon" class="mt-4">
                      <VTextField
                        v-model="couponCode"
                        :label="$t('cart.coupon_code')"
                        :placeholder="$t('cart.enter_coupon_code')"
                        class="b-radius-0"
                        :error-messages="couponError"
                        :loading="couponValidationLoading"
                        :disabled="couponValidationLoading"
                        @keyup.enter="validateCoupon"
                      >
                        <template #append-inner>
                          <VBtn
                            size="small"
                            variant="text"
                            @click="validateCoupon"
                            :loading="couponValidationLoading"
                            :disabled="
                              !couponCode.trim() || couponValidationLoading
                            "
                          >
                            {{ $t("cart.apply") }}
                          </VBtn>
                        </template>
                      </VTextField>
                    </div> -->

                    <!-- Applied Coupon Display -->
                    <!-- <div v-else class="mt-4">
                      <div class="coupon-applied-card pa-3 b-radius-0 border">
                        <div class="d-flex align-center justify-space-between">
                          <div class="d-flex align-center">
                            <VIcon
                              icon="tabler-tag"
                              color="success"
                              size="20"
                              class="me-2"
                            />
                            <div>
                              <div
                                class="text-success font-weight-bold text-body-2"
                              >
                                {{ appliedCoupon.code }}
                              </div>
                              <div
                                class="text-caption text-medium-emphasis"
                                v-if="appliedCoupon.description"
                              >
                                {{ appliedCoupon.description }}
                              </div>
                            </div>
                          </div>
                          <VBtn
                            icon="tabler-x"
                            size="x-small"
                            variant="text"
                            color="medium-emphasis"
                            @click="removeCoupon"
                          />
                        </div>
                      </div>
                    </div> -->
                  </VCardText>

                  <VDivider />

                  <!-- 👉 Total -->
                  <VCardText class="d-flex justify-space-between pa-3 pa-sm-5">
                    <h6 class="text-h6">{{ $t("cart.total") }}</h6>
                    <h6 class="text-h6 font-weight-bold">
                      {{
                        shippingPrice
                          ? formatPrice(finalTotal)
                          : formatPrice(totalAfterDiscount)
                      }}
                    </h6>
                  </VCardText>

                  <VCardText class="pt-0 pa-3 pa-sm-5">
                    <VBtn block @click="nextStep" class="b-radius-0">
                      {{ $t("cart.continue") }}
                      <VIcon icon="tabler-arrow-right" end class="" />
                    </VBtn>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </VWindowItem>

          <VWindowItem>
            <VRow v-if="checkoutCartDataLocal" class="pt-4 px-4 px-sm-6">
              <VCol cols="12" lg="8">
                <div
                  class="position-relative d-flex justify-space-between mb-1 me-2 pb-4"
                >
                  <div class="section-title position-relative">
                    {{ $t("checkout.delivery_address") }}
                  </div>
                </div>

                <VCard
                  flat
                  variant="outlined"
                  class="pa-5 px-3 px-sm-5 mb-5 b-radius-0"
                >
                  <VForm ref="confirmOrderForm">
                    <VRow>
                      <VCol cols="12" md="6">
                        <VTextField
                          class="b-radius-0"
                          v-model="name"
                          :label="$t('checkout.full_name')"
                          :placeholder="$t('checkout.full_name_placeholder')"
                          :rules="[requiredValidator]"
                        />
                      </VCol>

                      <VCol cols="12" md="6">
                        <VTextField
                          class="b-radius-0"
                          v-model="phone"
                          :label="$t('checkout.phone_number')"
                          :placeholder="$t('checkout.phone_placeholder')"
                          :rules="[requiredValidator, algerianPhoneNumberValid]"
                        />
                      </VCol>

                      <VCol cols="12" md="6">
                        <VSelect
                          class="b-radius-0"
                          v-model="wilaya"
                          :label="$t('checkout.wilaya')"
                          :items="wilayas"
                          item-title="name"
                          item-value="id"
                          :loading="getWilayasLoading"
                          :disabled="getWilayasLoading"
                          :placeholder="$t('checkout.wilaya_placeholder')"
                          :rules="[requiredValidator]"
                        />
                      </VCol>

                      <VCol cols="12" md="6">
                        <VSelect
                          class="b-radius-0"
                          v-model="commune"
                          :label="$t('checkout.commune')"
                          :items="communesByWilaya"
                          item-title="name"
                          item-value="id"
                          :placeholder="$t('checkout.commune_placeholder')"
                          :no-data-text="
                            $t('checkout.select_wilaya_first_commune')
                          "
                          :loading="getCommunesLoading"
                          :disabled="getCommunesLoading"
                          :rules="[requiredValidator]"
                        />
                      </VCol>

                      <VCol cols="12">
                        <CustomCheckboxesWithIcon
                          v-model:selected-checkbox="selectedCheckbox"
                          :checkbox-content="checkboxContent"
                          :grid-column="{ sm: '6', cols: '12' }"
                          class="b-radius-0"
                        />

                        <!-- Warning message when pickup is not available -->
                        <VAlert
                          v-if="selectedWilaya && isPickupAvailable == false"
                          type="info"
                          variant="tonal"
                          class="mt-3"
                        >
                          <template #prepend>
                            <VIcon icon="tabler-info-circle" />
                          </template>
                          {{ $t("checkout.pickup_not_available_message") }}
                        </VAlert>

                        <!-- 
                        <VAlert
                          v-if="
                            isDeliveryOfficeAvailable == 'false' &&
                            selectedCheckbox.includes('pickup')
                          "
                          type="info"
                          variant="tonal"
                          class="mt-3"
                        >
                          <template #prepend>
                            <VIcon icon="tabler-info-circle" />
                          </template>
                          {{
                            $t(
                              "checkout.office_not_available_in_your_commune_message"
                            )
                          }}
                        </VAlert> -->
                      </VCol>

                      <VCol cols="12" v-if="selectedCheckbox.includes('home')">
                        <VTextField
                          class="b-radius-0"
                          v-model="address"
                          :label="$t('checkout.detailed_address')"
                          :placeholder="$t('checkout.address_placeholder')"
                        />
                      </VCol>

                      <VCol cols="12">
                        <VTextField
                          class="b-radius-0"
                          v-model="email"
                          :label="$t('checkout.email_optional')"
                          :placeholder="$t('checkout.email_placeholder')"
                          :rules="[emailValidator]"
                        />
                      </VCol>

                      <VCol cols="12">
                        <VTextarea
                          class="b-radius-0"
                          v-model="note"
                          :label="$t('checkout.note_optional')"
                          :placeholder="$t('checkout.note_placeholder')"
                          rows="3"
                        />
                      </VCol>
                    </VRow>
                  </VForm>
                </VCard>
              </VCol>

              <VCol cols="12" lg="4">
                <div
                  class="position-relative d-flex justify-space-between mb-1 me-2 pb-4"
                >
                  <div class="section-title position-relative">
                    {{ $t("checkout.order_summary") }}
                  </div>
                </div>

                <VCard flat variant="outlined" class="b-radius-0">
                  <VCardText class="pa-3 pa-sm-5">
                    <!-- <h6 class="text-h6 mb-4">Price Details</h6> -->

                    <div class="text-high-emphasis">
                      <div class="d-flex justify-space-between mb-2">
                        <span>{{ $t("cart.subtotal") }}</span>
                        <span class="text-medium-emphasis font-weight-bold">{{
                          formatPrice(subtotalCost)
                        }}</span>
                      </div>

                      <div
                        v-if="totalOptionsPrice > 0"
                        class="d-flex justify-space-between mb-2"
                      >
                        <span>{{ $t("cart.product_options") }}</span>
                        <span class="text-medium-emphasis font-weight-bold">{{
                          formatPrice(totalOptionsPrice)
                        }}</span>
                      </div>

                      <div class="d-flex justify-space-between mb-2">
                        <span>{{ $t("cart.order_total") }}</span>
                        <span class="text-medium-emphasis font-weight-bold">{{
                          formatPrice(totalCost)
                        }}</span>
                      </div>

                      <!-- Coupon discount -->
                      <div
                        v-if="appliedCoupon"
                        class="d-flex justify-space-between mb-2"
                      >
                        <span class="text-success"
                          >{{ $t("cart.discount") }} ({{
                            appliedCoupon.code
                          }})</span
                        >
                        <span class="text-success font-weight-bold">
                          - DZD {{ formatPrice(couponDiscount) }}
                        </span>
                      </div>

                      <div class="d-flex justify-space-between mb-2">
                        <span>{{ $t("cart.delivery_charges") }}</span>

                        <div class="d-flex align-center">
                          <span class="text-medium-emphasis font-weight-bold">{{
                            shippingPrice
                              ? formatPrice(shippingPrice)
                              : $t("checkout.select_wilaya_first")
                          }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Coupon Code Input -->
                    <div v-if="!appliedCoupon" class="mt-4">
                      <VTextField
                        v-model="couponCode"
                        :label="$t('cart.coupon_code')"
                        :placeholder="$t('cart.enter_coupon_code')"
                        class="b-radius-0"
                        :error-messages="couponError"
                        :loading="couponValidationLoading"
                        :disabled="couponValidationLoading"
                        @keyup.enter="validateCoupon"
                      >
                        <template #append-inner>
                          <VBtn
                            size="small"
                            variant="text"
                            @click="validateCoupon"
                            :loading="couponValidationLoading"
                            :disabled="
                              !couponCode.trim() || couponValidationLoading
                            "
                          >
                            {{ $t("cart.apply") }}
                          </VBtn>
                        </template>
                      </VTextField>
                    </div>

                    <!-- Applied Coupon Display -->
                    <div v-else class="mt-4">
                      <div class="coupon-applied-card pa-3 b-radius-0 border">
                        <div class="d-flex align-center justify-space-between">
                          <div class="d-flex align-center">
                            <VIcon
                              icon="tabler-ticket"
                              color="success"
                              size="20"
                              class="me-2"
                            />
                            <div>
                              <div
                                class="text-success font-weight-bold text-body-2"
                              >
                                {{ appliedCoupon.code }}
                              </div>
                              <div
                                class="text-caption text-medium-emphasis"
                                v-if="appliedCoupon.description"
                              >
                                {{ appliedCoupon.description }}
                              </div>
                            </div>
                          </div>
                          <VBtn
                            icon="tabler-x"
                            size="x-small"
                            variant="text"
                            color="medium-emphasis"
                            @click="removeCoupon"
                          />
                        </div>
                      </div>
                    </div>
                  </VCardText>

                  <VDivider />

                  <!-- 👉 Total -->
                  <VCardText class="d-flex justify-space-between pa-3 pa-sm-5">
                    <h6 class="text-h6">{{ $t("cart.total") }}</h6>
                    <h6 class="text-h6 font-weight-bold">
                      {{ formatPrice(finalTotal) }}
                    </h6>
                  </VCardText>

                  <VDivider />

                  <VCardActions class="pa-3 pa-sm-5">
                    <VBtn
                      color="primary"
                      variant="flat"
                      class="w-100 b-radius-0"
                      :loading="confirmOrderLoading"
                      :disabled="confirmOrderLoading"
                      @click="confirmOrder"
                    >
                      {{ $t("checkout.confirm_order") }}
                    </VBtn>
                  </VCardActions>
                </VCard>
              </VCol>
            </VRow>
          </VWindowItem>

          <VWindowItem>
            <div v-if="orderSummary && orderItems && orderItems.length > 0">
              <Confirmation
                :order-summary="orderSummary"
                :order-items="orderItems"
                :wilayas="wilayas"
                :communes="communes"
              />
            </div>
            <div v-else class="text-center py-8">
              <VProgressCircular indeterminate color="primary" />
              <p class="mt-4">Loading order confirmation...</p>
            </div>
          </VWindowItem>
        </VWindow>
      </VCardText>
    </VCard>
  </div>

  <VSnackbar
    v-model="isSnackbarVisible"
    transition="scroll-y-reverse-transition"
    location="top end"
    :timeout="3000"
    :color="snackbarColor"
  >
    <span style="color: rgb(var(--v-theme-on-primary))">
      {{ snackbarText }}
    </span>

    <template #actions>
      <VBtn
        color="rgb(var(--v-theme-on-primary))"
        @click="isSnackbarVisible = false"
      >
        {{ $t("common.close") }}
      </VBtn>
    </template>
  </VSnackbar>

  <Footer />
</template>

<script>
import axios from "axios";
import confetti from "canvas-confetti";

import Footer from "@/components/costumComponents/Footer.vue";
import Header from "@/components/costumComponents/Header.vue";

import Confirmation from "@/components/costumComponents/Confirmation.vue";

import { useCartStore } from "@/stores/useCartStore";
import { useWishlistStore } from "@/stores/useWishlistStore";

import {
  createAlgerianPhoneValidator,
  createEmailValidator,
  createRequiredValidator,
} from "@/@core/utils/validators";

export default {
  name: "CheckoutPage",

  components: {
    Header,
    Footer,
    Confirmation,
  },

  data() {
    return {
      checkoutCartDataLocal: {
        cartItems: [],
        orderAmount: 0,
        promoCode: "",
      },
      currentStep: 0,

      name: null,
      phone: null,
      wilaya: null,
      commune: null,
      communesByWilaya: [],
      address: null,
      note: null,

      wilayas: [],
      getWilayasLoading: false,

      communes: [],
      getCommunesLoading: true,

      checkboxContent: [
        {
          title: this.$t("checkout.pickup_option_title"),
          desc: this.$t("checkout.pickup_option_desc"),
          value: "pickup",
          icon: { icon: "tabler-building", size: "28" },
        },
        {
          title: this.$t("checkout.home_option_title"),
          desc: this.$t("checkout.home_option_desc"),
          value: "home",
          icon: { icon: "tabler-home", size: "28" },
        },
      ],

      email: "",

      selectedCheckbox: ["pickup"],
      cartStore: null,
      wishlistStore: null,

      // Coupon code data
      couponCode: "",
      appliedCoupon: null,
      couponValidationLoading: false,
      couponError: "",

      confirmOrderLoading: false,

      isSnackbarVisible: false,
      snackbarText: "",
      snackbarColor: "",

      // Stock warning message
      stockWarningMessage: "",

      orderItems: null,
      orderSummary: null,

      api_url: import.meta.env.VITE_API_URL,
    };
  },

  computed: {
    currentLanguage() {
      return this.$i18n.locale;
    },

    // Check if selected commune has delivery office
    // isDeliveryOfficeAvailable() {
    //   if (!this.commune || !this.communesByWilaya.length) return null;

    //   const selectedCommune = this.communesByWilaya.find(
    //     (c) => c.id === this.commune
    //   );

    //   if (!selectedCommune) return null;

    //   console.log(selectedCommune.have_delivery_office);

    //   return selectedCommune.have_delivery_office;
    // },

    // Translated validators
    requiredValidator() {
      return createRequiredValidator(this.$t);
    },

    emailValidator() {
      return createEmailValidator(this.$t);
    },

    algerianPhoneNumberValid() {
      return createAlgerianPhoneValidator(this.$t);
    },

    cartItems() {
      return this.cartStore ? this.cartStore.items : [];
    },

    wishlistItems() {
      return this.wishlistStore ? this.wishlistStore.items : [];
    },

    subtotalCost() {
      return this.cartItems.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    },

    totalOptionsPrice() {
      return this.cartItems.reduce((total, item) => {
        let optionsPrice = 0;
        if (item.selectedOptions) {
          Object.values(item.selectedOptions).forEach((option) => {
            optionsPrice += (option.price_added || 0) * item.quantity;
          });
        }
        return total + optionsPrice;
      }, 0);
    },

    totalCost() {
      return this.cartItems.reduce((total, item) => {
        let itemPrice = item.price;

        // Add selectedOptions prices
        if (item.selectedOptions) {
          Object.values(item.selectedOptions).forEach((option) => {
            itemPrice += option.price_added || 0;
          });
        }

        return total + itemPrice * item.quantity;
      }, 0);
    },

    shippingPrice() {
      if (!this.wilaya || !this.selectedCheckbox) return 0;

      const selectedWilaya = this.wilayas.find((w) => w.id === this.wilaya);
      if (!selectedWilaya) return 0;

      // Check if commune is selected and has shipping prices
      const selectedCommune = this.selectedCommune;
      const shippingMethod = this.selectedCheckbox[0];

      // Prioritize commune shipping price if it exists (not null)
      if (selectedCommune) {
        if (shippingMethod === "pickup") {
          // Use commune pickup price if available, otherwise fall back to wilaya
          return selectedCommune.pickup_shipping_price !== null
            ? selectedCommune.pickup_shipping_price
            : selectedWilaya.pickup_shipping_price;
        } else {
          // Use commune home price if available, otherwise fall back to wilaya
          return selectedCommune.home_shipping_price !== null
            ? selectedCommune.home_shipping_price
            : selectedWilaya.home_shipping_price;
        }
      }

      // Fallback to wilaya prices if no commune selected or commune doesn't have prices
      return shippingMethod === "pickup"
        ? selectedWilaya.pickup_shipping_price
        : selectedWilaya.home_shipping_price;
    },

    totalWithShipping() {
      return this.totalCost + this.shippingPrice;
    },

    // Add selectedWilaya computed property
    selectedWilaya() {
      if (!this.wilaya) return null;
      return this.wilayas.find((w) => w.id === this.wilaya);
    },

    // Add selectedCommune computed property
    selectedCommune() {
      if (!this.commune || !this.communesByWilaya.length) return null;
      return this.communesByWilaya.find((c) => c.id === this.commune);
    },

    // Add isPickupAvailable computed property
    isPickupAvailable() {
      if (!this.selectedWilaya) return null;

      // If commune is selected and has pickup price, use that
      const selectedCommune = this.selectedCommune;
      if (selectedCommune && selectedCommune.pickup_shipping_price !== null) {
        return true;
      }

      // Otherwise, check wilaya pickup availability
      return this.selectedWilaya.pickup_shipping_price !== null;
    },

    // Coupon discount calculations
    couponDiscount() {
      if (!this.appliedCoupon) return 0;
      return this.appliedCoupon.discount_amount || 0;
    },

    totalAfterDiscount() {
      return this.totalCost - this.couponDiscount;
    },

    finalTotal() {
      return this.totalAfterDiscount + this.shippingPrice;
    },
  },

  mounted() {
    this.getWilayas();
    this.getCommunes();
  },

  methods: {
    async getWilayas() {
      try {
        this.getWilayasLoading = true;
        const response = await axios.get(`${this.api_url}/wilayas`);
        this.wilayas = response.data.data || [];
      } catch (error) {
        console.error("Failed to fetch wilayas:", error);
        this.showSnackbar(this.$t("checkout.failed_to_load_wilayas"), "error");
      } finally {
        this.getWilayasLoading = false;
      }
    },

    async getCommunes() {
      try {
        this.getCommunesLoading = true;
        const response = await axios.get(`${this.api_url}/communes`);
        this.communes = response.data.data || [];
      } catch (error) {
        console.error("Failed to fetch communes:", error);
        this.showSnackbar(this.$t("checkout.failed_to_load_communes"), "error");
      } finally {
        this.getCommunesLoading = false;
      }
    },

    async confirmOrder() {
      const validate = await this.$refs.confirmOrderForm.validate();

      if (validate.valid) {
        // Prepare order data
        const orderData = {
          customer_name: this.name,
          customer_email: this.email,
          customer_phone: this.phone,
          wilaya_id: this.wilaya,
          commune_id: this.commune,
          address: this.address,
          shipping_method: this.selectedCheckbox[0],
          notes: this.note,
          // shipping_amount: this.shippingPrice,
          coupon_code: this.appliedCoupon ? this.appliedCoupon.code : null,
          items: this.cartItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            product_options: item.selectedOptions,
          })),
        };

        // Submit order to API
        try {
          this.confirmOrderLoading = true;

          // Capture order items BEFORE clearing the cart
          this.orderItems = [...this.cartStore.items];

          console.log("Order items captured:", this.orderItems);

          const response = await axios.post(
            `${this.api_url}/orders`,
            orderData,
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );
          this.orderSummary = response.data.data;

          console.log("Order summary received:", this.orderSummary);

          // Clear cart after capturing items
          this.cartStore.clearCart();

          // Scroll to top smoothly
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });

          // Trigger celebration animation after a short delay
          setTimeout(() => {
            this.triggerConfetti();
          }, 500);

          this.nextStep();
        } catch (error) {
          console.error("Error placing order:", error);
          this.showSnackbar(this.$t("common.failed_to_place_order"), "error");
        } finally {
          this.confirmOrderLoading = false;
        }
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    },

    showSnackbar(text, color) {
      this.snackbarText = text;
      this.snackbarColor = color;
      this.isSnackbarVisible = true;
    },

    async validateCoupon() {
      if (!this.couponCode.trim()) return;

      try {
        this.couponValidationLoading = true;
        this.couponError = "";

        const response = await axios.post(
          `${this.api_url}/coupon-codes/validate`,
          {
            code: this.couponCode.trim(),
            order_amount: this.totalCost,
          }
        );

        if (response.data.valid) {
          this.appliedCoupon = response.data.coupon;
          this.couponCode = "";
          this.showSnackbar(
            this.$t("cart.coupon_applied_successfully"),
            "success"
          );
        }
      } catch (error) {
        console.error("Coupon validation error:", error);
        this.couponError =
          error.response?.data?.message || this.$t("cart.invalid_coupon_code");
        this.appliedCoupon = null;
      } finally {
        this.couponValidationLoading = false;
      }
    },

    removeCoupon() {
      this.appliedCoupon = null;
      this.couponCode = "";
      this.couponError = "";
      this.showSnackbar(this.$t("cart.coupon_removed"), "info");
    },

    triggerConfetti() {
      // Left side confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.1, y: 0.6 },
        angle: 60,
        colors: ["#bb0000", "#ffffff", "#00bb00", "#0000bb", "#ffff00"],
      });

      // Center confetti
      confetti({
        particleCount: 120,
        spread: 60,
        origin: { x: 0.5, y: 0.6 },
        angle: 90,
        colors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7"],
      });

      // Right side confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.9, y: 0.6 },
        angle: 120,
        colors: ["#a29bfe", "#fd79a8", "#fdcb6e", "#6c5ce7", "#fd79a8"],
      });

      // Add a second wave after a short delay
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 50,
          origin: { x: 0.2, y: 0.7 },
          angle: 75,
        });

        confetti({
          particleCount: 80,
          spread: 50,
          origin: { x: 0.8, y: 0.7 },
          angle: 105,
        });
      }, 300);
    },

    removeItem(productId, selectedOptions = {}) {
      this.cartStore.removeItem(productId, selectedOptions);
    },

    moveToWishlist(productId) {
      const item = this.cartItems.find((item) => item.id === productId);
      if (item) {
        this.wishlistStore.addItem(item);
        this.cartStore.removeItem(productId, item.selectedOptions);
      }
    },

    incrementQuantity(productId, selectedOptions = {}) {
      // Find the cart item
      const cartItem = this.cartItems.find(
        (item) =>
          item.id === productId &&
          JSON.stringify(item.selectedOptions) ===
            JSON.stringify(selectedOptions)
      );

      if (!cartItem) return;

      // Get current stock limit for this item
      const stockLimit = this.getItemStockLimit(cartItem);

      // Check if we can increment
      if (stockLimit !== null && cartItem.quantity >= stockLimit) {
        // Show warning message when trying to exceed stock
        this.stockWarningMessage =
          this.$t("product.stock_limit_reached", { count: stockLimit }) +
          ". " +
          this.$t("product.cannot_exceed_stock");

        // Auto-hide the message after 10 seconds
        setTimeout(() => {
          this.stockWarningMessage = "";
        }, 10000);

        return;
      }

      // Clear any existing warning and increment
      this.stockWarningMessage = "";
      this.cartStore.incrementQuantity(productId, selectedOptions);
    },

    decrementQuantity(productId, selectedOptions = {}) {
      this.stockWarningMessage = ""; // Clear any existing warning
      this.cartStore.decrementQuantity(productId, selectedOptions);
    },

    // Check if increment button should be disabled for an item
    isIncrementDisabled(item) {
      const stockLimit = this.getItemStockLimit(item);
      return stockLimit !== null && item.quantity >= stockLimit;
    },

    // Get the stock limit for a cart item based on its selected options
    getItemStockLimit(item) {
      // If no product options, no stock limit
      if (!item.product_options || item.product_options.length === 0) {
        return null;
      }

      let minStock = Infinity;
      let hasValidStock = false;
      let hasUnlimitedStock = false;

      // Check stock for all selected options in this item
      if (item.selectedOptions) {
        for (const optionName in item.selectedOptions) {
          const selectedOption = item.selectedOptions[optionName];
          if (selectedOption) {
            // Check if stock is unlimited (null or empty string)
            if (
              selectedOption.stock_quantity === null ||
              selectedOption.stock_quantity === ""
            ) {
              hasUnlimitedStock = true;
            } else {
              const stock = parseInt(selectedOption.stock_quantity) || 0;
              minStock = Math.min(minStock, stock);
              hasValidStock = true;
            }
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

    formatPrice(price) {
      return price.toLocaleString("en-US", {
        style: "currency",
        currency: "DZD",
      });
    },

    previousStep() {
      if (this.currentStep > 0) {
        this.currentStep -= 1;
      }
    },

    nextStep() {
      if (this.currentStep < 2) {
        this.currentStep += 1;
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },

    placeOrder() {
      // Here you would typically send the order to your backend
      this.cartStore.clearCart();

      // Redirect to home page
      this.$router.push("/");
    },
  },

  created() {
    this.cartStore = useCartStore();
    this.wishlistStore = useWishlistStore();
  },

  watch: {
    wilaya() {
      this.commune = null;
      this.communesByWilaya = this.communes.filter(
        (commune) => commune?.wilaya_id === this.wilaya
      );
      const wilaya = this.wilayas.find((w) => w.id === this.wilaya);
      if (wilaya.pickup_shipping_price === null) {
        this.selectedCheckbox = ["home"];
      }
    },

    selectedCheckbox(oldVal, newVal) {
      if (this.selectedCheckbox.length === 0) {
        this.selectedCheckbox = [newVal[0]];
      }

      if (this.selectedCheckbox.length > 1) {
        this.selectedCheckbox = [oldVal[1]];
      }

      // Prevent selecting pickup if not available
      if (
        this.selectedCheckbox.includes("pickup") &&
        this.isPickupAvailable == false
      ) {
        this.selectedCheckbox = ["home"];
      }
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

<style lang="scss" scoped>
.checkout-item-remove-btn {
  position: absolute;
  inset-block-start: 5px;
  inset-inline-end: 5px;
}
</style>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";

.section-title {
  color: rgb(var(--v-theme-primary));
  font-size: 28px;
  font-weight: 800;
  line-height: 36px;
}

.border-t {
  border-block-start: 1px solid
    rgba(var(--v-border-color), var(--v-border-opacity));
}

.disable-tab-transition {
  .v-window__container {
    block-size: auto !important;
  }
}

.checkout-stepper {
  .v-stepper-item {
    flex-basis: 33.33%;
  }
}

.checkout-product-image {
  max-block-size: 140px;
  min-block-size: 120px;
  min-inline-size: 140px;
  object-fit: cover;
}

.w-fit-content {
  inline-size: fit-content !important;
}

.v-label.custom-input {
  border-radius: 0 !important;
}

.coupon-applied-card {
  border: 1px solid rgba(var(--v-theme-success), 0.3) !important;
  background: rgba(var(--v-theme-success), 0.08);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(var(--v-theme-success), 0.12);
  }
}
</style>
