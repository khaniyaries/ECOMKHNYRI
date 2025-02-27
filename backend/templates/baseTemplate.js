import emailConfig from '../utils/email.js'

export const createBaseTemplate = (content) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    ${content}
    
    <br><br>
    Best Regards,
    <br>
    Team Yarees
    
    <div style="text-align: left; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
      <img src="${emailConfig.logoUrl}" alt="Yarees" style="max-width: 120px;">
    </div>
    
    <div style="background-color: #f5f5f5; border: 1px solid #ddd; padding: 10px; margin-top: 20px; border-radius: 4px;">
      <p style="color: #666; margin: 0 0 10px 0; font-size: 12px;">
        For any queries, please contact ${emailConfig.supportEmail}
      </p>
      <a href="mailto:${emailConfig.supportEmail}" 
         style="display: inline-block; 
                padding: 8px 16px; 
                background-color: #0066cc; 
                color: white; 
                text-decoration: none; 
                border-radius: 4px; 
                font-size: 12px;">
        Contact Support
      </a>
    </div>
  </div>
`
