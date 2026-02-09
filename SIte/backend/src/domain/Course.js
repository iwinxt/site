class Course {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.thumbnailUrl = data.thumbnail_url;
        this.priceOnce = data.price_once;
        this.priceMonthly = data.price_monthly;
        this.priceYearly = data.price_yearly;
        this.isActive = data.is_active ?? true;
    }

    hasPaymentOption(type) {
        const prices = {
            'once': this.priceOnce,
            'monthly': this.priceMonthly,
            'yearly': this.priceYearly
        };
        
        return prices[type] && prices[type] > 0;
    }

    getPrice(type) {
        const prices = {
            'once': this.priceOnce,
            'monthly': this.priceMonthly,
            'yearly': this.priceYearly
        };
        
        return prices[type] || null;
    }
}

module.exports = { Course };