const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('./src/models/Service');
const Project = require('./src/models/Project');

dotenv.config();

const services = [
    // Most Booked
    {
        name: "Intense cleaning (2 bathrooms)",
        category: "Most Booked",
        rating: "4.80 (4.1M)",
        price: "₹913",
        originalPrice: "₹998",
        image: "https://loremflickr.com/300/300/bathroom,clean/all",
        isPopular: true
    },
    {
        name: "Fan Repair",
        category: "Most Booked",
        rating: "4.85 (210K)",
        price: "₹149",
        image: "https://loremflickr.com/300/300/fan,repair/all",
        isPopular: true
    },
    {
        name: "Kitchen Cleaning",
        category: "Most Booked",
        rating: "4.70 (120K)",
        price: "₹899",
        image: "https://loremflickr.com/300/300/kitchen,clean/all",
        isPopular: true
    },
    {
        name: "Tap Repair",
        category: "Most Booked",
        rating: "4.81 (1.2M)",
        price: "₹249",
        image: "https://loremflickr.com/300/300/plumber,tap/all",
        isPopular: true
    },
    {
        name: "Sofa Cleaning",
        category: "Most Booked",
        rating: "4.88 (73K)",
        price: "₹899",
        image: "https://loremflickr.com/300/300/sofa,clean/all",
        isPopular: true
    },
    {
        name: "Full Home Cleaning",
        category: "Most Booked",
        rating: "4.90 (55K)",
        price: "₹1499",
        image: "/images/full-home-cleaning.png",
        isPopular: true
    },
    // Repair Services
    {
        name: "Plumber consultation",
        category: "Repair",
        rating: "4.73 (97K)",
        price: "₹49",
        image: "/services/plumber.png"
    },
    {
        name: "Flush tank repair",
        category: "Repair",
        rating: "4.77 (103K)",
        price: "₹99",
        image: "/services/flush_tank.png"
    },
    {
        name: "Decor installation",
        category: "Repair",
        rating: "4.83 (87K)",
        price: "₹79",
        image: "/services/decor.png"
    },
    {
        name: "Electrician consultation",
        category: "Repair",
        rating: "4.74 (80K)",
        price: "₹49",
        image: "/services/electrician.png"
    },
    {
        name: "Door lock repair & installation",
        category: "Repair",
        rating: "4.79 (89K)",
        price: "₹129",
        image: "/services/door_lock.png"
    },
    {
        name: "Switchboard repair",
        category: "Repair",
        rating: "4.80 (65K)",
        price: "₹89",
        image: "/services/switchboard.png"
    },
    {
        name: "Tubelight repair & installation",
        category: "Repair",
        rating: "4.76 (45K)",
        price: "₹119",
        image: "/services/tubelight.png"
    },
    {
        name: "Cupboard repair",
        category: "Repair",
        rating: "4.75 (32K)",
        price: "₹199",
        image: "/services/cupboard.png"
    },
    {
        name: "Door repair",
        category: "Repair",
        rating: "4.72 (56K)",
        price: "₹149",
        image: "/services/door_repair.png"
    },
    {
        name: "Bulb installation",
        category: "Repair",
        rating: "4.85 (20K)",
        price: "₹49",
        image: "/services/bulb.png"
    },
    // Construction Services (Construction & Site Services)
    {
        name: "Labour",
        category: "Construction",
        rating: "4.5 (1k)",
        image: "https://loremflickr.com/300/300/construction,labourer/all",
        description: "Reliable and hardworking general labourers for all construction and site-related tasks."
    },
    {
        name: "Mason",
        category: "Construction",
        rating: "4.6 (2k)",
        image: "https://loremflickr.com/300/300/mason,bricklayer/all",
        description: "Skilled masons specialize in bricklaying, plastering, & structural work for durable construction."
    },
    {
        name: "Painter",
        category: "Construction",
        rating: "4.7 (3k)",
        image: "/services/decor.png",
        description: "Professional painters ensuring high-quality wall finishes, interior, and exterior painting services."
    },
    {
        name: "Plumber",
        category: "Construction",
        rating: "4.8 (4k)",
        image: "/services/plumber.png",
        description: "Expert plumbers for seamless water supply, drainage, and plumbing system installations and repairs."
    },
    {
        name: "Carpenter",
        category: "Construction",
        rating: "4.9 (5k)",
        image: "/services/cupboard.png",
        description: "Experienced carpenters deliver customized woodwork solutions for furniture, doors, and interiors."
    },
    {
        name: "Electrician",
        category: "Construction",
        rating: "4.5 (1k)",
        image: "/services/electrician.png",
        description: "Qualified electricians for safe electrical installations, maintenance, and fault repair services."
    },
    {
        name: "Foreman",
        category: "Construction",
        rating: "4.8 (2k)",
        image: "https://loremflickr.com/300/300/foreman,construction/all",
        description: "Efficient foremen to oversee construction sites and ensure timely project completion."
    },
    {
        name: "Supervisor",
        category: "Construction",
        rating: "4.9 (3k)",
        image: "https://loremflickr.com/300/300/supervisor,site/all",
        description: "Responsible supervisors to monitor workers, manage tasks, and maintain workplace safety."
    },
    {
        name: "Engineer",
        category: "Construction",
        rating: "5.0 (500)",
        image: "https://loremflickr.com/300/300/civil,engineer/all",
        description: "Expert engineers providing technical solutions for design, planning, and execution of projects."
    },
    {
        name: "Welder",
        category: "Construction",
        rating: "4.7 (1.5k)",
        image: "https://loremflickr.com/300/300/welder,metal/all",
        description: "Welders play a crucial role in fabricating and maintaining steel structures."
    },
    {
        name: "ITI/Technician",
        category: "Construction",
        rating: "4.6 (1.2k)",
        image: "https://loremflickr.com/300/300/technician,repair/all",
        description: "Certified ITI technicians offer specialized skills for machinery maintenance and technical support."
    }
];

const projects = [
    {
        company: "Maharaja Dehydration pvt ltd",
        location: "Mahuva, Gujarat",
        role: "Factory worker",
        rate: "₹17,500 per month",
        workers: 50,
        projectType: "Food manufacturing product",
        workType: "Labour Supply",
        tags: ["Urgent hiring", "Food industry"]
    },
    {
        company: "L&T Construction",
        location: "Dahej, Gujarat",
        role: "Civil Labour Contractor",
        rate: "₹33,000 per Month",
        workers: 2000,
        projectType: "Industrial building",
        workType: "Labour Supply",
        tags: ["Urgent hiring"]
    },
    {
        company: "L&T Construction",
        location: "Dahej, Gujarat",
        role: "Civil Contractor",
        rate: "On Discussion",
        workers: 3000,
        projectType: "Industrial building",
        workType: "Measurement Basis",
        tags: ["Urgent hiring"]
    },
    {
        company: "Ramoji Film City",
        location: "Hyderabad, Telangana",
        role: "Painter",
        rate: "₹32,000 per month",
        workers: 50,
        projectType: "Commercial Building",
        workType: "Labour Supply",
        tags: ["Urgent hiring"]
    },
    {
        company: "DMart",
        location: "Sonipat, Haryana",
        role: "Loading & Unloading Labour",
        rate: "₹19,500 per month",
        workers: 500,
        projectType: "Warehouse",
        workType: "Labour Supply",
        tags: []
    },
    // Godrej / Tricon Projects
    {
        company: "Godrej",
        subtitle: "Tricon",
        location: "Chinchwad, Maharashtra",
        role: "Concrete",
        rate: "₹ 150 Cum",
        workers: 30,
        projectType: "Residential",
        workType: "Measurement Basis",
        tags: []
    },
    {
        company: "Godrej",
        subtitle: "Tricon",
        location: "Chinchwad, Maharashtra",
        role: "Column/ SW/ Slab",
        rate: "₹ 250 Cum",
        workers: 30,
        projectType: "Residential",
        workType: "Measurement Basis",
        tags: []
    },
    {
        company: "Godrej",
        subtitle: "Tricon",
        location: "Chinchwad, Maharashtra",
        role: "Mivan BUA - R.Steel",
        rate: "₹ 48 /Sq.Ft",
        workers: 30,
        projectType: "Residential",
        workType: "Measurement Basis",
        tags: []
    },
    {
        company: "Godrej",
        subtitle: "Tricon",
        location: "Chinchwad, Maharashtra",
        role: "Mivan BUA -Shuu",
        rate: "₹ 85 /Sq.Ft",
        workers: 30,
        projectType: "Residential",
        workType: "Measurement Basis",
        tags: []
    },
    {
        company: "Godrej",
        subtitle: "Tricon",
        location: "Chinchwad, Maharashtra",
        role: "Shuttering",
        rate: "₹ 300 Sqm",
        workers: 30,
        projectType: "Residential",
        workType: "Measurement Basis",
        tags: []
    },
    {
        company: "Godrej",
        subtitle: "Tricon",
        location: "Chinchwad, Maharashtra",
        role: "Shear Wall /Column",
        rate: "₹ 320 Sqm",
        workers: 30,
        projectType: "Residential",
        workType: "Measurement Basis",
        tags: []
    },
    {
        company: "Godrej",
        subtitle: "Tricon",
        location: "Chinchwad, Maharashtra",
        role: "Slab/Beam",
        rate: "₹ 340 Sqm",
        workers: 30,
        projectType: "Residential",
        workType: "Measurement Basis",
        tags: []
    },
    {
        company: "Godrej",
        subtitle: "Tricon",
        location: "Chinchwad, Maharashtra",
        role: "R.Steel (Sub-Structure)",
        rate: "₹ 7500/MT",
        workers: 30,
        projectType: "Residential",
        workType: "Measurement Basis",
        tags: []
    }
];

const SiteContent = require('./src/models/SiteContent');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Seed Services
        await Service.deleteMany();
        await Service.insertMany(services);
        console.log('Services Seeded');

        // Seed Projects
        await Project.deleteMany();
        await Project.insertMany(projects);
        console.log('Projects Seeded');

        // Seed Site Content
        const siteContent = [
            {
                sectionId: 'construction_change_game',
                imageUrl: '/features/change_the_game.png'
            },
            {
                sectionId: 'construction_solution',
                imageUrl: '/features/our_solution.png'
            },
            {
                sectionId: 'construction_make_better',
                imageUrl: '/features/time_to_make_better.png'
            }
        ];

        await SiteContent.deleteMany();
        await SiteContent.insertMany(siteContent);
        console.log('Site Content Seeded');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
