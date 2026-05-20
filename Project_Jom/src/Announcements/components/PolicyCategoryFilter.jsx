
export default function PolicyCategoryFilter({
    categories = [],
    selectedCategory,
    onSelectCategory,
}) {
    const fallbackCategories = [
        { id: "all", label: "All" },
        { id: "healthcare-services", label: "Healthcare" },
        { id: "financial-support", label: "Financial Support" },
        { id: "elderly-support", label: "Elderly Support" },
        { id: "employment-skills", label: "Employment" },
        { id: "education-support", label: "Education" },
        { id: "family-parenting-support", label: "Family" },
        { id: "community", label: "Community" },
    ];

    const visibleCategories = categories.length > 0 ? categories : fallbackCategories;

    return (
        <div className="policy-filter-row">
            {visibleCategories.map((category) => (
                <button
                    key={category.id}
                    type="button"
                    className={
                        selectedCategory === category.id
                            ? "policy-filter-btn active"
                            : "policy-filter-btn"
                    }
                    onClick={() => onSelectCategory(category.id)}
                >
                    {category.label}
                </button>
            ))}
        </div>
    );
}