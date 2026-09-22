import crypto from "crypto";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}

export function getPayHereConfig() {
  const merchantId = getRequiredEnv("PAYHERE_MERCHANT_ID");
  const merchantSecret = getRequiredEnv("PAYHERE_MERCHANT_SECRET");

  const sandbox = process.env.PAYHERE_SANDBOX === "true";

  const appUrl = getRequiredEnv("NEXT_PUBLIC_APP_URL").replace(
    /\/$/,
    ""
  );

  return {
    merchantId,
    merchantSecret,
    sandbox,

    checkoutUrl: sandbox
      ? "https://sandbox.payhere.lk/pay/checkout"
      : "https://www.payhere.lk/pay/checkout",

    appUrl,
  };
}

export function formatPayHereAmount(amount: number): string {
  return Number(amount).toFixed(2);
}

export function generatePayHereHash(
  merchantId: string,
  orderId: string,
  amount: number,
  currency: string,
  merchantSecret: string
): string {
  const formattedAmount = formatPayHereAmount(amount);

  const hashedSecret = crypto
    .createHash("md5")
    .update(merchantSecret)
    .digest("hex")
    .toUpperCase();

  return crypto
    .createHash("md5")
    .update(
      merchantId +
        orderId +
        formattedAmount +
        currency +
        hashedSecret
    )
    .digest("hex")
    .toUpperCase();
}

export function generatePayHereNotificationHash(
  merchantId: string,
  orderId: string,
  amount: string,
  currency: string,
  statusCode: string,
  merchantSecret: string
): string {
  const hashedSecret = crypto
    .createHash("md5")
    .update(merchantSecret)
    .digest("hex")
    .toUpperCase();

  return crypto
    .createHash("md5")
    .update(
      merchantId +
        orderId +
        amount +
        currency +
        statusCode +
        hashedSecret
    )
    .digest("hex")
    .toUpperCase();
}