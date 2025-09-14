import { GenreColorMap, GenreNameMap, RangeGenreColorMap } from "../components/Maps"
import { RelevantGenres, RelevantSubgenres } from "./Artists"
import chroma from "chroma-js";

function generateGenreList(list: any[]) {
    const genreArray: object[] = [];
    list.forEach(genre => {
        const genreEntity = {
            id: genre,
            name: GenreNameMap[genre],
            color: GenreColorMap[genre]
        }
        genreArray.push(genreEntity)
    })
    return genreArray;
}

function generateSubgenreColors(genreList: any[], subgenreList: any[]) {
    genreList.forEach(genre => {
        const filterGenres = subgenreList.filter(subgenre => subgenre.genre === genre.id)

        const colorArray = chroma.scale([RangeGenreColorMap[genre.id].low, RangeGenreColorMap[genre.id].high]).mode("lab").colors(filterGenres.length)
        let colorIndex = 0;

        filterGenres.forEach(subgenre => {
            subgenre.color = colorArray[colorIndex];
            colorIndex++
        })
    })

    return [...subgenreList];
}

export const GenreList = generateGenreList(RelevantGenres)
export const SubgenreList = generateSubgenreColors(GenreList, RelevantSubgenres);
