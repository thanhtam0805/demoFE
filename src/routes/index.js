import AdminPage from "../pages/AdminPage/AdminPage";
import FavoritePage from "../pages/FavoritePage/FavoritePage";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import HomePage from "../pages/HomePage/HomePage";
import MyOrder from "../pages/MyOrder/MyOrder";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderDetailPage from "../pages/OrderDetailPage/OrderDetailPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import ProductPage from "../pages/ProductPage/ProductPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";

export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },

  {
    path: "/order",
    page: OrderPage,
    isShowHeader: true,
  },

  {
    path: "/my-order",
    page: MyOrder,
    isShowHeader: true,
  },

  {
    path: "/details-order/:id",
    page: OrderDetailPage,
    isShowHeader: true,
  },

  {
    path: "/payment",
    page: PaymentPage,
    isShowHeader: true,
  },

  {
    path: "/orderSuccess",
    page: OrderSuccess,
    isShowHeader: true,
  },

  {
    path: "/product",
    page: ProductPage,
    isShowHeader: true,
  },

  {
    path: "/product/:type",
    page: TypeProductPage,
    isShowHeader: true,
  },

  {
    path: "/sign-in",
    page: SignInPage,
    isShowHeader: false,
  },

  {
    path: "/sign-up",
    page: SignUpPage,
    isShowHeader: false,
  },

  {
    path: "/product-detail/:id",
    page: ProductDetailPage,
    isShowHeader: true,
  },

  {
    path: "/profile-user",
    page: ProfilePage,
    isShowHeader: true,
  },

  {
    path: "/system/admin",
    page: AdminPage,
    isShowHeader: false,
    isPrivate: true,
  },
  {
    path: "/favorite",
    page: FavoritePage,
    isShowHeader: true,
  },
  {
    path: "/forgot-password",
    page: ForgotPassword,
  },

  {
    path: "*",
    page: NotFoundPage,
  },
];
