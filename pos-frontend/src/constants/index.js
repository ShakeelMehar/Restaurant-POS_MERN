import beefPulao from "../assets/images/menu/beef_pulao_1784401560663.png";
import chickenBiryani from "../assets/images/menu/chicken_biryani_1784401550527.png";
import internationalDrinks from "../assets/images/menu/international_drinks_1784401578939.png";
import kachumberSalad from "../assets/images/menu/kachumber_salad_1784401588292.png";
import mintRaita from "../assets/images/menu/mint_raita_1784401598077.png";
import pakistaniDrinks from "../assets/images/menu/pakistani_drinks_1784401569732.png";
import shamiTikki from "../assets/images/menu/shami_tikki_1784401606274.png";

export const popularDishes = [
    {
        id: 1,
        image: chickenBiryani,
        name: "Chicken Biryani",
        numberOfOrders: 300,
    },
    {
        id: 2,
        image: beefPulao,
        name: "Beef Pulao",
        numberOfOrders: 250,
    },
    {
        id: 3,
        image: shamiTikki,
        name: "Shami Tikki",
        numberOfOrders: 220,
    },
    {
        id: 4,
        image: kachumberSalad,
        name: "Kachumber Salad",
        numberOfOrders: 180,
    },
    {
        id: 5,
        image: mintRaita,
        name: "Mint Raita",
        numberOfOrders: 190,
    },
    {
        id: 6,
        image: pakistaniDrinks,
        name: "Pakistani Drinks",
        numberOfOrders: 270,
    },
    {
        id: 7,
        image: internationalDrinks,
        name: "International Drinks",
        numberOfOrders: 210,
    },
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
