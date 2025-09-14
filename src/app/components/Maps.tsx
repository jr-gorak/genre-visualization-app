
export const GenreNameMap: Record<string, string> = {
    rock: "Rock",
    pop: "Pop",
    country: "Country",
    hiphop: "Hip Hop",
    jazz: "Jazz",
    classical: "Classical",
    electronic: "Electronic",
}

export const GenreColorMap: Record<string, string> = {
    rock: "#f87171",
    pop: "#eb71f8",
    country: "#6dd551",
    hiphop: "#71a7f8",
    jazz: "#f8c471",
    classical: "#ff93f4",
    electronic: "#f8ef71",
}

export const RangeGenreColorMap: Record<string, { low: string; high: string }> = {
    rock: { low: "#7f0000", high: "#ff6c6c" },
    pop: { low: "#4b0053", high: "#f384ff" },
    country: { low: "#115100", high: "#9cff80" },
    hiphop: { low: "#002152", high: "#85b5fe" },
    jazz: { low: "#8d5700", high: "#df8900" },
    classical: { low: "#da00c4", high: "#ffaaf6" },
    electronic: { low: "#b5a900", high: "#fcf595" },

}
