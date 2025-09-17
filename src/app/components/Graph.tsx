"use client";

import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";
import { GenreColorMap } from "./Maps";
import { GenreList } from "../api/Genres";

cytoscape.use(fcose);

export function GenerateArtistNodes(list: any[]) {

    const dataArray: { data: { id: any; label: any; popularity: any; followers: any; image: any; genre: any; subgenres: void; type: string; }; }[] = [];

    function generateSubgenreArray(artist: { subgenres: any }): any {
        const subgenreArray: any[] = [];
        artist.subgenres?.forEach((subgenre: { id: any; }) => {
            if (subgenre.id) {
                subgenreArray.push(subgenre.id)
            }
        })
        return subgenreArray;
    }

    list.forEach(artist => {
        const artistData = {
            data: {
                id: artist.id,
                label: artist.name,
                popularity: artist.popularity,
                followers: artist.followers,
                image: artist.image,
                genre: artist.genre.replace(/\s+/g, ""),
                subgenres: generateSubgenreArray(artist),
                type: "artist"
            }
        }
        dataArray.push(artistData);
    })
    return dataArray;
}

export function GenerateWeightNodes(list: any[]) {
    const dataArray: { data: { id: any; label: any; }; }[] = [];

    list.forEach(genre => {
        const genreData = {
            data: {
                id: "genre_" + genre.id,
                label: genre.name,
                type: "anchor"
            }
        }
        dataArray.push(genreData);
    })
    return dataArray;
}

export function GenerateAnchorRelations(list: any[]) {

    const dataArray = [];

    for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
            const dataRelation = {
                data: {
                    source: "genre_" + list[i].id,
                    target: "genre_" + list[j].id,
                    weight: 50,
                    type: "anchor"
                }
            }
            dataArray.push(dataRelation);
        }
    }

    return dataArray;
}

export function GenerateWeightedEdges(list: any[]) {
    const dataArray: { data: { source: any; target: string; weight: unknown; }; }[] = [];

    list.forEach(artist => {

        for (const [target, weight] of Object.entries(artist.weights)) {
            const dataRelation = {
                data: {
                    source: artist.id,
                    target: "genre_" + target,
                    weight: weight,
                    type: "anchor"
                }
            }
            dataArray.push(dataRelation)
        }
    })

    return dataArray;
}

export function GenerateNodeConnections(subgenreList: any[], artistList: any[]) {
    const dataArray: { data: { source: any; target: any; subgenre: any; }; }[] = [];

    subgenreList.forEach(genre => {
        if (genre.count > 1) {
            const matchedArtists = artistList.filter(artist => artist.subgenres.find((subgenre: { id: any; }) => subgenre.id === genre.id))

            if (matchedArtists) {

                for (let i = 0; i < matchedArtists.length; i++) {
                    for (let j = i + 1; j < matchedArtists.length; j++) {
                        const dataConnection = {
                            data: {
                                source: matchedArtists[i].id,
                                target: matchedArtists[j].id,
                                subgenre: genre.id,
                            }
                        }
                        dataArray.push(dataConnection);
                    }
                }
            }
        }
    })

    return dataArray;
}

export default function Graph({ activeArtistList, activeSubgenreList, activeFocus, center, setCenter, bubbleAction, setBubbleAction, setPopupOpen, setActiveArtist }: {
    activeArtistList: any[]; activeSubgenreList: (any[]); activeFocus: string; center: boolean; setCenter: any; bubbleAction: boolean;
    setBubbleAction: any; setPopupOpen: any; setActiveArtist: any
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cyRef = useRef<cytoscape.Core | null>(null);

    const dataList = [
        // Weight Nodes
        ...GenerateWeightNodes(GenreList),

        // Artist Nodes
        ...GenerateArtistNodes(activeArtistList),

        // Weighted Node Pulls
        ...GenerateWeightedEdges(activeArtistList),

        // Weighted Anchor Pulls
        ...GenerateAnchorRelations(GenreList),
    ]

    useEffect(() => {

        cyRef.current = cytoscape({
            container: containerRef.current,
            elements: dataList,
            style: [
                {
                    selector: "node",
                    style: {
                        "background-color": "#60a5fa",
                        label: "data(label)",
                        color: "#000000ff",
                    }
                },
                {
                    selector: "edge",
                    style: {
                        width: 2,
                        "line-color": "#cbd5e1",
                        "curve-style": "bezier",
                    }
                }
            ],
            layout: {
                name: "fcose",
                animate: true,
                nodeRepulsion: 50000,
                idealEdgeLength: (edge: any) => {
                    if (edge.target().target().includes("genre_") && !edge.source().id().includes("genre_")) {
                        return (1000 / edge.data("weight"))
                    } else if (edge.target().id().includes("genre_") && edge.source().id().includes("genre_")) {
                        return 200
                    } else {
                        return 0;
                    }
                },
            } as any,
            userZoomingEnabled: true,
            wheelSensitivity: 5,
        });

        cyRef.current.add(GenerateNodeConnections(activeSubgenreList, activeArtistList))

        cyRef.current.nodes('[type^="anchor"]').style({
            "background-opacity": 0,
            "label": "",
            "text-opacity": 0,
            "text-events": "none",
        });

        cyRef.current.edges('[type^="anchor"]').style({
            width: 0,
        });

        const minSize = 20;
        const maxSize = 60;

        const findData = cyRef.current.nodes().filter(node => node.data().type?.includes("artist")).map((n) => n.data(activeFocus.toLowerCase()));
        const minData = Math.min(...findData);
        const maxData = Math.max(...findData);

        cyRef.current.nodes().forEach((node) => {
            const genre = node.data('genre');
            if (genre) {
                node.style('background-color', GenreColorMap[genre]);
            }


            const data = node.data(activeFocus.toLowerCase());
            if (data) {
                const size = ((Math.log(data) - Math.log(minData)) /
                    (Math.log(maxData) - Math.log(minData))) *
                    (maxSize - minSize) + minSize;
                node.style({
                    width: size,
                    height: size
                });
            }


            const img = node.data("image");
            if (img) {
                node.style({
                    'background-image': img,
                    'background-fit': 'cover',
                    'border-width': 2,
                    'border-color': GenreColorMap[genre]
                })
            }

            node.lock();
        });

        cyRef.current.edges().forEach((edge) => {
            const subgenre = edge.data('subgenre');
            if (subgenre) {
                const colorMatch = activeSubgenreList.find(genre => genre.id === subgenre)
                edge.style('line-color', colorMatch.color)
            }
        })

        cyRef.current.on('tap', 'node', function (evt) {
            const node = evt.target;   // the clicked node
            setPopupOpen(true);
            const findArtist = activeArtistList.find(artist => node.data('id') === artist.id)
            if (findArtist) {
                setActiveArtist(findArtist)
            }
        });

        return () => {
            cyRef.current?.destroy();
        }
    }, []);

    useEffect(() => {

        const minSize = 20;
        const maxSize = 60;

        const findData = cyRef.current?.nodes().filter(node => node.data().type?.includes("artist")).map((n) => n.data(activeFocus.toLowerCase()));
        let minData = null;
        let maxData = null;

        if (findData) {
            minData = Math.min(...findData);
            maxData = Math.max(...findData);
        }

        cyRef.current?.nodes().forEach((node) => {
            const genre = node.data('genre');
            if (genre) {
                node.style('background-color', GenreColorMap[genre]);
            }


            const data = node.data(activeFocus.toLowerCase());
            if (data && minData && maxData) {
                const size = ((Math.log(data) - Math.log(minData)) /
                    (Math.log(maxData) - Math.log(minData))) *
                    (maxSize - minSize) + minSize;
                node.style({
                    width: size,
                    height: size
                });
            }
        });

        if (center) {
            cyRef.current?.center();
            cyRef.current?.fit(cyRef.current.elements(), 50)
            setCenter(false);
        }

    }, [activeFocus, center])

    useEffect(() => {

        if (bubbleAction) {
            cyRef.current?.edges().forEach((edge) => {
                activeSubgenreList.forEach(subgenre => {
                    const target = edge.data('subgenre');
                    if (target === subgenre.id) {
                        if (subgenre.visible === false) {
                            edge.style('display', 'none')
                        } else if (subgenre.visible === true) {
                            edge.style('display', 'element')
                        }
                    }
                })
            })

            cyRef.current?.nodes().filter(node => node.data("subgenres") !== undefined).forEach((node) => {
                node.style('display', 'none')
                activeSubgenreList.forEach(subgenre => {
                    const target = node.data('subgenres');
                    if (target.includes(subgenre.id)) {
                        if (subgenre.visible === true) {
                            node.style('display', 'element')
                        }
                    }
                })
            })
            setBubbleAction(false);
        }

    }, [bubbleAction, activeSubgenreList])

    return <div ref={containerRef} className="w-full h-screen" />
}
