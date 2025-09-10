"use client";

import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";

cytoscape.use(fcose);

const genreColorMap: Record<string, string> = {
    rock: "#f87171",
    pop: "#eb71f8",
    country: "#71a7f8"
}

const subgenreColorMap: Record<string, string> = {
    mathrock: "#ed3131",
    poprock: "#dd427d",
    altrock: "#a41717"
}

const genrePositions = {
    rock: { x: 100, y: 100 },
    pop: { x: 600, y: 1600 },
    country: { x: 350, y: 400 },
};

export default function Graph() {
    const containerRef = useRef<HTMLDivElement>(null);

    const artistList = [
        // Weight Nodes
        { data: { id: "genre_rock", label: "Rock", position: genrePositions.rock }, },
        { data: { id: "genre_pop", label: "Pop", position: genrePositions.pop }, },
        { data: { id: "genre_country", label: "Country", position: genrePositions.country }, },

        // Artist Nodes
        { data: { id: "a1", label: "Artist 1", popularity: 30, image: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Boy_Pablo_Piknik_i_Parken_2019_%28170641%29.jpg", genre: "rock", subgenres: ["mathrock", "poprock", "altrock"], type: "artist" } },
        { data: { id: "a2", label: "Artist 2", popularity: 35, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Charlie_Daniels_in_2017.jpg/500px-Charlie_Daniels_in_2017.jpg", genre: "country", subgenres: ["bluegrass"], type: "artist" } },
        { data: { id: "a3", label: "Artist 3", popularity: 50, genre: "pop", subgenres: ["poprock", "dreampop"], type: "artist" } },
        { data: { id: "a4", label: "Artist 4", popularity: 43, genre: "rock", subgenres: ["altrock", "mathrock", "indierock"], type: "artist" } },
        { data: { id: "a5", label: "Artist 5", popularity: 10, image: "https://s9.limitedrun.com/images/1220731/v600_tricot2017_square_942.jpg", genre: "rock", subgenres: ["mathrock", "jrock"], type: "artist" } },

        // Weighted Pulls
        { data: { source: "a1", target: "genre_rock", weight: 100 } },
        { data: { source: "a1", target: "genre_pop", weight: 10 } },
        { data: { source: "a2", target: "genre_country", weight: 100 } },
        { data: { source: "a3", target: "genre_pop", weight: 100 } },
        { data: { source: "a4", target: "genre_rock", weight: 100 } },
        { data: { source: "a5", target: "genre_rock", weight: 100 } },

        { data: { source: "genre_rock", target: "genre_pop", weight: 5 } },
        { data: { source: "genre_rock", target: "genre_country", weight: 5 } },
        { data: { source: "genre_pop", target: "genre_country", weight: 5 } },
    ]

    useEffect(() => {

        const cy = cytoscape({
            container: containerRef.current,
            elements: artistList,
            style: [
                {
                    selector: "node",
                    style: {
                        "background-color": "#60a5fa",
                        label: "data(label)",
                        color: "#000000ff"
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
                nodeRepulsion: 8000,
                idealEdgeLength: (edge: any) => {
                    if (edge.target().id().includes("genre_") && !edge.source().id().includes("genre_")) {
                        console.log(1000 / edge.data("weight"))
                        return (1000 / edge.data("weight"))
                    } else if (edge.target().id().includes("genre_") && edge.source().id().includes("genre_")) {
                        console.log(edge.target().id())
                        return 200
                    } else {
                        return 0;
                    }
                },
            } as any,
            userZoomingEnabled: true,
            wheelSensitivity: 5,
        });

        const newEdges = [
            { data: { source: "a1", target: "a4", subgenre: "mathrock" } },
            { data: { source: "a1", target: "a5", subgenre: "mathrock" } },
            { data: { source: "a1", target: "a3", subgenre: "poprock" } },
            { data: { source: "a1", target: "a4", subgenre: "altrock" } },
        ]

        cy.add(newEdges)



        cy.nodes('[id^="genre_"]').style({
            "background-opacity": 0,
            "label": "",
            "text-opacity": 0,
            "text-events": "none",
        });

        cy.edges('[target^="genre_"]').style({
            width: 0,
            "line-color": "transparent",
        });

        const minSize = 20;
        const maxSize = 60;

        const popularities = cy.nodes().filter(node => node.data().type?.includes("artist")).map((n) => n.data("popularity"));
        const minPop = Math.min(...popularities);
        const maxPop = Math.max(...popularities);

        cy.nodes().forEach((node) => {
            const genre = node.data('genre');
            if (genre) {
                node.style('background-color', genreColorMap[genre]);
            }

            const pop = node.data('popularity');
            const size = ((pop - minPop) / (maxPop - minPop)) * (maxSize - minSize) + minSize
            node.style({
                width: size,
                height: size
            });

            const img = node.data("image");
            if (img) {
                node.style({
                    'background-image': img,
                    'background-fit': 'cover',
                    'border-width': 1,
                    'border-color': genreColorMap[genre]
                })
            }

            node.lock();
        });

        cy.edges().forEach((edge) => {
            const subgenre = edge.data('subgenre');
            if (subgenre) {
                edge.style('line-color', subgenreColorMap[subgenre])
            }
        })

        return () => {
            cy.destroy();
        }
    }, []);

    return <div ref={containerRef} className="w-full h-screen" />
}
