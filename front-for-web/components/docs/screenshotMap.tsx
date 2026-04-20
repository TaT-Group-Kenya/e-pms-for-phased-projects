// Central registry of all screenshots
export const screenshotRegistry = {
  // Authentication
  login: "login page.png",
  signin: "signin.png",
  
  // Dashboard
  dashboard: "dashboard.png",
  
  // Companies
  companiesList: "companieslist.png",
  createCompany: "createcompanyform.png",
  editCompany: "editcompany.png",
  
  // Customers
  customersList: "customerslist.png",
  addCustomer: "add customer.png",
  
  // Quotations
  quotationsList: "quotationslist.png",
  createQuotation: "create quotation.png",
  
  // Orders
  ordersList: "orderslist.png",
  createOrder: "createorder.png",
  
  // Projects
  projectsList: "projects-list.png",
  createProject: "create-project.png",
  
  // Finance
  financeAccounts: "financeaccounts.png",
  financeAddAccount: "financeaddaccount.png",
  financeAddPaymentMethod: "financeaddpaymentmethod.png",
  
  // Reports
  runReport: "runreport.png",
  orderSummaryReport: "reports order summary.png",
  
  // Settings
  settings: "settings.png",
  editProfile: "editprofile.png",
}

export type ScreenshotKey = keyof typeof screenshotRegistry