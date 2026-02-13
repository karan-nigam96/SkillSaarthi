const mongoose = require('mongoose');
const Service = require('./src/models/Service');
const connectDB = require('./src/config/db');

require('dotenv').config();

const seedCleaningServices = async () => {
    try {
        await connectDB();

        const cleaningServices = [
            {
                name: "Full Home/ Move-in Cleaning",
                category: "Cleaning",
                price: "₹1499",
                originalPrice: "₹1999",
                rating: "4.8 (2.5K)",
                image: "https://images.unsplash.com/photo-1581578731117-104f2a41272c?q=80&w=2070&auto=format&fit=crop"
            },
            {
                name: "Cockroach, Ant & General Pest Control",
                category: "Cleaning",
                price: "₹899",
                originalPrice: "₹1299",
                rating: "4.7 (1.8K)",
                image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=2069&auto=format&fit=crop"
            },
            {
                name: "Disinfection Services",
                category: "Cleaning",
                price: "₹499",
                originalPrice: "₹999",
                rating: "4.9 (5K)",
                image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?q=80&w=2070&auto=format&fit=crop"
            }
        ];

        // Check availability
        for (const service of cleaningServices) {
            const exists = await Service.findOne({ name: service.name });
            if (!exists) {
                await Service.create(service);
                console.log(`Created: ${service.name}`);
            } else {
                console.log(`Skipped (Exists): ${service.name}`);
            }
        }

        console.log('Seeding completed');
        process.exit();
    } catch (error) {
        console.error('Error seeding:', error);
        process.exit(1);
    }
};

seedCleaningServices();
