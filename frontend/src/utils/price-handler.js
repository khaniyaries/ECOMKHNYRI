"use client"
import { env } from "../../config/config.js"

export const getProductPrice = async (productId) => {
    // Check if product is in flash sale
    const flashSaleResponse = await fetch(`${env.API_URL}/api/v1/flashsales/active`)
    const flashSaleProducts = await flashSaleResponse.json()
    
    const flashSaleProduct = flashSaleProducts.find(p => p._id === productId)
    
    return flashSaleProduct ? flashSaleProduct.flashSalePrice : null
  }