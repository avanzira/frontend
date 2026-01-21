// file: src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "../layouts/AppLayout.vue";
import LoginView from "../views/LoginView.vue";
import SettingsView from "../views/SettingsView.vue";
import LandingView from "../views/LandingView.vue";
import EntitiesLandingView from "../views/EntitiesLandingView.vue";
import DocumentsLandingView from "../views/DocumentsLandingView.vue";
import ReportsLandingView from "../views/ReportsLandingView.vue";
import UsersView from "../views/UsersView.vue";
import ProductsView from "../views/ProductsView.vue";
import CustomersView from "../views/CustomersView.vue";
import SuppliersView from "../views/SuppliersView.vue";
import PurchaseNotesView from "../views/PurchaseNotesView.vue";
import SalesNotesView from "../views/SalesNotesView.vue";
import StockDepositsView from "../views/StockDepositsView.vue";
import CashTransfersView from "../views/CashTransfersView.vue";
import { useAuthStore } from "../store/auth.store";

const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginView,
    meta: { public: true },
  },
  {
    path: "/app",
    component: AppLayout,
    children: [
      {
        path: "",
        name: "Home",
        component: LandingView,
        meta: { requiresAuth: true },
      },
      {
        path: "entities",
        name: "Entities",
        component: EntitiesLandingView,
        meta: { requiresAuth: true },
      },
      {
        path: "profile",
        name: "Settings",
        component: SettingsView,
        meta: { requiresAuth: true },
      },
      {
        path: "entities/users",
        name: "Users",
        component: UsersView,
        meta: { requiresAuth: true },
      },
      {
        path: "entities/products",
        name: "Products",
        component: ProductsView,
        meta: { requiresAuth: true },
      },
      {
        path: "entities/customers",
        name: "Customers",
        component: CustomersView,
        meta: { requiresAuth: true },
      },
      {
        path: "entities/suppliers",
        name: "Suppliers",
        component: SuppliersView,
        meta: { requiresAuth: true },
      },
      {
        path: "documents",
        name: "Documents",
        component: DocumentsLandingView,
        meta: { requiresAuth: true },
      },
      {
        path: "documents/purchase-notes",
        name: "PurchaseNotes",
        component: PurchaseNotesView,
        meta: { requiresAuth: true },
      },
      {
        path: "documents/sales-notes",
        name: "SalesNotes",
        component: SalesNotesView,
        meta: { requiresAuth: true },
      },
      {
        path: "documents/stock-deposits",
        name: "StockDeposits",
        component: StockDepositsView,
        meta: { requiresAuth: true },
      },
      {
        path: "documents/cash-transfers",
        name: "CashTransfers",
        component: CashTransfersView,
        meta: { requiresAuth: true },
      },
      {
        path: "reports",
        name: "Reports",
        component: ReportsLandingView,
        meta: { requiresAuth: true },
      },
    ],
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  // Si la ruta requiere autenticación y no hay token, redirigir
  if (to.meta.requiresAuth && !auth.token) {
    return { name: "Login" };
  }

  // Evitar que un usuario autenticado regrese al login
  if (to.meta.public && auth.token) {
    return { name: "Home" };
  }
});

export default router;
// file: src/router/index.ts
