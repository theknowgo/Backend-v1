import Cashfree from "cashfree-pg";

Cashfree.init({
  clientId: process.env.CASHFREE_APP_ID,
  clientSecret: process.env.CASHFREE_SECRET_KEY,
});

export default Cashfree;
