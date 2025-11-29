<script setup>

import LanguageSwitcher from "./language-switcher.vue";
import {ref} from "vue";
import {useI18n} from "vue-i18n";
import FooterContent from "./footer-content.vue";
import AuthenticationSection from "../../../iam/presentation/components/authentication-section.vue";
const { t } = useI18n();

const drawer = ref(false);
const toggleDrawer = () => {
  /**
   * Toggles the state of the drawer between open and closed.
   */
  drawer.value = !drawer.value;
}
const items = [
  {label: 'option.home', to: '/home'},
  {label: 'option.colleagues', to: '/colleagues'},
  {label: 'option.restaurants', to: '/restaurants'},
  {label: 'option.calculate', to: '/calculate'},
  {label: 'option.subscriptions', to: '/subscriptions'}
];
</script>

<template>
  <pv-toast/>
  <pv-confirm-dialog/>
  <div class="header">
    <pv-toolbar class="bg-primary">
      <template #start>
        <pv-button class="p-button-text" icon="pi pi-bars" @click="toggleDrawer"/>
        <h3>LocalFood</h3>
      </template>
      <template #center>

      </template>
      <template #end>
        <div class="flex-column mr-3">
          <pv-button v-for="item in items" :key="item.label" as-child v-slot="slotProps">
            <router-link :to="item.to" :class="slotProps['class']">{{ t(item.label) }}</router-link>
          </pv-button>
        </div>
        <authentication-section/>
        <language-switcher/>
      </template>
    </pv-toolbar>
    <pv-drawer v-model:visible="drawer"/>
  </div>
  <div class="main-content">
    <router-view/>
  </div>
  <div class="footer">
    <footer-content/>
  </div>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 100;
}

.main-content {
  margin-top: 60px;
  margin-bottom: 120px;
  min-height: calc(100vh - 180px);
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 50;
}
</style>
