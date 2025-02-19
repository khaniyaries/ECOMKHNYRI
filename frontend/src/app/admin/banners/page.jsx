"use client"
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useState } from 'react';

export default function Banners() {
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated } = useAdminAuth()

    if (!isAuthenticated) {
        return null
    }

    return(
        <div>
            {isLoading && <LoadingSpinner />}
        </div>
    )
}
