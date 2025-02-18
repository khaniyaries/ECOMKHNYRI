export const fetchProducts = async (queryString = '') => {
    const response = await fetch(`http://localhost:8080/api/v1/products?${queryString}`);
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
  
    return response.json();
  };
  
  
  export const deleteProduct = async (productId) => {
    const response = await fetch(`http://localhost:8080/api/v1/products/${productId}`, {
      method: 'DELETE',
    });
    return response.json();
  };
  
  export const uploadImages = async (files, primaryImageIndex) => {
    // Return empty array if no files
    if (!files || files.length === 0) {
      return [];
    }
  
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('images', file);
    });
    formData.append('primaryImageIndex', primaryImageIndex);
  
    const response = await fetch('http://localhost:8080/api/v1/upload', {
      method: 'POST',
      body: formData
    });
  
    return response.json();
  };
  
  
  export const createProduct = async (productData) => {
    const response = await fetch('http://localhost:8080/api/v1/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    });
  
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create product');
    }
  
    return data;
  };

  export const updateProduct = async (productId, productData) => {
    const response = await fetch(`http://localhost:8080/api/v1/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...productData,
            _id: productId
        })
    });

    return response.json();
};


