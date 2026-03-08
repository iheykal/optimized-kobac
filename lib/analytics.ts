/**
 * Simple analytics helper to track user interactions
 */
export async function trackEvent(
    event: 'page_view' | 'property_click' | 'whatsapp_lead' | 'search' | 'gallery_view',
    data: {
        propertyId?: string;
        district?: string;
        price?: number | string;
        metadata?: Record<string, any>;
    } = {}
) {
    try {
        // Prepare data - ensure price is numeric if provided
        const payload = {
            event,
            ...data,
            price: data.price ? Number(String(data.price).replace(/[^0-9.]/g, '')) : undefined,
        }

        // We use fetch with keepalive so the request finishes even if the page changes (like clicking WhatsApp)
        await fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true,
        })
    } catch (err) {
        // Silent fail for analytics so it doesn't break user experience
        console.warn('Analytics tracking failed:', err)
    }
}
