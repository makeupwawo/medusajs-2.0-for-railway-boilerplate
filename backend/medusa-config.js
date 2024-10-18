import { loadEnv, Modules, defineConfig } from '@medusajs/utils';

const isDev = process.env.NODE_ENV === 'development';

loadEnv(process.env.NODE_ENV, process.cwd());

const backendUrl = process.env.RAILWAY_PUBLIC_DOMAIN_VALUE || 'http://localhost:9000';

const plugins = [
  // 'medusa-fulfillment-manual'
];

const modules = {
  [Modules.AUTH]: {
    resolve: '@medusajs/auth',
    options: {
      providers: [
        {
          resolve: '@medusajs/auth-emailpass',
          id: 'emailpass',
          options: {}
        }
      ]
    }
  },
  [Modules.FILE]: {
    resolve: '@medusajs/file',
    options: {
      providers: [
        {
          resolve: '@medusajs/file-local-next',
          id: 'local',
          options: {
            upload_dir: 'static',
            backend_url: `${backendUrl}/static`
          }
        }
      ]
    }
  },
};

// Redis configuration
if (process.env.REDIS_URL) {
  console.log('Redis url found, enabling event bus with redis');
  modules[Modules.EVENT_BUS] = {
    resolve: '@medusajs/event-bus-redis',
    options: { 
      redisUrl: process.env.REDIS_URL
    }
  };
}

// Stripe payment provider
const stripeApiKey = process.env.STRIPE_API_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripeConfigured = stripeApiKey && stripeWebhookSecret;
if (stripeConfigured) {
  console.log('Stripe api key and webhook secret found, enabling stripe payment provider');
  modules[Modules.PAYMENT] = {
    resolve: '@medusajs/payment',
    options: {
      providers: [
        {
          resolve: '@medusajs/payment-stripe',
          id: 'stripe',
          options: {
            apiKey: stripeApiKey,
            webhookSecret: stripeWebhookSecret
          }
        }
      ]
    }
  };
}

// SendGrid notification provider
const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM_EMAIL;
const resendConfigured = resendApiKey && resendFrom;
if (resendConfigured) {
  console.log('SendGrid api key and from address found, enabling Resend notification provider');
  modules[Modules.NOTIFICATION] = {
    resolve: `medusa-plugin-resend-custom`,
       options: {
          api_key: process.env.RESEND_API_ID,
          from: process.env.SES_FROM,
          enable_endpoint: process.env.SES_ENABLE_ENDPOINT,
          template_path: process.env.SES_TEMPLATE_PATH,
          subject_template_type: process.env.RESEND_SUBJECT_TEMPLATE_TYPE,
          body_template_type: process.env.RESEND_BODY_TEMPLATE_TYPE,
          order_placed_template: 'order_placed',
          order_shipped_template: 'order_shipped',
          customer_password_reset_template: 'customer_password_reset',
          gift_card_created_template: 'gift_card_created',
          //If your event is 'customer.created', the '.' will be replaced with '_', 
          //and the template definition will be， customer_created_template:<your templdate dir>
          //order_canceled_template: 'order_canceled',
          //order_refund_created_template: 'order_refund_created',
          //order_return_requested_template: 'order_return_requested',
          //order_items_returned_template: 'order_items_returned',
          //swap_created_template: 'swap_created',
          //swap_shipment_created_template: 'swap_shipment_created',
          //swap_received_template: 'swap_received',
          //claim_shipment_created_template: 'claim_shipment_created',
          //user_password_reset_template: 'user_password_reset',
          //medusa_restock_template: 'medusa_restock',
       }
    },
}

/** @type {import('@medusajs/medusa').ConfigModule['projectConfig']} */
const projectConfig = {
  http: {
    adminCors: process.env.ADMIN_CORS,
    authCors: process.env.AUTH_CORS,
    storeCors: process.env.STORE_CORS,
    jwtSecret: process.env.JWT_SECRET,
    cookieSecret: process.env.COOKIE_SECRET
  },
  database_url: process.env.DATABASE_URL,
  database_type: 'postgres',
  ...(process.env.REDIS_URL && { redisUrl: process.env.REDIS_URL })
};

const completeConfig = {
  projectConfig,
  plugins,
  modules,
  admin: {
    ...!isDev && { backendUrl }
  }
};

export default defineConfig(completeConfig);
export { backendUrl };
