import { createBaseTemplate } from './baseTemplate.js'

export const createOrderStatusEmail = (customerName, orderId, status) => {
  const statusMessages = {
    processing: 'We\'re preparing your order for shipment',
    shipped: 'Your order is on its way! Track your shipment using the link below.',
    delivered: 'Your order has been delivered. We hope you enjoy your purchase!',
    cancelled: 'Your order has been cancelled. Refund will be processed if applicable.'
  }

  const content = `
    <h2>Order Status Update</h2>
    <p>Dear ${customerName},</p>
    
    <p>Your order #${orderId} has been updated to: <strong>${status.toUpperCase()}</strong></p>
    <p>${statusMessages[status] || 'Your order status has been updated'}</p>
    
    <a href="https://yarees.in/orders/${orderId}" 
       style="display: inline-block; 
              padding: 10px 20px; 
              background-color: #0066cc; 
              color: white; 
              text-decoration: none; 
              border-radius: 4px; 
              margin-top: 15px;">
      View Order Details
    </a>
  `

  return createBaseTemplate(content)
}
