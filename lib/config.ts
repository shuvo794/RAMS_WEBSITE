const isProduction = process.env.NODE_ENV === "production";

// export const BASE_URL = isProduction
//   ? "https://api.ramsint.com"
//   : "http://192.168.68.129:8010";
export const BASE_URL = isProduction
  ? "https://api.ramsint.com/"
  : "https://api.ramsint.com";

// export const ADMIN_URL = isProduction
//   ? "https://api.ramsint.com"
//   : "http://192.168.68.129:8010";
export const ADMIN_URL = isProduction
  ? "https://api.ramsint.com"
  : "https://api.ramsint.com";

export const GET_BANNER = `${BASE_URL}/banner/api/v1/banner/all/`;

export const GET_TESTIMONIALS = `${BASE_URL}/testimonial/api/v1/testimonial/all/`;

export const GET_GALLERIES = `${BASE_URL}/gallery/api/v1/gallery/all/`;
export const GET_CLIENTS = `${BASE_URL}/client/api/v1/client/all/`;
export const GET_CLIENTS_ALL = `${BASE_URL}/client/api/v1/client/without_pagination/all/`;

export const GET_CLIENTS_DETAILS = `${BASE_URL}/client/api/v1/client/without_pagination/all/`;
export const GET_ABOUTS = `${BASE_URL}/about/api/v1/about/all/`;
export const GET_SITESETTINGS = `${BASE_URL}/general_setting/api/v1/general_setting/all/`;
export const GET_MODULES = `${BASE_URL}/module/api/v1/module/all/`;
export const GET_SOLUTIONS = `${BASE_URL}/solution/api/v1/solution/all/`;
export const CRETE_CONTUCTUS = `${BASE_URL}/contact/api/v1/contact/create/`;
export const GET_BLOGS = `${BASE_URL}/blog/api/v1/blog/all/`;
export const GET_BLOG = `${BASE_URL}/blog/api/v1/blog/`;
export const GET_PATNERS = `${BASE_URL}/partner/api/v1/partner/all/`;
export const LOGIN = `${BASE_URL}/user/api/v1/client/login/`;
export const USER_ME = `${BASE_URL}/client/api/v1/client/`;
export const USER_UPADTE = `${BASE_URL}/client/api/v1/client/update/`;
export const CLIENT_UPDATE = `${BASE_URL}/client/api/v1/client/`;
export const SIGNUP = `${BASE_URL}/client/api/v1/client/create/`;
export const PLANSALL = `${BASE_URL}/package_type/api/v1/package_type/all/`;
export const PACKAGE_ID = `${BASE_URL}/package_type/api/v1/package_type/`;
export const fetureSingelGet = `${BASE_URL}/package_type/api/v1/feature_customization/`;
export const GET_TICKET_DEPARTMENT = `${ADMIN_URL}/ticket_department/api/v1/ticket_department/all/`;
export const GET_TICKET_PRIORITY = `${ADMIN_URL}/ticket_priority/api/v1/ticket_priority/all/`;
export const CREATE_TICKET = `${ADMIN_URL}/ticket/api/v1/ticket/create/`;
export const GET_TICKETS_FOR_CLIENTS = `${ADMIN_URL}/ticket/api/v1/ticket_for_client/all/`;
export const CHECK_PRIMARY_PHONE = `${BASE_URL}/user/api/v1/user/check_primary_phone_when_create/`;
export const CHECK_EMAIL = `${BASE_URL}/user/api/v1/user/check_email_when_create/`;
export const SEND_EMAIL = `${BASE_URL}/client/api/v1/client/send_verification_code/`;
export const SEND_EMAIL_VERIFY = `${BASE_URL}/client/api/v1/client/verify/`;
export const TICKET_CHECK_IDS = `${BASE_URL}/ticket/api/v1/ticket/get_all_by_user_id/`;
export const TICKET_CHECK_ID = `${BASE_URL}/ticket_detail/api/v1/ticket_detail/get_all_by_ticket_id/`;
export const TICKET_POST = `${BASE_URL}/ticket_detail/api/v1/ticket_detail/create_from_client/`;
export const STATUS_INVOICE = `${BASE_URL}/invoice/api/v1/invoice/by_user/all/`;
export const STATUS_INVOICE_ID = `${BASE_URL}/invoice/api/v1/invoice/`;
export const INVOICE_UNPAID = `${BASE_URL}/client/api/v1/client/dashboard/`;
export const PACKAGE = `${BASE_URL}/subscription/api/v1/subscription/all/`;
export const PACKAGE_ADD_TO = `${BASE_URL}/subscription/api/v1/cart/add/`;
export const PACKAGE_ADD_CARD = `${BASE_URL}/subscription/api/v1/cart/`;
export const PACKAGE_ADD_CARD_UPDATE = `${BASE_URL}/subscription/api/v1/cart/update/`;
export const PACKAGE_ADD_CARD_PRICE = `${BASE_URL}/package_type/api/v1/package_type/calculate_price/`;
export const PACKAGE_ADD_CARD_DELATED = `${BASE_URL}/subscription/api/v1/cart/clear/`;
export const GET_COUNTRIES_WITHOUT_PAGINATION = `${BASE_URL}/country/api/v1/country/without_pagination/all/`;
export const PAYEMENT_INTREGATE = `${BASE_URL}/subscription/api/v1/payment/initiate/`;
