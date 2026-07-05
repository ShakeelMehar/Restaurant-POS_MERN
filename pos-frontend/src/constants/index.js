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

export const startersItem = [
    { id: 1, name: "Samosa", price: 100, category: "Vegetarian" },
    { id: 2, name: "Pakora", price: 120, category: "Vegetarian" },
    { id: 3, name: "Chicken Tikka", price: 300, category: "Non-Vegetarian" },
    { id: 4, name: "Seekh Kebab", price: 350, category: "Non-Vegetarian" },
    { id: 5, name: "Chapli Kebab", price: 400, category: "Non-Vegetarian" },
    { id: 6, name: "Dahi Bhalla", price: 150, category: "Vegetarian" },
];

export const mainCourse = [
    { id: 1, name: "Chicken Karahi", price: 800, category: "Non-Vegetarian" },
    { id: 2, name: "Mutton Karahi", price: 1200, category: "Non-Vegetarian" },
    { id: 3, name: "Sindhi Biryani", price: 600, category: "Non-Vegetarian" },
    { id: 4, name: "Nihari", price: 700, category: "Non-Vegetarian" },
    { id: 5, name: "Haleem", price: 500, category: "Non-Vegetarian" },
    { id: 6, name: "Daal Chawal", price: 300, category: "Vegetarian" },
];

export const beverages = [
    { id: 1, name: "Lassi", price: 150, category: "Cold" },
    { id: 2, name: "Rooh Afza", price: 100, category: "Cold" },
    { id: 3, name: "Doodh Patti", price: 120, category: "Hot" },
    { id: 4, name: "Peshawari Kahwa", price: 80, category: "Hot" },
    { id: 5, name: "Mango Shake", price: 200, category: "Cold" },
    { id: 6, name: "Lemonade", price: 100, category: "Cold" },
];

export const soups = [
    { id: 1, name: "Chicken Corn Soup", price: 200, category: "Non-Vegetarian" },
    { id: 2, name: "Hot & Sour Soup", price: 250, category: "Non-Vegetarian" },
    { id: 3, name: "Yakhni", price: 150, category: "Non-Vegetarian" },
    { id: 4, name: "Thai Soup", price: 300, category: "Non-Vegetarian" },
    { id: 5, name: "Mulligatawny Soup", price: 250, category: "Non-Vegetarian" },
    { id: 6, name: "Lentil Soup", price: 150, category: "Vegetarian" },
];

export const desserts = [
    { id: 1, name: "Kheer", price: 200, category: "Vegetarian" },
    { id: 2, name: "Gulab Jamun", price: 150, category: "Vegetarian" },
    { id: 3, name: "Rasmalai", price: 250, category: "Vegetarian" },
    { id: 4, name: "Jalebi", price: 100, category: "Vegetarian" },
];

export const bbqGrills = [
    { id: 1, name: "Bihari Boti", price: 400, category: "Non-Vegetarian" },
    { id: 2, name: "Malai Boti", price: 450, category: "Non-Vegetarian" },
    { id: 3, name: "Reshmi Kebab", price: 400, category: "Non-Vegetarian" },
];

export const naanRoti = [
    { id: 1, name: "Roghni Naan", price: 80, category: "Breads" },
    { id: 2, name: "Garlic Naan", price: 100, category: "Breads" },
    { id: 3, name: "Tandoori Roti", price: 30, category: "Breads" },
    { id: 4, name: "Puri", price: 50, category: "Breads" },
    { id: 5, name: "Paratha", price: 60, category: "Breads" },
    { id: 6, name: "Keema Naan", price: 200, category: "Breads" },
];

export const streetFood = [
    { id: 1, name: "Bun Kebab", price: 150, category: "Street Food" },
    { id: 2, name: "Gol Gappay", price: 200, category: "Street Food" },
    { id: 3, name: "Chana Chaat", price: 120, category: "Street Food" },
    { id: 4, name: "Aloo Tikki", price: 100, category: "Street Food" },
    { id: 5, name: "Shawarma", price: 250, category: "Street Food" },
];

export const menus = [
    { id: 1, name: "Starters", bgColor: "#b73e3e", icon: "🍲", items: startersItem },
    { id: 2, name: "Main Course", bgColor: "#5b45b0", icon: "🍛", items: mainCourse },
    { id: 3, name: "Beverages", bgColor: "#7f167f", icon: "🍹", items: beverages },
    { id: 4, name: "Soups", bgColor: "#735f32", icon: "🍜", items: soups },
    { id: 5, name: "Desserts", bgColor: "#1d2569", icon: "🍰", items: desserts },
    { id: 6, name: "BBQ & Grills", bgColor: "#285430", icon: "🍖", items: bbqGrills },
    { id: 7, name: "Naan & Roti", bgColor: "#b73e3e", icon: "🫓", items: naanRoti },
    { id: 8, name: "Street Food", bgColor: "#5b45b0", icon: "🥙", items: streetFood },
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
