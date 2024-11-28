import BudgetCategory from "./BudgetCategory";

const VendorCategory = Object.freeze([
    { id: 1, categoryName: "Venues", categoryType: "event_venue", categoryQuery: "business conferences, corporate events, industry seminars" },
    { id: 2, categoryName: "Caterers", categoryType: "catering", categoryQuery: "wedding planning, bridal shows, wedding venues" },
    { id: 3, categoryName: "Photographers", categoryType: "photographer", categoryQuery: "skills workshops, hands-on training, personal development" },
    { id: 4, categoryName: "Liquor store", categoryType: "liquor_store", categoryQuery: "live music, music festivals, concert tickets" },
    { id: 5, categoryName: "Musicians", categoryType: "night_club", categoryQuery: "team building, company retreats, corporate getaways" },
    { id: 7, categoryName: "Florist", categoryType: "florist", categoryQuery: "trade shows, art exhibitions, product showcases" },
    { id: 8, categoryName: "Rental Equipments", categoryType: "hardware_store", categoryQuery: "networking mixers, business meetups, professional gatherings" },
    { id: 9, categoryName: "Makeup Artist", categoryType: "beauty_salon", categoryQuery: "family reunions, picnics, community gatherings" },
    { id: 10, categoryName: "Car rental", categoryType: "car_rental", categoryQuery: "networking mixers, business meetups, professional gatherings" },
    { id: 11, categoryName: "Event Transport", categoryType: "car_rental", categoryQuery: "family reunions, picnics, community gatherings" },
    { id: 12, categoryName: "Convenience Store", categoryType: "convenience_store", categoryQuery: "family reunions, picnics, community gatherings" },
]);

const getBudgetItemCategory = (category) => {
    const budgetItemCategory = VendorCategory.find(vendor => vendor.categoryType === category);

    if (budgetItemCategory) {
        console.log(budgetItemCategory.categoryName);
        switch (budgetItemCategory.categoryName) {
            case "Venues":
                return BudgetCategory.VENUE;

            case "Caterers":
                return BudgetCategory.FOOD;

            case "Photographers":
                return BudgetCategory.PHOTOGRAPH;

            case "Liquor store":
                return BudgetCategory.FOOD;

            case "Musicians":
                return BudgetCategory.ENTERTAINMENT;

            default:
                return BudgetCategory.MISC;
        }
    } else {
        console.log("Category not found.");
        return BudgetCategory.MISC;
    }
}
export { VendorCategory, getBudgetItemCategory };