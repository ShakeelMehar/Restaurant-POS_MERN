import butterChicken from "../assets/images/butter-chicken-4.jpg";
import palakPaneer from "../assets/images/Saag-Paneer-1.jpg";
import biryani from "../assets/images/hyderabadibiryani.jpg";
import masalaDosa from "../assets/images/masala-dosa.jpg";
import choleBhature from "../assets/images/chole-bhature.jpg";
import rajmaChawal from "../assets/images/rajma-chawal-1.jpg";
import paneerTikka from "../assets/images/paneer-tika.webp";
import gulabJamun from "../assets/images/gulab-jamun.webp";
import pooriSabji from "../assets/images/poori-sabji.webp";
import roganJosh from "../assets/images/rogan-josh.jpg";
import { color } from "framer-motion";

export const popularDishes = [
    {
        id: 1,
        image: butterChicken,
        name: "Chicken Karahi",
        numberOfOrders: 250,
    },
    {
        id: 2,
        image: palakPaneer,
        name: "Palak Gosht",
        numberOfOrders: 190,
    },
    {
        id: 3,
        image: biryani,
        name: "Sindhi Biryani",
        numberOfOrders: 300,
    },
    {
        id: 4,
        image: masalaDosa,
        name: "Nihari",
        numberOfOrders: 220,
    },
    {
        id: 5,
        image: choleBhature,
        name: "Halwa Puri",
        numberOfOrders: 270,
    },
    {
        id: 6,
        image: rajmaChawal,
        name: "Daal Chawal",
        numberOfOrders: 180,
    },
    {
        id: 7,
        image: paneerTikka,
        name: "Chicken Tikka",
        numberOfOrders: 210,
    },
    {
        id: 8,
        image: gulabJamun,
        name: "Gulab Jamun",
        numberOfOrders: 310,
    },
    {
        id: 9,
        image: pooriSabji,
        name: "Samosa Chaat",
        numberOfOrders: 140,
    },
    {
        id: 10,
        image: roganJosh,
        name: "Mutton Korma",
        numberOfOrders: 160,
    },
];

export const tables = [
    { id: 1, name: "Table 1", status: "Booked", initial: "AM", seats: 4 },
    { id: 2, name: "Table 2", status: "Available", initial: "MB", seats: 6 },
    { id: 3, name: "Table 3", status: "Booked", initial: "JS", seats: 2 },
    { id: 4, name: "Table 4", status: "Available", initial: "HR", seats: 4 },
    { id: 5, name: "Table 5", status: "Booked", initial: "PL", seats: 3 },
    { id: 6, name: "Table 6", status: "Available", initial: "RT", seats: 4 },
    { id: 7, name: "Table 7", status: "Booked", initial: "LC", seats: 5 },
    { id: 8, name: "Table 8", status: "Available", initial: "DP", seats: 5 },
    { id: 9, name: "Table 9", status: "Booked", initial: "NK", seats: 6 },
    { id: 10, name: "Table 10", status: "Available", initial: "SB", seats: 6 },
    { id: 11, name: "Table 11", status: "Booked", initial: "GT", seats: 4 },
    { id: 12, name: "Table 12", status: "Available", initial: "JS", seats: 6 },
    { id: 13, name: "Table 13", status: "Booked", initial: "EK", seats: 2 },
    { id: 14, name: "Table 14", status: "Available", initial: "QN", seats: 6 },
    { id: 15, name: "Table 15", status: "Booked", initial: "TW", seats: 3 },
];

export const biryaniItems = [
    {
        id: 1,
        name: "Chicken Biryani",
        price: 300,
        description: "Fragrant basmati rice layered with spiced marinated chicken.",
        category: "Biryani",
        optionGroups: [
            {
                id: "portion",
                name: "Portion Size",
                required: true,
                options: [
                    { id: "student", name: "Student", extraPrice: 0 },
                    { id: "half", name: "Half", extraPrice: 100 },
                    { id: "full", name: "Full", extraPrice: 300 },
                    { id: "double", name: "Double Chicken", extraPrice: 500 }
                ]
            },
            {
                id: "type",
                name: "Type",
                required: true,
                options: [
                    { id: "chicken", name: "Chicken", extraPrice: 0 },
                    { id: "sada", name: "Sada (Plain)", extraPrice: -50 }
                ]
            }
        ]
    },
    {
        id: 2,
        name: "Beef Biryani",
        price: 350,
        description: "Aromatic basmati rice cooked with tender, spicy beef.",
        category: "Biryani",
        optionGroups: [
            {
                id: "portion",
                name: "Portion Size",
                required: true,
                options: [
                    { id: "student", name: "Student", extraPrice: 0 },
                    { id: "half", name: "Half", extraPrice: 100 },
                    { id: "full", name: "Full", extraPrice: 350 },
                    { id: "double", name: "Double Beef", extraPrice: 550 }
                ]
            },
            {
                id: "type",
                name: "Type",
                required: true,
                options: [
                    { id: "beef", name: "Beef", extraPrice: 0 },
                    { id: "sada", name: "Sada (Plain)", extraPrice: -50 }
                ]
            }
        ]
    }
];

export const pulaoItems = [
    {
        id: 1,
        name: "Chicken Pulao",
        price: 250,
        description: "Mildly spiced rice cooked in rich chicken broth.",
        category: "Pulao",
        optionGroups: [
            {
                id: "portion",
                name: "Portion Size",
                required: true,
                options: [
                    { id: "student", name: "Student", extraPrice: 0 },
                    { id: "half", name: "Half", extraPrice: 100 },
                    { id: "full", name: "Full", extraPrice: 300 },
                    { id: "double", name: "Double Chicken", extraPrice: 500 }
                ]
            },
            {
                id: "type",
                name: "Type",
                required: true,
                options: [
                    { id: "chicken", name: "Chicken", extraPrice: 0 },
                    { id: "sada", name: "Sada (Plain)", extraPrice: -50 }
                ]
            }
        ]
    },
    {
        id: 2,
        name: "Beef Pulao",
        price: 300,
        description: "Traditional rice dish cooked in savory beef stock.",
        category: "Pulao",
        optionGroups: [
            {
                id: "portion",
                name: "Portion Size",
                required: true,
                options: [
                    { id: "student", name: "Student", extraPrice: 0 },
                    { id: "half", name: "Half", extraPrice: 100 },
                    { id: "full", name: "Full", extraPrice: 350 },
                    { id: "double", name: "Double Beef", extraPrice: 550 }
                ]
            },
            {
                id: "type",
                name: "Type",
                required: true,
                options: [
                    { id: "beef", name: "Beef", extraPrice: 0 },
                    { id: "sada", name: "Sada (Plain)", extraPrice: -50 }
                ]
            }
        ]
    }
];

export const drinksItems = [
    { id: 1, name: "Pepsi", price: 100, category: "Cold", optionGroups: [{ id: "size", name: "Size", required: true, options: [{ id: "reg", name: "Regular", extraPrice: 0 }, { id: "large", name: "1.5L", extraPrice: 150 }] }] },
    { id: 2, name: "Coke", price: 100, category: "Cold", optionGroups: [{ id: "size", name: "Size", required: true, options: [{ id: "reg", name: "Regular", extraPrice: 0 }, { id: "large", name: "1.5L", extraPrice: 150 }] }] },
    { id: 3, name: "Sprite", price: 100, category: "Cold", optionGroups: [{ id: "size", name: "Size", required: true, options: [{ id: "reg", name: "Regular", extraPrice: 0 }, { id: "large", name: "1.5L", extraPrice: 150 }] }] },
    { id: 4, name: "Next Cola", price: 80, category: "Cold", optionGroups: [{ id: "size", name: "Size", required: true, options: [{ id: "reg", name: "Regular", extraPrice: 0 }] }] },
    { id: 5, name: "Gourmet Cola", price: 80, category: "Cold", optionGroups: [{ id: "size", name: "Size", required: true, options: [{ id: "reg", name: "Regular", extraPrice: 0 }] }] },
    { id: 6, name: "Malta", price: 80, category: "Cold", optionGroups: [{ id: "size", name: "Size", required: true, options: [{ id: "reg", name: "Regular", extraPrice: 0 }] }] },
];

export const extrasItems = [
    {
        id: 1,
        name: "Plain Rice",
        price: 100,
        description: "Freshly steamed plain white rice.",
        category: "Extras",
        optionGroups: [
            {
                id: "portion",
                name: "Portion Size",
                required: true,
                options: [
                    { id: "100", name: "100 PKR", extraPrice: 0 },
                    { id: "half", name: "Half", extraPrice: 50 },
                    { id: "200", name: "200 PKR", extraPrice: 100 },
                    { id: "full", name: "Full", extraPrice: 200 },
                    { id: "300", name: "300 PKR", extraPrice: 200 }
                ]
            }
        ]
    },
    {
        id: 2,
        name: "Raita",
        price: 50,
        category: "Extras",
        optionGroups: [
            { id: "size", name: "Size", required: true, options: [{ id: "reg", name: "Regular", extraPrice: 0 }, { id: "large", name: "Large", extraPrice: 50 }] }
        ]
    },
    {
        id: 3,
        name: "Salad",
        price: 50,
        category: "Extras",
        optionGroups: [
            { id: "size", name: "Size", required: true, options: [{ id: "reg", name: "Regular", extraPrice: 0 }, { id: "large", name: "Large", extraPrice: 50 }] }
        ]
    }
];

export const menus = [
    { id: 1, name: "Biryani", bgColor: "#b73e3e", icon: "🍛", items: biryaniItems },
    { id: 2, name: "Pulao", bgColor: "#5b45b0", icon: "🥘", items: pulaoItems },
    { id: 3, name: "Drinks", bgColor: "#7f167f", icon: "🍹", items: drinksItems },
    { id: 4, name: "Extras", bgColor: "#735f32", icon: "🥗", items: extrasItems },
];

export const metricsData = [
    {
        title: "Revenue",
        value: "PKR 50,846.90",
        percentage: "12%",
        color: "#025cca",
        isIncrease: false,
    },
    {
        title: "Outbound Clicks",
        value: "10,342",
        percentage: "16%",
        color: "#02ca3a",
        isIncrease: true,
    },
    {
        title: "Total Customer",
        value: "19,720",
        percentage: "10%",
        color: "#f6b100",
        isIncrease: true,
    },
    {
        title: "Event Count",
        value: "20,000",
        percentage: "10%",
        color: "#be3e3f",
        isIncrease: false,
    },
];

export const itemsData = [
    {
        title: "Total Categories",
        value: "8",
        percentage: "12%",
        color: "#5b45b0",
        isIncrease: false,
    },
    {
        title: "Total Dishes",
        value: "50",
        percentage: "12%",
        color: "#285430",
        isIncrease: true,
    },
    {
        title: "Active Orders",
        value: "12",
        percentage: "12%",
        color: "#735f32",
        isIncrease: true,
    },
    { title: "Total Tables", value: "10", color: "#7f167f" },
];

export const orders = [
    {
        id: "101",
        customer: "Ali Raza",
        status: "Ready",
        dateTime: "January 18, 2025 08:32 PM",
        items: 8,
        tableNo: 3,
        total: 2500.0,
    },
    {
        id: "102",
        customer: "Zainab Ali",
        status: "In Progress",
        dateTime: "January 18, 2025 08:45 PM",
        items: 5,
        tableNo: 4,
        total: 1800.0,
    },
    {
        id: "103",
        customer: "Hamza Tariq",
        status: "Ready",
        dateTime: "January 18, 2025 09:00 PM",
        items: 3,
        tableNo: 5,
        total: 1200.0,
    },
    {
        id: "104",
        customer: "Ayesha Khan",
        status: "In Progress",
        dateTime: "January 18, 2025 09:15 PM",
        items: 6,
        tableNo: 6,
        total: 2200.0,
    },
];
